const { mongoose, Types } = require("mongoose");
const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const sendSMS = require("../utils/smsSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail")
const { json } = require("express");
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail")
const crypto = require('crypto');
const CourseProgress = require("../models/CourseProgress");
// const { ConversationContextImpl } = require("twilio/lib/rest/conversations/v1/conversation");


const extractCourseIds = (body) => {
    const courses = [];

    Object.keys(body).forEach(key => {
        // Match the format 'courses[]'
        const singleCourseMatch = key.match(/^courses\[\]$/);
        // Match the format 'courses[0][0]'
        const multipleCourseMatch = key.match(/^courses\[\d+\]\[\d+\]$/);
        
        if (singleCourseMatch) {
            courses.push(body[key]);
        } else if (multipleCourseMatch) {
            courses.push(body[key]);
        }
    });

    return courses;
}



exports.capturePayment = async(req, res) => {
    const {courses} = req.body;
    const userId = req.user.id;

    console.log("courses, userID", courses, " ", userId);

    if(courses.length === 0){
        return res.status(404).json({
            success: false,
            message: "Please provide course id"
        })
    }

    let totalAmount = 0;

    for(const course_id of courses){
        let course;
        try {
            console.log("courseId", course_id)
            course = await Course.findById(course_id);
            console.log("course", course)
            if(!course){
                return res.status(404).json({
                    success: false,
                    message: "course not found"
                })
            }


            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentEnrolled.includes(uid)){
                return res.status(401).json({
                    success: false,
                    message: "Student is already enrolled to the course"
                })
            }
            console.log("until here");
            totalAmount += course.price;

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    const options = {
        amount : totalAmount * 100,
        currency : "INR",
        receipt: Math.random(Date.now()).toString(),
        // notes: {
        //     course_id: courseI
        // }

    }   
    console.log("option", options)

    try {
        const paymentResponse = await instance.orders.create(options);
        
        
        res.status(200).json({
            success: true,
            data: paymentResponse,
            message: paymentResponse,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Could not initiate order"
        })
    }
}


//verify payment

exports.verifyPayment = async(req, res) => {
    console.log("inside verifyPayment", req.body, "find courses", req.body?.courses)
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    
    // const courses = req.body?.courses;
    // const courses = req.body['courses[]'] ? [req.body['courses[]']] : req.body.courses;
    const courses = extractCourseIds(req.body);
    // let courses = req.body?.courses;
    // if (courses && !Array.isArray(courses)) {
    //     courses = [courses];
    // }
    console.log("first course", courses);
    const userId = req.user.id;

    console.log("razorpay_order_id", razorpay_order_id, "razorpay_payment_id", razorpay_payment_id, "razorPay_signature", razorpay_signature, "courses", courses, "userid", userId)

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.status(400).json({
            success: false,
            message: "Payment failed"
        })
    } 

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
                                    .update(body.toString())
                                    .digest("hex");

    console.log("expectedsignature", expectedSignature);
    if(expectedSignature === razorpay_signature){
        //enroll the student
        console.log("jdfjsfjskfj")
        await enrolledStudent(courses, userId, res);
        console.log("here");
        return res.status(200).json({
            success: true,
            message: "Payment verified"
        })


    }
    else{
        return res.status(400).json({
            success: false,
            message: "Payment failed"
        })
}
}

//enroll the student into the course
const enrolledStudent = async(courses, userId, res) => {
        if(!userId || !courses){
            return res.status(400).json({
                success: false,
                message: "Please provide valid data"
            })
        }

        console.log("courses", courses)
        for(const courseId of courses){
                try {
                    //find the course and enrolled stuendts in it
                    console.log("here Courseid", courseId)
                const enrolledCourse = await Course.findByIdAndUpdate(
                    {_id: courseId},
                    {$push: {
                        studentEnrolled: userId
                    }},
                    {new: true}
                )
                console.log("enrolledCourse", enrolledCourse);
                if(!enrolledCourse){
                    return res.status(404).json({
                        success: false,
                        message: "Course not found"
                    })
                }

               const courseProgress =  await CourseProgress.create({
                    courseID: courseId,
                    userID: userId,
                    completedVideos: []
                })
                console.log("courseki progress", courseProgress);

                //find the student and add the course to their list of enrolled student 
                const enrolledStudent = await User.findByIdAndUpdate(userId, 
                    {$push: {
                        courses: courseId,
                        courseProgress: courseProgress._id
                    }},
                    {new: true}
                )
            
                console.log("enrolledstudent", enrolledStudent);
                //send email to the student

                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    `Successfully Enrolled into ${enrolledCourse.courseName}`,
                    courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledCourse.firstName}`)
                )

                console.log("email", emailResponse)

                console.log("email sent successfully", emailResponse.response);

                //send sms to the student
                const smsResponse = await sendSMS(
                    `Successfully Enrolled into ${enrolledCourse.courseName}`,
                    enrolledStudent.phoneNumber,

                )
                console.log("response of sms", smsResponse);
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({
                        success: false,
                        message: "Internal server error"
                    })
                }
        }
}


exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;
    console.log("orderId", orderId, "paymentId", paymentId, "amount", amount)

    const userId = req.user.id;
    console.log("userId", userId);

    if(!orderId || !paymentId ||!amount ||!userId){
        return res.status(400).json({
            success: false,
            message: "Please provide all the fields",
        })
    }

    try {
        const enrolledStudent = await User.findById(userId);
        console.log("enrolledStuedent", enrolledStudent)
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`,
                    amount/100, orderId, paymentId
            )
        )

        return res.status(200).json({
            success: true,
            message: "Email sent successfully"
        })
    } catch (error) {
        console.log("Error in sending email", error);
        return res.status(500).json({
            success: false,
            message: "Could not send the email" 
        })
    }
}   


