require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/routes'); 
const { upload } = require('./middleware/multer');

const { 
    PORT
} = process.env;

const app = express();

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 
// for parsing multipart/form-data
app.use(upload.any());
// app.use(upload.single('gif'));

app.set('trust proxy', 1);

routes(app);

app.listen(PORT, () => {
    console.log(`Started on port http://${process.env.SERVER_IP_ADDRESS}:${PORT}`);
});

module.exports = { app };