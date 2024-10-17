import React, { useTransition } from 'react';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import * as DocumentPicker from 'react-native-document-picker';
export function formatDate(date: Date): string {
  // Ensure the input is a Date object
  if (!(date instanceof Date)) {
    throw new Error('Invalid input: expected a Date object');
  }

  // Extract the components
  const month: string = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day: string = String(date.getDate()).padStart(2, '0');
  const year: number = date.getFullYear();

  const hours: string = String(date.getHours()).padStart(2, '0');
  const minutes: string = String(date.getMinutes()).padStart(2, '0');
  const seconds: string = String(date.getSeconds()).padStart(2, '0');

  // Format the date and time
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export async function exportToCSV(data: any[], fileName: string): any {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
  let result = {};
  try {
    // const res = await DocumentPicker.pickDirectory();
    // if (!res?.uri) return;
    // RNFS.DocumentDirectoryPath
    const filePath = RNFS.DocumentDirectoryPath + '/' + fileName + '.xlsx';

    // console.log('res.uri: ', decodeURIComponent(res.uri));
    // console.log('RNFS.CachesDirectoryPath: ', RNFS.CachesDirectoryPath);
    // console.log('RNFS.DocumentDirectoryPath: ', RNFS.DocumentDirectoryPath);
    // console.log('RNFS.DownloadDirectoryPath: ', RNFS.DownloadDirectoryPath);
    // console.log(
    //   'RNFS.ExternalCachesDirectoryPath: ',
    //   RNFS.ExternalCachesDirectoryPath,
    // );
    // console.log('RNFS.ExternalDirectoryPath: ', RNFS.ExternalDirectoryPath);
    // console.log(
    //   'RNFS.ExternalStorageDirectoryPath: ',
    //   RNFS.ExternalStorageDirectoryPath,
    // );
    // console.log('RNFS.FileProtectionKeys: ', RNFS.FileProtectionKeys);
    // console.log('RNFS.LibraryDirectoryPath: ', RNFS.LibraryDirectoryPath);
    // console.log('RNFS.MainBundlePath: ', RNFS.MainBundlePath);
    // console.log('RNFS.PicturesDirectoryPath: ', RNFS.PicturesDirectoryPath);
    // console.log('RNFS.TemporaryDirectoryPath: ', RNFS.TemporaryDirectoryPath);

    await RNFS.writeFile(filePath, wbout, 'ascii');
    console.log('File written successfully:', filePath);
    result = { status: true, filePath: filePath };

    // .then(() => {
    //   console.log('File written successfully:', filePath);
    //   // const destPath = decodeURIComponent(res.uri) + '/' + fileName + '.xlsx';
    //   // RNFS.copyFile(filePath, destPath)
    //   //   .then(() => {
    //   //     console.log('File copy success.');
    //   //   })
    //   //   .catch(err => {
    //   //     console.error('Error copying file:', err);
    //   //   });
    //   // Optionally, you can open the file using a file viewer3
    //   result = { status: true, filePath: filePath };
    // })
    // .catch(error => {
    //   console.error('Error writing file:', error);

    //   result = { status: false, error: error };
    // });
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker
    } else {
      throw err;
    }
    result = { status: false, error: err };
  }
  console.log(result);
  return result;
  // const filePath = RNFS.DocumentDirectoryPath + '/' + fileName + '.xlsx';

  // RNFS.writeFile(filePath, wbout, 'ascii')
  //   .then(() => {
  //     console.log('File written successfully:', filePath);
  //     // Optionally, you can open the file using a file viewer
  //   })
  //   .catch(error => {
  //     console.error('Error writing file:', error);
  //   });
}
