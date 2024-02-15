import { addUser, login } from '../controllers/user.js'

import express from 'express'
// import { addUser } from '../controllers/user.js'

const router = express.Router()

router.post("/register", addUser)
router.post("/login", login)

export default router