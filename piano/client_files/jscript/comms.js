var comms = new function()
{
	var commsRef = this;

	this.socket = {};
	
	this.init = function(address)
	{
		this.socket = io.connect(address);
		this.socket.on
		(
			"handshake",
			function(data)
			{
				config.instanceID = data.instanceID;
				$("div#comms").prepend("connected: " + address + " sid: " + data.instanceID + "<br />");
				commsRef.socket.emit("handshake", {instanceID: config.instanceID});
			}
		);
		this.socket.on
		(
			"serverNote",
			function(data)
			{
				if(data.instanceID != config.instanceID)
				{
					$("div#comms").prepend("note received: " + data.instanceID + "::" + data.note.split("#")[1] + "<br />");
					$(data.note).triggerHandler("network");
				}
			}
		);
		this.socket.on
		(
			"connectionNotification",
			function(data)
			{
				if(data.instanceID != config.instanceID)
				{
					$("div#comms").prepend("connection from: " + data.instanceID + "<br />");
				}
			}
		);
	}

	this.sendNote = function(note)
	{
		this.socket.emit("playNote", {instanceID: config.instanceID, note: note});
		$("div#comms").prepend("note send: " + note.split("#")[1] + "<br />");
	}
}