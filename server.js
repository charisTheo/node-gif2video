require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/routes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://www.gif2video.com");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
    next();
});
app.set('trust proxy', 1);

routes(app);

app.listen(PORT, () => {
    console.log(`Started on port http://${process.env.SERVER_IP_ADDRESS}:${PORT}`);
});

module.exports = { app };