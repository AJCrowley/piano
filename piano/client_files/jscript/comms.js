var comms = new function()
{
	var commsRef = this; // store reference to self
	this.socket = {}; // init empty object as socket
	
	this.init = function(address)
	{
		this.socket = io.connect(address);
		// listen for handshake from server
		this.socket.on
		(
			"handshake",
			function(data)
			{
				// use returned instanceID
				config.instanceID = data.instanceID;
				$("div#comms").prepend("connected: " + address + " sid: " + data.instanceID + "<br />");
				// ack
				commsRef.socket.emit("handshake", {instanceID: config.instanceID});
			}
		);
		// listen for notes from server
		this.socket.on
		(
			"serverNote",
			function(data)
			{
				// did we send this note
				if(data.instanceID != config.instanceID)
				{
					// nope! play it
					$("div#comms").prepend("note received: " + data.instanceID + "::" + data.note.split("#")[1] + "<br />");
					$(data.note).triggerHandler("network");
				}
			}
		);
		// listen for connection notifications from other clients
		this.socket.on
		(
			"connectionNotification",
			function(data)
			{
				// is this us?
				if(data.instanceID != config.instanceID)
				{
					// nah, output!
					$("div#comms").prepend("connection from: " + data.instanceID + "<br />");
				}
			}
		);
		// listen for recorded tracks
		this.socket.on
		(
			"recordedTrackAvailable",
			function(data)
			{
				$("div#comms").prepend("recorded track available from: " + data.instanceID + "...transferring<br />");
				commsRef.socket.emit("getRecoredTrack", {instanceID: data.instanceID});
			}
		);
		// receive transferred recorded track
		this.socket.on
		(
			"recordedTrackTransfer",
			function(data)
			{
				$("div#comms").prepend("track received<br />");
				piano.recordedTrack = data.track;
				piano.recordedTrackAvailable(true);
			}
		);
	}

	this.sendNote = function(note)
	{
		// send played note to server
		this.socket.emit("playNote", {instanceID: config.instanceID, note: note});
		$("div#comms").prepend("note send: " + note.split("#")[1] + "<br />");
	}

	this.sendTrack = function(track)
	{
		// send recorded track to server
		this.socket.emit("storeTrack", {instanceID: config.instanceID, track: track});
		$("div#comms").prepend("recorded track sent to server<br />");
	}
}