const fs = require('fs');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const {
    getOutputFilePathFromInput,
    getFilesizeInKiloBytes,
    bytesToKiloBytes
} = require('./fileUtil');

const outputs = [
    {
        type: 'webm',
        mime: 'video/webm'
    }, 
    {
        type: 'ogg',
        mime: 'video/ogg'
    }, 
    {
        type: 'mp4',
        mime: 'video/mp4'
    }, 
    {
        type: 'mov',
        mime: 'video/quicktime'
    }
];

module.exports.convertGIFToAllWebTypes = (inputFile) => {
    return new Promise(async (resolve, reject) => {

        const outputVideosPromises = outputs.map(output => {
            return new Promise(async (resolve, reject) => {
                const outputFilePath = await getOutputFilePathFromInput(inputFile.path, output.type);
                
                const command = ffmpeg(inputFile.path)
                    .output(outputFilePath)
                    .on('end', function() {
                        console.log(`Converted to ${output.type} ⚙️  Output filename: ${outputFilePath.match(/(?:\/media).*/g)}`);
                        
                        const inputFileSize = bytesToKiloBytes(inputFile.size);
                        const outputFileSize = getFilesizeInKiloBytes(outputFilePath);
                        console.log(`convertGIFToAllWebTypes: ${output.type} -> Input: ${inputFileSize}KB | Output: ${outputFileSize}KB`)

                        fs.readFile(outputFilePath, (err, convertedFile) => {
                            if (err) {
                                throw err;
                            }
                            
                            setTimeout(() => {
                                // delete file
                                fs.unlink(outputFilePath, () => {
                                    console.log("convertGIFToAllWebTypes: Deleted ", outputFilePath);
                                });

                            }, 2000);

                            resolve({
                                ...output, // type, mime
                                inputSizeKB: inputFileSize,
                                outputFileSizeKB: outputFileSize,
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
}
