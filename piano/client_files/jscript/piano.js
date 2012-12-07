var Piano = function()
{
	var pianoRef = this; // keep reference to self
 	this.recording = false; // are we recording?
 	var recordStartTime = 0; // store start time for recording purposes
 	this.recordedTrack = []; // empty array for recording
	this.notes = {}; // store notes in an array

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
				// put mapped key in key object
				$(value).html(key);
				// create audio element and add to notes object
				pianoRef.notes[$(value).attr("id")] = $("<audio>", {preload: "auto"}).append($("<source>", {src: "sounds/" + $(value).attr("id") + ".ogg", type: "audio/ogg"})).append($("<source>", {src: "sounds/" + $(value).attr("id") + ".mp3", type: "audio/mpeg"}));
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
						if(pianoRef.recording) // are we recording?
						{
							// store recorded note
							pianoRef.recordedTrack.push
							({
								"note": this.id,
								"time": new Date().getTime() - recordStartTime
							});
						}
						// is this a network event?
						if(event.type != "network")
						{
							// nope, send it to the server
							comms.sendNote(this.localName + "#" + this.id);
						}
						else
						{
							// yes, no need to resend
							var key = this;
							// release key after 300ms
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
						// clone audio object to container
						$(this).append($(pianoRef.notes[this.id][0]).clone());
						// get reference to cloned audio
						var audio = $(this).children("audio")[$(this).children("audio").length - 1];
						// listen for finished playing
						$(audio).bind
						(
							"ended",
							function()
							{
								// and remove from DOM
								$(this).remove();
							}
						);
						audio.play();
						break;

					case "released":
						$(this).removeClass("pressed");
						break;
				}
			}
		)
		$(document).on("keydown keyup", this.keyEvent);
		$("a#rec").click
		(
			function()
			{
				$(this).toggleClass("on");
				pianoRef.toggleRecord();
			}
		);
		$("a#play").click
		(
			function()
			{
				// only commence playback if we have the on class
				if($(this).hasClass("on"))
				{
					pianoRef.playback()
				}
			}
		);
	}

	this.toggleRecord = function()
	{
		// invert recording state
		this.recording = !this.recording;
		if(this.recording)
		{
			// empty array for recording
			this.recordedTrack = [];
			this.recordedTrackAvailable(false);
			// initialize start time
			recordStartTime = new Date().getTime();
		}
		else
		{
			this.recordedTrackAvailable(true);
			comms.sendTrack(pianoRef.recordedTrack);
		}
	}

	this.recordedTrackAvailable = function(available)
	{
		available ? $("a#play").addClass("on") : $("a#play").removeClass("on");
	}

	this.playback = function()
	{
		// loop through recordedTrack
		$.each
		(
			pianoRef.recordedTrack,
			function(index, item)
			{
				setTimeout
				(
					function()
					{
						// use network event so release is automatically handled
						$("#" + item.note).triggerHandler("network");
					},
					item.time
				);
			}
		);
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