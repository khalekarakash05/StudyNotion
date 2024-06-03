const { mongoose, Types } = require("mongoose");
const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { json } = require("express");


//capture the payment and initiate the razorpay order
exports.capturePayment = async(req, res) => {
    //get course id and user id 
    const {courseId} = req.body;
    const userId = req.user.id;
    //validation
    //valid course id
    if(!courseId){
        return res.status(400).json({
            success: false,
            message: "Please provide valid course id",
        })
    }
    //valid course details
    let courseDetails;
    try {
         courseDetails = await Course.findById({courseId});
         //validate course details present or not
         if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Could not find the course",
            })
         }
        // is user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if(Course.studentEnrolled.includes(uid)){
            return res.status(401).json({
                success: false,
                message: "Student is already enrolled",
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
    
    //order create 
    const amount = Course.price;
    const currency = "INR";

    const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                course_id: courseId,
                userId
            }
    }
    try {
        //intiate the instance 
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        //return response
        return res.status(200).json({
            success: true,
            courseName: Course.courseName,
            courseDescription: Course.courseDescription,
            thumbnail: Course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,

        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not intiate order",
        })
    }

}


//verify signature of razorpay and Server

exports.verifySignature = async(req, res) => {
    try {
        const webHookSecret = "123456";

        const signature = req.header["x-razorpay-signature"];

        //three steps 
        const shasum = crypto.createHmac("sha256", webHookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");//webhooksecret is converted into digest

        //check fo signature and digest are match or not
        if(signature === digest){
            console.log("Payment is Authorised");

            const {courseId, userId} = req.body.payload.payment.entity.notes;

            try {
                //fullfill the action

                //find the course and enroll the student in it
                const enrolledCourse = await Course.findOneAndUpdate(
                    {_id: courseId},
                    {$push: {
                        studentEnrolled: userId
                    }},
                    {new: true},
                );

                //validate enrolled course
                if(!enrolledCourse){
                    return res.status(500).json({
                        success: false,
                        message: "Course not found",
                    })
                }

                console.log("enrolled course", enrolledCourse);

                //now update the course in user collection
                const enrolledStudent = await User.findOneAndUpdate(
                    {_id: userId},
                    {$push: {
                        courses: courseId
                    }},
                    {new: true}
                );
                console.log("enrolledStudent", enrolledStudent)

                //send congrutualations mail
                const emailResponse = await mailSender(
                            enrolledStudent.email,
                            "Congratulations from CodeHelp",
                            "Congratulations, you are onboarded into new Codehelp Course",
                );

                console.log("email response", emailResponse);

                return res.status(200).json({
                    success: true,
                    message: "Signature verified and course added",
                })

            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message,
                })
            }
        }
        else{
            return res.status(400).json({
                success: false,
                message: "Invalid request",
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}