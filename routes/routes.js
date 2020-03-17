const videoController = require('./../controllers/videoController');

module.exports = (app) => {

  app.route('/')
    .get((req, res) => {res.redirect('https://www.gif2video.com')});

  app.route('/gif-2-mp4')
    .post(videoController.gif2mp4);

  app.route('/gif-2-webm')
    .post(videoController.gif2webm);
  
  app.route('/gif-2-ogg')
    .post(videoController.gif2ogg);
  
};
