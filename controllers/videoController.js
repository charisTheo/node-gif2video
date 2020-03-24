const fs = require('fs');

const { convertFileToAllWebTypes } = require('./../util/videoUtil');

module.exports.convertFile = async (req, res) => {
    try {
        const { fileType } = req.params;
        console.log("videoController.convertFile -> fileType", fileType)
        const { files } = req;
        if (!files.length) {
            throw new Error("videoController.convertFile: No files were found!");
        }
        const file = files[0];
        
        const outputVideosPromises = await convertFileToAllWebTypes(file);
        const outputVideos = await Promise.all(outputVideosPromises);

        res.status(200).send(outputVideos);

        // delete input file
        fs.unlink(file.path, () => {
            console.log("❌ Deleted input file", file.path);
        });

    } catch (error) {
        console.log("\n⛔️ videoController.convertFile -> error", error);
        res.status(400).send();

    }
};

// module.exports.convertMP4 = async (req, res) => {
//     try {
//         const { files } = req;
//         if (!files.length) {
//             throw new Error("convertMP4: No files were found!");
//         }
//         const file = files[0];
        
//         const outputVideosPromises = await convertMP4ToAllWebTypes(file);
//         const outputVideos = await Promise.all(outputVideosPromises);

//         res.status(200).send(outputVideos);

//         // delete input file
//         fs.unlink(file.path, () => {
//             console.log("❌ Deleted input file", file.path);
//         });

//     } catch (error) {
//         console.log("\n⛔️ videoController.convertMP4 -> error", error);
//         res.status(400).send();

//     }
// };
