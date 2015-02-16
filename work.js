var worker = require( "./lib/worker" );
var twitter = require( "./lib/twitter" )();

var request = require( "request" ); 

// Listen to messages
worker.on( "message", function( msg, next ){
	_msg = JSON.parse( msg )
	
	switch( _msg.state ){

		// get a joke and write a new rsmq message
		case 0:
			request.get( { url: "http://api.icndb.com/jokes/random" }, function( err, resp, body ){
				if( err ){
					next( err );
				} else {
					_data = JSON.parse( body )
						
					_joke = _data.value.joke
					if( _joke.length > 100 ){
						next( new Error( "joke too long for twitter" ) );
						return
					}

					console.log( "JOKE OK" )
					//console.log( "JOKE", body, _msg )
					worker.send( JSON.stringify( {
						state: 1,
						user_id: _msg.tweet.user.id,
						screen_name: _msg.tweet.user.screen_name,
						text: _data.value.joke + " - http://www.icndb.com"
					} ) );
					next();
				}
			});
			break;

		// 
		case 1:
			//twitter.statusesUpdate( { status: "@" + _msg.screen_name + ": " + _msg.text }, function( err, data ){
			twitter.directMessagesNew( _msg, function( err, data ){
				if( err ){
					console.log("TWEET ERR @" + _msg.screen_name, _msg.text.length, err.name, err.code)
					next( err );
				} else {
					console.log( "Proiate TWEET to @" + _msg.screen_name )			
					next();
				}
			} )
			break;
	}
});

worker.start();