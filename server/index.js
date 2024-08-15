import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './models/db.js';
import userRouter from './routes/User.js';
import trainingRouter from './routes/Training.js';

import cookieParser from 'cookie-parser';
const app = express();
const port = 5000;

//example for auth
//https://github.com/codedamn/full-mern-stack-video/blob/part1/server/index.js
dotenv.config().parsed;
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
};
connectDB();


// https://drive.google.com/uc?export=view&id=1V1z66ILlv5TMsi-spsZGphaRmamSbiin
// https://drive.google.com/file/d/1PtAEbme93DYmMEqz43pv2oUX1dIYM9tT/preview


app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/training', trainingRouter);
app.get('/', (req, res) => {
    res.send({ 'mybs': "Hello World" });
});

app.listen(port, () => {
    console.log(`Express is listening on port ${port}`);
});