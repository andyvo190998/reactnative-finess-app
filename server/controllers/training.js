import { google } from 'googleapis';
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const GOOGLE_DRIVE_PHOTO_FOLDER_ID = process.env.GOOGLE_DRIVE_PHOTO_FOLDER_ID;
const private_key = process.env.GOOGLE_PRIVATE_KEY;


const privateKey = JSON.parse(private_key || '{ "private_key": null }');
const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/drive'],
    credentials: {
        private_key: privateKey.private_key,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,

    }
});
export const listVideos = async (authClient) => {
    const drive = google.drive({ version: 'v3', auth: authClient });

    const res = await drive.files.list({
        q: `'${GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType contains 'video/'`,
        fields: 'nextPageToken, files(id, name, webViewLink)',
    });

    const files = res.data.files;
    if (files.length) {
        return files;
    } else {
        return [];
    }
};

export const listPhotos = async (authClient) => {
    const drive = google.drive({ version: 'v3', auth: authClient });

    const res = await drive.files.list({
        q: `'${GOOGLE_DRIVE_PHOTO_FOLDER_ID}' in parents`,
        fields: 'nextPageToken, files(id, name, webViewLink)',
    });

    const files = res.data.files;
    if (files.length) {
        return files;
    } else {
        return [];
    }
};

export const fetchVideos = async (req, res) => {
    try {
        const authClient = await auth.getClient();
        const videos = await listVideos(authClient);
        return res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching video files:', error);
        return res.status(500).send('Error fetching video files');
    }
};

export const fetchPhotos = async (req, res) => {
    try {
        const authClient = await auth.getClient();
        const photos = await listPhotos(authClient);
        return res.status(200).json(photos);
    } catch (error) {
        console.error("Error fetching photo files", error);
        return res.status(500).send('Error fetching photo file');
    }
};