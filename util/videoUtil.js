const fs = require('fs');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const {
    getOutputFilePathFromInput,
    formatBytes
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
                        console.log(`\n⚙️ Converted to ${output.type} - Output file path: ${outputFilePath.match(/(?:\/media).*/g)}`);
                        
                        const inputFileSize = formatBytes(inputFile.size);
                        const stats = fs.statSync(outputFilePath);
                        const fileSizeInBytes = stats["size"];
                        const outputFileSize = formatBytes(fileSizeInBytes);
                        console.log(`🚀 ${output.type} -> Input: ${inputFileSize} | Output: ${outputFileSize}\n`)

                        fs.readFile(outputFilePath, (err, convertedFile) => {
                            if (err) {
                                throw err;
                            }
                            
                            setTimeout(() => {
                                // delete file
                                fs.unlink(outputFilePath, () => {
                                    console.log("❌ Deleted ", outputFilePath);
                                });

                            }, 2000);

                            resolve({
                                ...output, // type, mime
                                inputFileSize,
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
}
