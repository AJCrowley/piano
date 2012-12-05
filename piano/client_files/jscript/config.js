this.config = new function()
{
	this.instanceID = new Date().getTime();
	
	// keep reference to self
	var configRef = this;
	
	// event constants
	this.EVENT_LOADED = "loaded";
	this.settings = {};

	// get host info
	var fullHost = location.host.split(":");
	var protocol = location.href.split(":");
	this.host = protocol[0] + "://" + fullHost[0];
	this.port = fullHost[1];
	
	var dispatchEvent = function(eventType)
	{
		var event = $.Event(eventType);
		$(config).triggerHandler(event);
	}
	
	this.load = function(file)
	{
		$.getJSON
		(
			file,
			function(data)
			{
				configRef.settings = data;
				dispatchEvent(configRef.EVENT_LOADED);
			}
		);
	}
}