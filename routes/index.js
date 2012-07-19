
exports.api = require('./api/pubs.js')

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { layout: 'layout.html', title: 'BarHopper' });
};

