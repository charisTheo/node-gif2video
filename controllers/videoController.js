const fs = require('fs');

const { convertGIFToAllWebTypes } = require('./../util/videoUtil');

module.exports.convertGIF = async (req, res) => {
    try {
        // const { type } = req.params;
        const { file } = req;
        if (!file) {
            throw new Error();
        }
        
        const outputVideosPromises = await convertGIFToAllWebTypes(file);
        const outputVideos = await Promise.all(outputVideosPromises);

        res.status(200).send(outputVideos);

        // delete input file
        fs.unlink(file.path, () => {
            console.log("❌ Deleted input file", file.path);
        });

    } catch (error) {
        console.log("\n⛔️ videoController.convertGIF -> error", error);
        res.status(400).send();

    }
};
