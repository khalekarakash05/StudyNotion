const Course = require("../models/Course");
//const Category = require("../models/Category")
const User = require("../models/User");
const Categorys = require("../models/Category");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();

//create course handler
exports.createCourse = async(req, res) => {
    try {
        //fetch data 
        const {courseName, courseDescription, whatWillYouLearn, price, tag, Category} = req.body;

        //get thumbnail Image
        const thumbnail = req.files.thumbnailImage;
 
        //validation
        console.log("courseName", courseName, "courseDescription", courseDescription, "whatWillYouLearn", whatWillYouLearn, "price", price, "tag", tag, "Category", Category, "thumbnail", thumbnail);
        if(!courseName || !courseDescription || !whatWillYouLearn || !price
            || !tag  || !Category || !thumbnail){
                return res.status(401).json({
                    success: false,
                    message: "Fill all the details carefully",
                })
        
        }
        //check for is it instructor
        const userId = req.user.id;
        console.log("object", userId);
        const instructorDetails = await User.findById(userId);
        console.log("instructor details", instructorDetails);
        //TODO : check that userId and instructordetails id same or different

        if(!instructorDetails){
            return res.status(402).json({
                success: false,
                message: "Instructor details are Incorrect",
            })
        }

        //check given tag is valid or not

        const tagDetails = await Categorys.findById(Category);
        if(!tagDetails){
            return res.status(400).json({
                success: false,
                message: "Tag details are Incorrect",
            })
        }
        //upload image to cloudinary
        
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)
        
        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatWillYouLearn: whatWillYouLearn,
            price,
            tags: tag,
            category: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });
        //add the new course to the user schema of Instructor
        const addCourseToUser = await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id
                }
            },
            {new: true},
        )
        //update tag schema
        const addCourseToTag = await Categorys.findByIdAndUpdate(
            {_id: tagDetails._id},
            {
                $push:{
                    course: newCourse._id,
                }
            }
        )
        //return response
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
            userData: addCourseToTag,
            categoryData: tagDetails
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured while creating new course",
        })
    }
}

//getAll courses handler

exports.showAllCourse = async(req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentEnrolled: true,
        }).populate("Instructor").exec();

        return res.status(200).json({
            success: true,
            message: "Data for all courses are fetched successfully",
            data: allCourses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured while fetching all courses"
        })
        
    }
}

//get Course details

exports.getAllCourseDetails = async(req, res) => {
    try {
        //get course id from req ki body 
        const {courseId} = req.body;

        //now validate that courseid
        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "Course is not available",
            })
        }
        //now fetch all the course details
        const courseDetails = await Course.findById(
            {_id: courseId}
        ).populate({
            path: "instructor",
            populate: {
                path: "additionDetails"
            }
        }).populate("ratingAndReviews")
        .populate("category")
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })
        .populate("studentEnrolled").exec();

        //now validate that courseDetails
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Course details are not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Course details are fetched successfully",
            courseDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

