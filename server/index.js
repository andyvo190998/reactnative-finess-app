import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './models/db.js';
import userRouter from './routes/User.js';
import trainingRouter from './routes/Training.js';

import cookieParser from 'cookie-parser';
// const { google } = require('googleapis');

// const fs = require('fs');


const app = express();
const port = 5000;
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const GOOGLE_DRIVE_PHOTO_FOLDER_ID = process.env.GOOGLE_DRIVE_PHOTO_FOLDER_ID;

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

// async function listVideos(authClient) {
//     const drive = google.drive({ version: 'v3', auth: authClient });

//     const res = await drive.files.list({
//         q: `'${GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType contains 'video/'`,
//         fields: 'nextPageToken, files(id, name, webViewLink)',
//     });

//     const files = res.data.files;
//     if (files.length) {
//         return files;
//     } else {
//         return [];
//     }
// }

// async function listPhotos(authClient) {
//     const drive = google.drive({ version: 'v3', auth: authClient });

//     const res = await drive.files.list({
//         q: `'${GOOGLE_DRIVE_PHOTO_FOLDER_ID}' in parents`,
//         fields: 'nextPageToken, files(id, name, webViewLink)',
//     });

//     const files = res.data.files;
//     if (files.length) {
//         return files;
//     } else {
//         return [];
//     }
// }

app.use('/api/users', userRouter);
app.use('/api/training', trainingRouter);
app.get('/', (req, res) => {
    res.send({ 'mybs': "Hello World" });
});

// app.get('/videos', async (req, res) => {
//     try {
//         const authClient = await auth.getClient();
//         const videos = await listVideos(authClient);
//         return res.status(200).json(videos);
//     } catch (error) {
//         console.error('Error fetching video files:', error);
//         return res.status(500).send('Error fetching video files');
//     }
// });

// app.get('/photos', async (req, res) => {
//     try {
//         const authClient = await auth.getClient();
//         const photos = await listPhotos(authClient);
//         return res.status(200).json(photos);
//     } catch (error) {
//         console.error("Error fetching photo files", error);
//         return res.status(500).send('Error fetching photo file');
//     }
// });

app.listen(port, () => {
    console.log(`Express is listening on port ${port}`);
});