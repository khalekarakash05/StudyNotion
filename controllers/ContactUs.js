const User = require("../models/User");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

exports.contactUs = async(req, res) => {
    try {
        //get the user data from req body 
        const {firstName, lastName, email, contactNumber, message} = req.body;

        //validation
        if(!firstName || !lastName || !email || !contactNumber || !message){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //send mail to user that their message has been received
        console.log("Heare");
        const userData = await mailSender(
            email,
            "Message Received",
            `Hello ${firstName} ${lastName}, your message has been received. We will get back to you shortly`
        );

        //save the message to the database - optional


        //send mail to admin that a new message has been received
        const adminData = await mailSender(
            process.env.ADMIN_EMAIL,
            "New Message Received",
            `Hello Admin, a new message has been received from 
                ${firstName} ${lastName}. Kindly check the message and get back to the user
                Email: ${email} 
                Contact Number: ${contactNumber}
                Message: ${message}`
        );

        return res.status(200).json({
            success: true,
            message: "Message has been received successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}