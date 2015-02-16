_keywords = process.argv.splice(2)
if( !_keywords || _keywords.length === 0 ){
	throw "Missing keywords. Please add one or more keyword as arguments"
}

var worker = require( "./lib/worker" );
var tweet = require( "./lib/twitter" );

var request = require( "request" ); 

twitter = tweet( _keywords, function(tweet) {
    console.log( "TWEET", tweet.text);
    worker.send( JSON.stringify( { state: 0, tweet: tweet } ) )
});