var conf = require( "../config.json" );
var RsmqWorker = require( "rsmq-worker" );

// Init Worker
var worker = new RsmqWorker( conf.qname ? conf.qname : "rsmq-mnug-twitter", { invisibletime: 3, timeout: 10000, interval: [0.5,1] } );

// Listen to erros
worker.on('error', function( err, msg ){
    console.log( "RSMQ: ERROR", msg.id, msg.rc, err );
});
worker.on('exceeded', function( msg ){
    console.log( "RSMQ: EXCEEDED", msg.id );
});
worker.on('timeout', function( msg ){
    console.log( "RSMQ: TIMEOUT", msg.id, msg.rc );
});

// export the instance and start the worker
module.exports = worker;