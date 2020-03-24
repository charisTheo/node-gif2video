const multer = require('multer');
const path = require('path');

const UPLOAD_FOLDER = "media/";
const FILE_SIZE_LIMIT_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTABLE_FILE_TYPES = ['gif', 'mp4'];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, UPLOAD_FOLDER));
    },
    filename: function (req, file, cb) {
        // TODO create hash based on file
        cb(null, `input-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    // console.log("fileFilter -> file.fieldname", file.fieldname)
    if (ACCEPTABLE_FILE_TYPES.find(fileType => file.fieldname === fileType)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

module.exports.upload = multer({ 
    storage,
    fileFilter,
    limits: { fieldSize: FILE_SIZE_LIMIT_BYTES }
});
