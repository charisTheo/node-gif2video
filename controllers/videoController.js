const fs = require('fs');

const { convertFileToAllWebTypes, optimiseGif } = require('./../util/videoUtil');

module.exports.convertFile = async (req, res) => {
    try {
        const { fileType } = req.params;
        const { files } = req;
        
        if (!files || !files.length) {
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
        console.error("\n⛔️ videoController.convertFile -> error", error);
        res.status(400).send();

    }
};

module.exports.handleOptimiseGif = async (req, res) => {
    console.warn("\n⚠️ videoController.handleOptimiseGif -> Optimising a GIF will not work as expected yet!");

    try {
        const { files } = req;
        
        if (!files || !files.length) {
            throw new Error("videoController.handleOptimiseGif: No files were found!");
        }
        const file = files[0];
        
        const optimisedGif = await optimiseGif(file);

        res.status(200).send(optimisedGif);

        // delete input file
        fs.unlink(file.path, () => {
            console.log("❌ Deleted input file", file.path);
        });

    } catch (error) {
        console.error("\n⛔️ videoController.handleOptimiseGif -> error", error);
        res.status(400).send();

    }
}
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
