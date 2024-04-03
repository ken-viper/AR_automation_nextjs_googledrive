// pages/api/google-drive.ts

import { NextApiRequest, NextApiResponse } from 'next';
import {listFilesAndFoldersInFolder} from "../../utills/filemanage"
import {convertImages} from "../../utills/filemanage"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const folderId = '1ye50STPPBl2cHb8HFMb8R5LBuTHub4k1';
    try {
        //  const filesAndFolders = await listFilesAndFoldersInFolder(folderId);
        res.status(200).json("filesAndFolders");
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}