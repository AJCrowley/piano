var conf = require("./package.json");
var fs = require("fs");
var io = require("socket.io").listen(conf.config.commport);

var httpServer = require("http").createServer
(
	function(request, response)
	{
		var file = (request.url == "/") ? "index.html" : request.url;
		fs.readFile
		(
			__dirname + "/client_files/" + file,
			function(error, data)
			{
				if(error)
				{
					response.writeHead(500);
					return response.end("Unable to load Piano");
				}
				else
				{
					response.writeHead(200);
					response.end(data);
				}
			}
		);
	}
).listen(conf.config.webport);

var piano = io.sockets.on
(
	"connection",
	function(socket)
	{
		socket.on
		(
			"handshake",
			function(data)
			{
				piano.emit("connectionNotification", {instanceID: data.instanceID});
			}
		);
		socket.on
		(
			"playNote",
			function(data)
			{
				piano.emit("serverNote", {instanceID: data.instanceID, note: data.note});
			}
		);
		socket.emit("handshake", {});
	}
);