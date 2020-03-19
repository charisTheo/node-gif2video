const fs = require('fs');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const {
    getInputFilePath,
    getOutputFilePathFromInput,
    getFilesizeInKiloBytes,
    bytesToKiloBytes
} = require('./fileUtil');

module.exports.convertGIFToAllWebTypes = (inputFile) => {
    return new Promise(async (resolve, reject) => {
        const outputTypes = ['webm', 'ogg', 'mp4'];

        const outputVideosPromises = outputTypes.map(outputType => {
            return new Promise(async (resolve, reject) => {
                const outputFilePath = await getOutputFilePathFromInput(inputFile.path, outputType);
                
                const command = ffmpeg(inputFile.path)
                    .output(outputFilePath)
                    .on('end', function() {
                        console.log(`Converted to ${outputType} ⚙️  Output filename: ${outputFilePath.split('gif2video')[1]}`);
                        
                        const inputFileSize = bytesToKiloBytes(inputFile.size);
                        const outputFileSize = getFilesizeInKiloBytes(outputFilePath);
                        const outputFileType = outputFilePath.split(/\/output-.*\./)[1];
                        console.log(`${outputFileType} -> Input: ${inputFileSize}KB | Output: ${outputFileSize}KB`)

                        fs.readFile(outputFilePath, (err, convertedFile) => {
                            if (err) {
                                throw err;
                            }
            
                            resolve({
                                inputSizeKB: inputFileSize,
                                outputFileSizeKB: outputFileSize,
                                convertedFile,
                                mime: `video/${outputType}`,
                                type: outputType
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
}
