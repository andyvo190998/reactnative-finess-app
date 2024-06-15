import { addUser, login, upgrade, renewPassword } from '../controllers/user.js';

import express from 'express';
// import { addUser } from '../controllers/user.js'

const router = express.Router();

router.post("/register", addUser);
router.post("/login", login);
router.put("/upgrade", upgrade);
router.put("/renewpassword", renewPassword);

export default router;