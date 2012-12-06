var conf = require("./package.json"); // load config file
var fs = require("fs");
var redis = require("redis");
//var client = redis.createClient();
var io = require("socket.io").listen(conf.config.commport); // start socket.ui listening on port defined in config

// start httpServer
var httpServer = require("http").createServer
(
	function(request, response)
	{
		// if root, direct to index.html
		var file = (request.url == "/") ? "index.html" : request.url;
		// load requested file
		fs.readFile
		(
			// from client_files subdir
			__dirname + "/client_files/" + file,
			function(error, data)
			{
				if(error)
				{
					// something went wrong, throw a 500
					response.writeHead(500);
					return response.end("Unable to load Piano");
				}
				else
				{
					// all good, spit it out
					response.writeHead(200);
					response.end(data);
				}
			}
		);
	}
).listen(conf.config.webport); // listen on port defined in config

// listen for sockets connection
var piano = io.sockets.on
(
	"connection",
	function(socket)
	{
		// set up event listeners
		socket.on
		(
			"handshake",
			function(data)
			{
				// notify everyone that client has connected
				piano.emit("connectionNotification", {instanceID: data.instanceID});
			}
		);
		socket.on
		(
			"playNote",
			function(data)
			{
				// someone just told us they played a note, tell the whole gang
				piano.emit("serverNote", {instanceID: data.instanceID, note: data.note});
			}
		);
		// oh hi, let's generate a new session ID and send it your way
		client.incr
		(
			"sessionID",
			function(error, id)
			{
				console.log("new session id: " + id);
				socket.emit("handshake", {instanceID: id});
			}
		);
	}
);