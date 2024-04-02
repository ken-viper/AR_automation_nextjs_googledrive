import { google } from 'googleapis';
import credentials from './credentials.json';

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
});

const drive = google.drive({ version: 'v3', auth });

export async function listFilesAndFoldersInFolder(folderId) {
    const folderStructure = await buildFolderStructure(folderId, new Map());
  
    return (JSON.stringify(folderStructure, null, 2));

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
