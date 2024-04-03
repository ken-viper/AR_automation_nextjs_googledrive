// const Jimp = require('jimp');

// export async function convertImages(folder) {
//   for (const child of folder.children) {
//     if (child.children && child.children.length > 0) {
//       await convertImages(child);
//     } else {
//       const extension = child.name.split('.').pop().toLowerCase();
//       if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
//         const image = await Jimp.read(child.id);
//         await image.resize(1024, 1024); // Resize the image to 1024x1024 pixels
//         await image.writeAsync(`${child.id.split('.').shift()}.jpg`); // Save the converted image as .jpg
//       }
//     }
//   }
//   return "OK";
// }


const Jimp = require('jimp');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const credentials = ""


const drive = google.drive({ version: 'v3', auth });

convertImages(jsonStructure, drive)
  .then(() => {
    console.log('Image conversion and storage completed successfully.');
  })
  .catch(error => {
    console.error('An error occurred during image conversion and storage:', error);
  });