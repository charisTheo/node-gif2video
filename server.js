require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/routes'); 
const { upload } = require('./middleware/multer');

const { 
    PORT,
    NODE_ENV,
    CLIENT_ORIGIN,
    DEV_CLIENT_ORIGIN,
    DOMAIN_PROTECTED
} = process.env;

const app = express();

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 
// for parsing multipart/form-data
app.use(upload.any());
// app.use(upload.single('gif'));

if (DOMAIN_PROTECTED === '1') {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", NODE_ENV === 'dev' ? DEV_CLIENT_ORIGIN : CLIENT_ORIGIN);
        res.header("Access-Control-Allow-Credentials", true);
        res.header("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, X-Requested-With");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        next();
    });
}
app.set('trust proxy', 1);

routes(app);

app.listen(PORT, () => {
    console.log(`Started on port http://${process.env.SERVER_IP_ADDRESS}:${PORT}`);
});

module.exports = { app };