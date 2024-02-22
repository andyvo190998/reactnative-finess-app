// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const User = require('../models/user')
import bcrypt from 'bcryptjs'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
export const addUser = async (req, res) => {
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword
        })
        return res.status(200).json("success")
    } catch (error) {
        res.status(404).json(error)
    }
}

export const login = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    })

    if (!user) {
        return res.status(404).json('User not found!')
    }
    const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
    )
    if (isValidPassword) {
        const authenticatedUser = {
            name: user.name,
            email: user.email,
            membership: user.membership,
            trialEndDate: user.trialEndDate,
        }
        const token = jwt.sign(authenticatedUser, 'secret123')

        // const expirationTime = 10 * 60 * 10000; //10 minutes in milliseconds
        // const expiryDate = new Date(Date.now() + expirationTime);
        // return res.cookie("access_token", token, {
        //     secure: true,
        //     httpOnly: true,
        //     sameSite: 'none',
        // }).status(200).json('login success')
        return res.status(200).json({ token: token, authenticatedUser: authenticatedUser })

    } else {
        return res.status(401).json('Invalid email or password')
    }
}

export const upgrade = async (req, res) => {
    console.log(req.body)
    try {
        const result = await User.findOneAndUpdate({
            email: req.body.email
        }, {
            membership: req.body.newMembership,
            trialEndDate: null
        }, {
            new: true
        })
        return res.status(200).json(result)
    } catch (error) {
        return res.status(404).json(error)
    }


    // if (!user) {
    //     return res.status(404).json('User not found!')
    // }
}