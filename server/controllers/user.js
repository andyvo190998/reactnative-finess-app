// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const User = require('../models/user')
import bcrypt from 'bcryptjs'
import User from '../models/user.js'
export const addUser = async (req, res) => {
    try {
        console.log(req.body)
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