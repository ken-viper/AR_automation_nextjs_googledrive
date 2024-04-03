import { google } from 'googleapis';
import credentials from './credentials.json';
import Jimp from "jimp";
import fs from 'fs';
import path from 'path';

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
});
const drive = google.drive({ version: 'v3', auth });



export async function listFilesAndFoldersInFolder(folderId) {
    const folderStructure = await buildFolderStructure(folderId, new Map());
    const todayFolderstructure = await getFolderStructure(folderStructure, "2024", "04", "03")
    console.log(todayFolderstructure)
    convertImages(todayFolderstructure)
        .then(() => {
            console.log('Image conversion and storage completed successfully.');
        })
        .catch(error => {
            console.error('An error occurred during image conversion and storage:', error);
        });
    // return todayFolderstructure; 

}


async function buildFolderStructure(folderId, folderMap) {
    try {
        if (folderMap.has(folderId)) {
            return folderMap.get(folderId); // Return if folder already processed
        }

        const folder = await getFolderInfo(folderId);
        folderMap.set(folderId, folder);

        const subfolders = await listFoldersInFolder(folderId);
        const files = await listFilesInFolder(folderId);

        // Sort subfolders and files alphabetically
        subfolders.sort((a, b) => a.name.localeCompare(b.name));
        files.sort((a, b) => a.name.localeCompare(b.name));

        folder.children = [];

        for (const subfolder of subfolders) {
            const subfolderStructure = await buildFolderStructure(subfolder.id, folderMap);
            folder.children.push(subfolderStructure);
        }

        folder.children.push(...files.map(file => ({
            id: file.id,
            name: file.name,
            children: []
        })));

        return folder;
    } catch (err) {
        console.error('Error building folder structure:', err);
        throw err;
    }
}

async function getFolderInfo(folderId) {
    try {
        const res = await drive.files.get({
            fileId: folderId,
            fields: 'id, name'
        });
        return {
            id: res.data.id,
            name: res.data.name,
            children: []
        };
    } catch (err) {
        console.error('Error getting folder info:', err);
        throw err;
    }
}

async function listFoldersInFolder(folderId) {
    try {
        const res = await drive.files.list({
            q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder'`,
            fields: 'files(id, name)'
        });
        const folders = res.data.files;
        return folders.map(folder => ({
            id: folder.id,
            name: folder.name
        }));
    } catch (err) {
        console.error('Error listing folders:', err);
        throw err;
    }
}

async function listFilesInFolder(folderId) {
    try {
        const res = await drive.files.list({
            q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder'`,
            fields: 'files(id, name)'
        });
        const files = res.data.files;
        return files.map(file => ({
            id: file.id,
            name: file.name
        }));
    } catch (err) {
        console.error('Error listing files:', err);
        throw err;
    }
}

async function getFolderStructure(jsonData, year, month, day) {
    // Find the year node
    const yearNode = jsonData.children.find(node => node.name === year);
    if (!yearNode) {
        console.error("Year node not found");
        return null;
    }

    // Find the month node
    const monthNode = yearNode.children.find(node => node.name === month);
    if (!monthNode) {
        console.error("Month node not found");
        return null;
    }

    // Find the day node
    const dayNode = monthNode.children.find(node => node.name === day);
    if (!dayNode) {
        console.error("Day node not found");
        return null;
    }

    // Function to recursively clone a node and its children
    function cloneNode(node) {
        return {
            id: node.id,
            name: node.name,
            children: node.children.map(cloneNode)
        };
    }

    // Clone the day node and its subtree
    const folderStructure = cloneNode(dayNode);
    return folderStructure;
}


export async function convertImages(folder) {
    for (const child of folder.children) {
        if (child.children && child.children.length > 0) {
            await convertImages(child, drive);
        } else {
            const extension = child.name.split('.').pop().toLowerCase();
            if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
                // Download the image file from Google Drive
                const response = await drive.files.get({
                    fileId: child.id,
                    alt: 'media',
                }, { responseType: 'stream' });

                // Create a writable stream to store the downloaded image
                const writeStream = fs.createWriteStream(path.join(__dirname, child.name));

                // Pipe the response stream to the write stream
                response.data.pipe(writeStream);

                // Wait for the image to be fully downloaded
                await new Promise((resolve, reject) => {
                    writeStream.on('finish', resolve);
                    writeStream.on('error', reject);
                });

                // Resize and convert the image using Jimp
                const image = await Jimp.read(path.join(__dirname, child.name));
                await image.resize(1024, 1024);
                await image.writeAsync(path.join(__dirname, `${child.name.split('.').shift()}.jpg`));

                // Upload the converted image back to Google Drive
                await drive.files.create({
                    requestBody: {
                        name: `${child.name.split('.').shift()}.jpg`,
                        parents: [folder.id]
                    },
                    media: {
                        mimeType: 'image/jpeg',
                        body: fs.createReadStream(path.join(__dirname, `${child.name.split('.').shift()}.jpg`))
                    }
                });
            

                    // Delete the original image from Google Drive
                    await drive.files.delete({
                        fileId: child.id,
                    });

                    // Delete the temporary files
                    fs.unlinkSync(path.join(__dirname, child.name));
                    if (extension === 'jpeg' || extension === 'png') {
                    fs.unlinkSync(path.join(__dirname, `${child.name.split('.').shift()}.jpg`));
                     }
            }
        }

    }
}
