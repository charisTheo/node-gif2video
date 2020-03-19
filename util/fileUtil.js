const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const getInputFilePath = (fileName, fileType) => {
    return new Promise((resolve, reject) => {        
        resolve(path.join(__dirname, `../media/${fileName}.${fileType}`));
    });    
};

/**
 * @param {String} inputFilePath - full input file name 
 * @param {String} outputType - converted video output type (ex: webm)
 * @returns {String} output file path (ex: /media/output-n9e2jdfeidj29j.webm)
 */
const getOutputFilePathFromInput = (inputFilePath, outputType) => {
    return new Promise((resolve, reject) => {
        var md5sum = crypto.createHash('md5');
        var stream = fs.ReadStream(inputFilePath);
        stream.on('data', data => md5sum.update(data));

        stream.on('end', () => {
            var hash = md5sum.digest('hex');
            resolve(path.join(__dirname, `../media/output-${hash}.${outputType}`));
        });
    });
};

// const getHashFromFile = file => {
//     return new Promise((resolve, reject) => {
//         var md5sum = crypto.createHash('md5');
//         var stream = fs.ReadStream(path.join(__dirname, `../media/${filename}.${filetype}`));
//         stream.on('data', data => md5sum.update(data));

//         stream.on('end', () => {
//             var hash = md5sum.digest('hex');
//             resolve(path.join(__dirname, `../media/output-${hash}.${outputType}`));
//         });
//     });
// };

/**
 * 
 * @param {String} filepath - The full path to the file
 */
const getFilesizeInKiloBytes = filepath => {
    const stats = fs.statSync(filepath);
    const fileSizeInBytes = stats["size"];
    const fileSizeInKiloBytes = bytesToKiloBytes(fileSizeInBytes);

    return fileSizeInKiloBytes;
};

const bytesToKiloBytes = bytes => ((bytes / (1024 * 1024)).toFixed(2));

module.exports = {
    getInputFilePath,
    getOutputFilePathFromInput,
    getFilesizeInKiloBytes,
    bytesToKiloBytes,
    // getHashFromFile
}