//capture the payment and initiate the razorpay order
// exports.capturePayment = async(req, res) => {
//     //get course id and user id 
//     const {courses} = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid course id
//     if(!courseId){
//         return res.status(400).json({
//             success: false,
//             message: "Please provide valid course id",
//         })
//     }
//     //valid course details
//     let courseDetails;
//     try {
//          courseDetails = await Course.findById({courseId});
//          //validate course details present or not
//          if(!courseDetails){
//             return res.status(404).json({
//                 success: false,
//                 message: "Could not found the course",
//             })
//          }
//         // is user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(Course.studentEnrolled.includes(uid)){
//             return res.status(401).json({
//                 success: false,
//                 message: "Student is already enrolled",
//             })
//         }
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         })
//     }
    
//     //order create 
//     const amount = Course.price;
//     const currency = "INR";

//     const options = {
//             amount: amount * 100,
//             currency,
//             receipt: Math.random(Date.now()).toString(),
//             notes: {
//                 course_id: courseId,
//                 userId
//             }
//     }
//     try {
//         //intiate the instance 
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         //return response
//         return res.status(200).json({
//             success: true,
//             courseName: Course.courseName,
//             courseDescription: Course.courseDescription,
//             thumbnail: Course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount,

//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Could not intiate order",
//         })
//     }

// }


// //verify signature of razorpay and Server

// exports.verifySignature = async(req, res) => {
//     try {

//         //server ka signature
//         const webHookSecret = "123456";

//         //razorPay signature
//         const signature = req.header["x-razorpay-signature"];

//         //three steps 
//         const shasum = crypto.createHmac("sha256", webHookSecret);
//         shasum.update(JSON.stringify(req.body));
//         const digest = shasum.digest("hex");//webhooksecret is converted into digest

//         //check fo signature and digest are match or not
//         if(signature === digest){
//             console.log("Payment is Authorised");

//             const {courseId, userId} = req.body.payload.payment.entity.notes;

//             try {
//                 //fullfill the action

//                 //find the course and enroll the student in it
//                 const enrolledCourse = await Course.findOneAndUpdate(
//                     {_id: courseId},
//                     {$push: {
//                         studentEnrolled: userId
//                     }},
//                     {new: true},
//                 );

//                 //validate enrolled course
//                 if(!enrolledCourse){
//                     return res.status(500).json({
//                         success: false,
//                         message: "Course not found",
//                     })
//                 }

//                 console.log("enrolled course", enrolledCourse);

//                 //now update the course in user collection
//                 const enrolledStudent = await User.findOneAndUpdate(
//                     {_id: userId},
//                     {$push: {
//                         courses: courseId
//                     }},
//                     {new: true}
//                 );
//                 console.log("enrolledStudent", enrolledStudent)

//                 //send congrutualations mail
//                 const emailResponse = await mailSender(
//                             enrolledStudent.email,
//                             "Congratulations from CodeHelp",
//                             "Congratulations, you are onboarded into new Codehelp Course",
//                 );

//                 console.log("email response", emailResponse);

//                 return res.status(200).json({
//                     success: true,
//                     message: "Signature verified and course added",
//                 })

//             } catch (error) {
//                 return res.status(500).json({
//                     success: false,
//                     message: error.message,
//                 })
//             }
//         }
//         else{
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid request",
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         })
//     }
// }