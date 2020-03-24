const videoController = require('./../controllers/videoController');

module.exports = (app) => {

  app.route('/')
    .get((req, res) => {res.redirect('https://www.gif2video.com')});

  app.route('/convert-:fileType')
    .post(videoController.convertFile);

};
