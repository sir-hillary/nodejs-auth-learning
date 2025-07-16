const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

//register controller

const registerUser = async (req,res) => {
    try {
        //extract user information from our request body
        const {user, email, password, role} = req.body;

        //check if the user is already existing in the database

        const checkExistingUser = await User.findOne({$or : [{user}, {email}]});
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'The user already exists with either the same user name or email. Try again with different credentials'
            })
        }

        //hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //create a new user

        const newlyCreatedUser = await User.create({
            user,
            email,
            password: hashedPassword,
            role: role || 'user'
        })

        if(!newlyCreatedUser){
            res.status(404).json({
                success: false,
                message: 'Unable to register the user!'
            })
        }

        res.status(201).json({
            success: true,
            message: 'User registered successfully!'
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "something went wrong. Please try again!"
        })
    }
}

//login controller

const loginUser = async (req,res) => {
    try {
        const { user, password} = req.body;

        
        //find if the current user exists in the database

        const person = await User.findOne({user});
        if(!person){
            return res.status(404).json({
                success: false,
                message: 'user doesnt exist!'
            })
        }

        //check whether the password is correct or not

        const isPasswordMatch = await bcrypt.compare(password, person.password);

        if(!isPasswordMatch){
            return  res.status(400).json({
                success: false,
                message: 'wrong password. Please enter the correct password!'
            })
        }

        //creating the user token

        const accessToken = jwt.sign({
            userId: person._id,
            user: person.user,
            role: person.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '30m'
        })

        res.status(200).json({
            success: true,
            message: 'Logged in successfully!',
            accessToken
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again!'
        })
    }
};


const changePassword = async (req, res) => {
    try {

        //getting the logged in userId
        const loginId = req.userInfo.userId;

        //extract old and new password
        const {oldPassword, newPassword} = req.body;


        //find the currently logged in user

        const existingUser = await User.findById(loginId);

        if(!existingUser){
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            })
        }

        //checking if the old password is correct

        const isPasswordMatching = await bcrypt.compare(oldPassword, existingUser.password);

        if(!isPasswordMatching){
            return res.status(400).json({
                success: false,
                message: 'the old password is not correct please try entering the correct password!'
            })
        }

        //hashing the new password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword,salt)

        //update user password

        existingUser.password = newHashedPassword
        await existingUser.save();

        res.status(200).json({
            success: true,
            message: "Password change successfully!"
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'some error occured! Please try again...',
        })
    }
}


module.exports = {
    registerUser,
    loginUser,
    changePassword
}