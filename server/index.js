import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './models/db.js';
import userRouter from './routes/User.js';
import cookieParser from 'cookie-parser';
// const { google } = require('googleapis');
import { google } from 'googleapis';
// const fs = require('fs');
import fs from 'fs';

const app = express();
const port = 5000;
const GOOGLE_DRIVE_FOLDER_ID = "1G93YY4knkc7zr_eYHlDiyhRWqPprSNYd";
//example for auth
//https://github.com/codedamn/full-mern-stack-video/blob/part1/server/index.js
dotenv.config().parsed;
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
};
connectDB();
const privateKey = JSON.parse(process.env.GOOGLE_PRIVATE_KEY || '{ "private_key": null }');
console.log(privateKey);
const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/drive'],
    credentials: {
        private_key: privateKey.private_key,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
    }
});

// https://drive.google.com/uc?export=view&id=1V1z66ILlv5TMsi-spsZGphaRmamSbiin
// https://drive.google.com/file/d/1PtAEbme93DYmMEqz43pv2oUX1dIYM9tT/preview


app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

async function listVideos(authClient) {
    const drive = google.drive({ version: 'v3', auth: authClient });

    const res = await drive.files.list({
        q: `'${GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType contains 'video/'`,
        fields: 'nextPageToken, files(id, name, webViewLink)',
    });

    const files = res.data.files;
    if (files.length) {
        console.log('Videos:');
        files.forEach((file) => {
            console.log(`${file.name} (${file.id}) - ${file.webViewLink}`);
        });
        return files;
    } else {
        console.log('No files found.');
        return [];
    }
}

app.use('/api/users', userRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/videos', async (req, res) => {
    try {
        const authClient = await auth.getClient();
        const videos = await listVideos(authClient);
        return res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching video files:', error);
        return res.status(500).send('Error fetching video files');
    }
});

app.listen(port, () => {
    console.log(`Express is listening on port ${port}`);
});