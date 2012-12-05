var piano = new function()
{
	this.keyEvent = function(event)
	{
		// if char is one of our list at the bottom
		if(toAscii.hasOwnProperty(event.which))
		{
			// override with ASCII code
			event.which = toAscii[event.which];
		}
		// get key pressed
		var theKey = String.fromCharCode(event.which).toLowerCase();
		switch(event.type)
		{
			case "keydown":
				$(config.settings.keymap[theKey]).triggerHandler("pressed");
				break;

			case "keyup":
				$(config.settings.keymap[theKey]).triggerHandler("released");
				break;
		}
		
	}

	this.init = function()
	{
		// display keys
		$.each
		(
			config.settings.keymap,
			function(key, value)
			{
				$(value).html(key);
			}
		);
		// assign click to keys
		$("ul#piano div, ul#piano span").bind
		(
			"mousedown",
			function(event)
			{
				$(this).triggerHandler("pressed");
			}
		).bind
		(
			"mouseup mouseleave",
			function(event)
			{
				$(this).triggerHandler("released");
			}
		);
		$("ul#piano div, ul#piano span").bind
		(
			"pressed released network",
			function(event)
			{
				switch(event.type)
				{
					case "pressed":
					case "network":
						if(event.type != "network")
						{
							comms.sendNote(this.localName + "#" + this.id);
						}
						else
						{
							var key = this;
							setTimeout
							(
								function()
								{
									$(key).triggerHandler("released");
								},
								300
							);
						}
						$(this).addClass("pressed");
						// create audio element with appropriate sources and play
						$("<audio>", {autoPlay: "autoplay"}).append($("<source>", {src: "sounds/" + $(this).attr("id") + ".ogg", type: "audio/ogg"})).append($("<source>", {src: "sounds/" + $(this).attr("id") + ".mp3", type: "audio/mpeg"}));
						break;

					case "released":
						$(this).removeClass("pressed");
						break;
				}
			}
		)
		$(document).on("keydown keyup", this.keyEvent);
	}

	// array of chars which differ between keyCode and charCode
	var toAscii =
	{
        "188": "44",
        "109": "45",
        "190": "46",
        "191": "47",
        "192": "96",
        "220": "92",
        "222": "39",
        "221": "93",
        "219": "91",
        "173": "45",
        "187": "61",
        "186": "59",
        "189": "45"
    }
}