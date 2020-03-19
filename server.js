require('./config/config');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const routes = require('./routes/routes'); 
const UPLOAD_FOLDER = "media/";

const { 
    PORT = 3000,
    NODE_ENV,
    CLIENT_ORIGIN,
    DEV_CLIENT_ORIGIN,
    DOMAIN_PROTECTED
} = process.env;

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, UPLOAD_FOLDER));
    },
    filename: function (req, file, cb) {
        // TODO create hash based on file
        cb(null, `input-${file.originalname}`);
    }
});

const upload = multer({ storage });

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 
// for parsing multipart/form-data
app.use(upload.single('gif'));

if (DOMAIN_PROTECTED === '1') {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", NODE_ENV === 'dev' ? DEV_CLIENT_ORIGIN : CLIENT_ORIGIN);
        res.header("Access-Control-Allow-Credentials", true);
        res.header("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, X-Requested-With");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
        next();
    });
}
app.set('trust proxy', 1);

routes(app);

app.listen(PORT, () => {
    console.log(`Started on port http://${process.env.SERVER_IP_ADDRESS}:${PORT}`);
});

module.exports = { app };