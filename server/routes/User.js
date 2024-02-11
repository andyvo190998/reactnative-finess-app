import { addUser } from '../controllers/user.js'

import express from 'express'
// import { addUser } from '../controllers/user.js'

const router = express.Router()

router.post("/register", addUser)

export default router