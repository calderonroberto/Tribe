/**
 * TribeController
 *
 * @description :: Server-side logic for serving gridfs content
 */


/*
* Please note that this is temporary and should be repleaced. We are storing
* content (images) in gridfs (mongodb), there are many ways to replace this
* using NGINX or Apache, that are more efficient:
*
* https://bitbucket.org/onyxmaster/mod_gridfs
* https://github.com/mdirolf/nginx-gridfs
*
* We leave this here so that out of the box Tribe works. But be sensible!
* Because I know you'll probably leave it, I've set up cache headers so content
* gets called less times. ;)
*/

module.exports = {

	img: function (req, res) {
		var blobAdapter = require('skipper-gridfs')({
			//bucket is necessary (bug)
			uri: process.env.MONGOLAB_URI + '.bucket' || sails.config.skipperconf.local_uri
		});
		var fd = req.param('id');
		blobAdapter.read(fd, function(error , file) {
			if(error) {
				res.json(error);
			} else {
				res.contentType('image/png');
				res.setHeader('Cache-Control', 'public, max-age=31557600'); //set 1 year
				res.send(new Buffer(file));
			}
		});
	}

};
