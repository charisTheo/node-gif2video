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

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// const bytesToKiloBytes = bytes => ((bytes / (1024 * 1024)).toFixed(2));

module.exports = {
    getInputFilePath,
    getOutputFilePathFromInput,
    formatBytes
}