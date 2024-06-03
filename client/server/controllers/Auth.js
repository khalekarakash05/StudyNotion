const User = require("../models/User");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//sendOTP
exports.sendOTP = async(req, res) =>{
    try {
        
        //sendOTP

    //fetch email from req ki body
    const {email} = req.body;

    //validate email fill or not
    if(!email){
        return res.status(401).json({
            success: false,
            message: "please enter the email"
        })
    }

    //then validate is email already exists
    const checkUserExists = await User.findOne({email})
    
    //if exists then return a response
    if(checkUserExists){
        return res.status(401).json({
            success: false,
            message: "User already registered"
        })
    }

    //if not exists then genetate otp
    var otp =  otpGenerator.generate(6,{
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    })

    //now check wheather that otp is already exists in db

    const result = await Otp.findOne({otp: otp});

    //if yes then again generate new otp
    while(result){
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })

        result = await Otp.findOne({otp: otp});
    }

    const otpPayload = {email, otp};
    console.log("otpPayload", otpPayload);
    //if not then create entry in db with email and otp
    const otpBody = await Otp.create(otpPayload);

    //send the response
    res.status(200).json({
        success: true,
        message: "OTP sent Successfully",
        otpPayload
    })


    } catch (error) {
        console.log("error occured while generating otp", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
}

//signUp
exports.signUp = async(req, res) =>{
    try {
         //signUp

    //data fetch from req body
    const {
        firstName, lastName, email, password, confirmPassword, accountType,
        contactNumber, otp
    } = req.body;

    //validate karlo data ko
        if(!firstName || !lastName || !email || !password ||
            !confirmPassword || !otp){
                return res.status(403).json({
                    success: false,
                    message: "All fields are required",
                })
            }
    //2 password ko match karlo
    if(password != confirmPassword){
        return res.status(400).json({
            success: false,
            message:"Password and Confirm password value does not match, please try again"
        })
    }
    //check user already exists or not
    const existingUser = await User.findOne({email});

    if(existingUser){
        //user already exists hai
        return res.status(401).json({
            success: false,
            message: "User already registered",
        })
    }
    //find most recent OTP stored for that user
    const recentOTP = await Otp.find({ email: email }).sort({ createdAt: -1 }).limit(1);
    console.log("recentOTP", recentOTP);

    //validate otp with otp send in mail
    if(recentOTP.length === 0){
        //otp not found
        return res.status(400).json({
            success: false,
            message: "OTP Not Found",
        })
    }
    const otpObject = recentOTP[0];
    console.log("otpObject", otpObject.email, otpObject.otp);
    
    if(otp != otpObject.otp){
        return res.status(400).json({
            success: false,
            message: "Invalid OTP",
        })
    }
    //hash karlo password ko

    const hashedPassword = await bcrypt.hash(password, 10);

    //db me entry create karlo

    const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        contactNumber: null,
        about: null,
    })

    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        contactNumber,
        accountType,
        additionDetails: profileDetails._id,
        image: `https://api.dicebear.com/8.x/initials/svg?seed=${firstName} ${lastName}`
    })
    //return response

    return res.status(200).json({
        success: true,
        user,
        message: "User is Registered successfully",
    })
    } catch (error) {
        console.log("error occured while user registration", error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, please try again",
        })
    }
}

//logIn
exports.login = async(req, res) => {
    try {
        //get data from req body

    const {email, password} = req.body;

    //validation of data
    if(!email || !password){
        return res.status(403).json({
            success: false,
            message: "All fields are required, please try again",
        })
    }
    //check user exists or not 
    const user = await User.findOne({email}).populate("additionDetails");
    
    if(!user){
        return res.status(401).json({
            success: false,
            message: "User is not registerd, Please Sign up first",
        })
    }

    //generate json web token after password match
    if(await bcrypt.compare(password, user.password)){
        //agar password match hua to hi ham jwt generate karenge
        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: "2h",
        });

        user.token = token;
        user.password = undefined;

        //create cookie and send it into response
        const options = {
            expires: new Date(Date.now()+ 3*24*60*60*1000),
            httpOnly: true,
        };

        return res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "User Logged in successfully",
        })
    }
    else{
        return res.status(401).json({
            success: false,
            message: "Password is incorrect",
        })
    }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failure, Please try again"
        });
    }
    
}

//changePassword =>check this controller of home work
exports.changePassword = async(req, res) =>{
    try {
        //get data from req body
    const {oldPassword, newPassword, confirmPassword} = req.body;

    //get old password, new password, confirm password
    //validate data
    if(!oldPassword || !newPassword || !confirmPassword){
        return res.status(403).json({
            success: false,
            message: "All fields are required, please try again",
        })
    }
    //check user exists or not
    const user = req.user;
    //if user not exists call db by using email id in cookie
    if(!user){
        return res.status(401).json({
            success: false,
            message: "User not found, Please login first",
        })
    }
    //if user exists then
    //match old password
    const result = await bcrypt.compare(oldPassword, user.password);
    if(!result){
        return res.status(401).json({
            success: false,
            message: "Old password is incorrect",
        })
    }
    //if password match then
    if(newPassword != confirmPassword){
        return res.status(400).json({
            success: false,
            message: "New password and confirm password does not match, please try again",
        })
    }
    //hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    //update password in db
    const updated = await User.findByIdAndUpdate(user.id, {password: hashedPassword});
    // console.log("updated pass", updated)
    //send mail to user = password changed successfully
    sendMail(user.email, "Password Changed Successfully", "Your password has been changed successfully !!!");
    //return response
    return res.status(200).json({
        success: true,
        message: "Password changed successfully",
    })
    } catch (error) {
        console.log("error occured while changing password", error);
        return res.status(500).json({
            success: false,
            message: "Password cannot be changed, please try again",
        })
    }
}