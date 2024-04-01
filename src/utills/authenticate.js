import { google } from 'googleapis';
import credentials from './credentials.json';

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
});

const drive = google.drive({ version: 'v3', auth });


export async function listFilesInFolder(folderId) {
    try {
        const res = await drive.files.list({
            q: `'${folderId}' in parents`,
            fields: 'files(id, name)'
        });
        const files = res.data.files;
        return files;
    } catch (err) {
        console.error('Error listing files:', err);
        throw err;
    }
}

//// Usage:
// const files = await listFilesInFolder('1ye50STPPBl2cHb8HFMb8R5LBuTHub4k1');
// console.log('Files in folder:', files);


export async function listFilesAndFoldersInFolder(folderId) {
    try {
        const files = await listFilesInFolder(folderId);
        console.log(files)
        for (const file of files) {
            // console.log('File:', file.name);
        }

        // const res = await drive.files.list({
        //     q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder'`,
        //     fields: 'files(id, name)'
        // });
        // const folders = res.data.files;
        // for (const folder of folders) {
        //     console.log('Folder:', folder.name);
        //     await listFilesAndFoldersInFolder(folder.id);
        // }
    } catch (err) {
        console.error('Error listing files and folders:', err);
        throw err;
    }
}

//// Usage:
// await listFilesAndFoldersInFolder('1ye50STPPBl2cHb8HFMb8R5LBuTHub4k1');
