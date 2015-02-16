var Twitter = require( "node-twitter" );
var request = require( "request" ); 

var conf = require( "../config.json" );


// INIT Twitter
var twitterStream = new Twitter.StreamClient(
	conf.CONSUMER_KEY,
	conf.CONSUMER_SECRET,
	conf.TOKEN,
	conf.TOKEN_SECRET
);

var twitterRest = new Twitter.RestClient(
	conf.CONSUMER_KEY,
	conf.CONSUMER_SECRET,
	conf.TOKEN,
	conf.TOKEN_SECRET
);

// Listen to errors
twitterStream.on('close', function() {
    console.log('Connection closed.');
});
twitterStream.on('end', function() {
    console.log('End of Line.');
});
twitterStream.on('error', function(error) {
    console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
});

// export a function to add a callback on tweet
module.exports = function( keywords, fnTweet ){

	if( fnTweet ){
		// listen to tweets
		twitterStream.on('tweet', function(tweet) {
			fnTweet( tweet );
		});

		// start listening to the stream
		twitterStream.start(keywords);
	}
	// return the rest client
	return twitterRest
};