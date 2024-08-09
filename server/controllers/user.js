// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const User = require('../models/user')
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
export const addUser = async (req, res) => {
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword
        });
        return res.status(200).json("success");
    } catch (error) {
        return res.status(404).json(error);
    }
};

export const login = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        return res.status(404).json('User not found!');
    }

    const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (isValidPassword) {
        const authenticatedUser = {
            name: user.name,
            email: user.email,
            membership: user.membership,
            trialEndDate: user.trialEndDate,
        };
        const token = jwt.sign(authenticatedUser, 'secret123');

        // const expirationTime = 10 * 60 * 10000; //10 minutes in milliseconds
        // const expiryDate = new Date(Date.now() + expirationTime);
        // return res.cookie("access_token", token, {
        //     secure: true,
        //     httpOnly: true,
        //     sameSite: 'none',
        // }).status(200).json('login success')
        return res.status(200).json({ token: token, authenticatedUser: authenticatedUser });

    } else {
        return res.status(401).json('Invalid email or password');
    }
};

export const renewPassword = async (req, res) => {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    try {
        const user = await User.findOne({
            email: req.body.email
        });

        if (!user) {
            return res.status(404).json('User not found!');
        }

        await User.findOneAndUpdate({
            email: req.body.email
        }, {
            password: newPassword,
        });
        return res.status(200).json('Update password success!');
    } catch (error) {
        return res.status(404).json(error);
    }
};

export const upgrade = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({
            email: req.body.email
        }, {
            membership: req.body.newMembership,
            trialEndDate: null
        }, {
            new: true
        });
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }
        const authenticatedUser = {
            name: user.name,
            email: user.email,
            membership: user.membership,
            trialEndDate: user.trialEndDate,
        };
        const token = jwt.sign(authenticatedUser, 'secret123');
        return res.status(200).json({ token: token, authenticatedUser: authenticatedUser });
    } catch (error) {
        return res.status(404).json(error);
    }


    // if (!user) {
    //     return res.status(404).json('User not found!')
    // }
};

export const extendTrial = async (req, res) => {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(404).json({ error: "email undefined" });
        }
        function formatDateToISOWithTimezone(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const day = String(date.getDate()).padStart(2, '0');

            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

            // Get timezone offset in minutes
            const timezoneOffset = -date.getTimezoneOffset();
            const sign = timezoneOffset >= 0 ? '+' : '-';
            const absOffset = Math.abs(timezoneOffset);
            const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
            const offsetMinutes = String(absOffset % 60).padStart(2, '0');

            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${offsetHours}:${offsetMinutes}`;
        }

        const newTrialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const formattedDate = formatDateToISOWithTimezone(newTrialEndDate);

        const user = await User.findOneAndUpdate({
            email: email
        }, {
            trialEndDate: formattedDate
        }, {
            new: true
        });

        if (!user) {
            return res.status(404).json({ error: "user not found" });
        } else {
            return res.status(200).json({
                message: "Extend Success",
                payload: user.trialEndDate
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};