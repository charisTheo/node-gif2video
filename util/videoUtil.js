const fs = require('fs');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

// ffmpeg.getAvailableEncoders(function(err, encoders) {
//     console.log('Available encoders:');
//     console.dir(encoders);
// });

const {
    getOutputFilePathFromInput,
    getOutputTypesToConvert,
    deleteFile,
    formatBytes
} = require('./fileUtil');

// const DEFAULT_VIDEO_CODEC = 'libx264';
const DEFAULT_VIDEO_BITRATE = '1000k'; // target video bitrate in kbps

module.exports.convertFileToAllWebTypes = inputFile => {
    return new Promise(async (resolve, reject) => {
        const outputTypesToConvert = getOutputTypesToConvert(inputFile.fieldname);

        const outputVideosPromises = outputTypesToConvert.map(output => {
            return new Promise(async (resolve, reject) => {
                const outputFilePath = await getOutputFilePathFromInput(inputFile.path, output.type);
                
                const command = ffmpeg(inputFile.path)
                    // .videoCodec(DEFAULT_VIDEO_CODEC)
                    .noAudio()
                    .videoBitrate(DEFAULT_VIDEO_BITRATE)
                    .output(outputFilePath)
                    .on('end', function() {
                        console.log(`\n⚙️ Converted to ${output.type} - Output file path: ${outputFilePath.match(/(?:\/media).*/g)}`);
                        
                        const inputFileSize = formatBytes(inputFile.size);
                        const stats = fs.statSync(outputFilePath);
                        const outputFileSizeBytes = stats["size"];
                        const outputFileSize = formatBytes(outputFileSizeBytes);
                        console.log(`🚀 ${output.type} -> Input: ${inputFileSize} | Output: ${outputFileSize}\n`)

                        fs.readFile(outputFilePath, (err, convertedFile) => {
                            if (err) {
                                throw err;
                            }
                            
                            deleteFile(outputFilePath);

                            resolve({
                                ...output, // { type, mime }
                                inputFileSizeBytes: inputFile.size,
                                inputFileSize,
                                outputFileSizeBytes,
                                outputFileSize,
                                convertedFile
                            });
                        });
                    })
                    .run();
                    // .ffprobe(0, function(err, data) {
                    //     console.log('file1 metadata:');
                    //     console.dir(data);
                    // })
            })
        });

        resolve(outputVideosPromises);
    })
};

module.exports.optimiseGif = async inputFile => {
    return new Promise(async (resolve, reject) => {
        const outputFilePath = await getOutputFilePathFromInput(inputFile.path, 'gif');
        
        const command = ffmpeg(inputFile.path)
            // .videoCodec(DEFAULT_VIDEO_CODEC)
            .videoBitrate(DEFAULT_VIDEO_BITRATE)
            .output(outputFilePath)
            .on('end', function() {
                console.log(`\n⚙️ Finished optimising GIF - Output file path: ${outputFilePath.match(/(?:\/media).*/g)}`);
                
                const inputFileSize = formatBytes(inputFile.size);
                const stats = fs.statSync(outputFilePath);
                const outputFileSizeBytes = stats["size"];
                const outputFileSize = formatBytes(outputFileSizeBytes);
                console.log(`🚀 Optimisation -> Input: ${inputFileSize} | Output: ${outputFileSize}\n`)

                fs.readFile(outputFilePath, (err, convertedFile) => {
                    if (err) {
                        throw err;
                    }
                    
                    deleteFile(outputFilePath);

                    resolve({
                        type: 'gif',
                        mime: 'image/gif',
                        inputFileSizeBytes: inputFile.size,
                        inputFileSize,
                        outputFileSizeBytes,
                        outputFileSize,
                        convertedFile
                    });
                });
            })
            .run()
    })
}