const cors = require('cors');
const videoController = require('./../controllers/videoController');
const { CLIENT_ORIGIN, DOMAIN_PROTECTED } = process.env;

module.exports = (app) => {

  app.route('/')
    .get((req, res) => {res.redirect('https://www.gif2video.com')});

  app.route('/convert-:fileType')
    .post(cors({
      origin: DOMAIN_PROTECTED === '1' ? CLIENT_ORIGIN : '*'
    }), videoController.convertFile);

  app.route('/optimise-gif')
    .post(cors({
      origin: DOMAIN_PROTECTED === '1' ? CLIENT_ORIGIN : '*'
    }), videoController.handleOptimiseGif);

};
