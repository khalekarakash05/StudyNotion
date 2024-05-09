const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.updateProfile = async(req, res) => {
    try {//TODO: how to schedule the req in such a way that account of user to be deleted after 5 days
        //cron job



        //get data 
        const {dateOfBirth="", about="", gender, contactNumber} = req.body;

        //get userId
        const id =  req.user.id;
        //validation
        if(!gender || !contactNumber || !id){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        //find profile
        console.log("id", id);
        uid = JSON.stringify(id);
        console.log("id", uid);
        
        const userdetails = await User.findById(id);
        console.log("profileid", userdetails.additionDetails._id);
        const profileId = userdetails.additionDetails._id;
        const profileDetails = await Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        profileDetails.about = about;
        await profileDetails.save();
        //return response
        return res.status(200).json({
            success: true,
            profileDetails,
            message: "Profile is updated successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating profile",
        })
    }
}


exports.deleteUser = async(req, res) => {
    try {
        //get id 
        // console.log("object", req.user);
        const id = req.user.id;

        // validate id
        console.log("id", id);
        const userdetails = await User.findById(id);
        if(!userdetails){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        // delete profile
        // console.log("object", userdetails.additionDetails);
        await Profile.findByIdAndDelete({_id: userdetails.additionDetails});
        //TODO: unroll user from all enrolled users

        //delete user
        await User.findByIdAndDelete({_id: id});
        //return response
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occured while deleting user",
        })
    }
}


//getuser handler
exports.getUserDetails = async(req, res) => {
    try {
        //get id
        const id = req.user.id;
        //validate that get user details
        const userdetails = await User.findById(id).populate("additionDetails").exec();

        if(!userdetails){
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        //return response
        return res.status(200).json({
            success: true,
            userdetails,
            message: "User details fetched successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured while fetching user data, Please try again",
        })   
    }
}

//update displaypicture
exports.updateDisplayPicture = async(req, res) => {
    try {
        //get id
        const id = req.user.id;

        //validate id
        const userdetails = await User.findById(id);

        if(!userdetails){
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        
        
        //update image
        const image = req.files.image;

        //upload image to cloudinary
        const result = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);

        //update image url in db
        const profileDetails = await User.findByIdAndUpdate({_id: id}, 
            {image: result.secure_url}, {new: true});

        //return response
        return res.status(200).json({
            success: true,
            profileDetails,
            message: "Profile picture updated successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
//get enrolled courses