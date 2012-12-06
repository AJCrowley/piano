// globally instance objects
var config = new Config();
var piano = new Piano();

$(document).ready
(
	function($)
	{
		// listen for config loaded event
		$(config).bind
		(
			config.EVENT_LOADED,
			function(event)
			{
				// load socket.io library
				head.js(config.host + ":" + config.settings.network.socketPort + "/socket.io/socket.io.js");
				// when script has been loaded
				head.ready
				(
					function()
					{
						comms.init(config.host + ":" + config.settings.network.socketPort);
					}
				);
				$(loader).bind
				(
					loader.EVENT_PROGRESS,
					function(event)
					{
						// update progress text and bar
						var percentLoaded = parseInt(event.progress);
						if(String(percentLoaded).length < 2)
						{
							percentLoaded = "0" + String(percentLoaded);
						}
						$("div#loading span#loadBar span").css("width", event.progress + "%")
						$("div#loading span#loadText").html("LOADING " + percentLoaded + "%");
					}
				).bind
				(
					loader.EVENT_COMPLETE,
					function(event)
					{
						// hide loading overlay
						$("div#loading").fadeOut("slow");
						piano.init();
					}
				);
				// preload soundfiles so they're in cache
				loader.load(config.settings.sounds.files);
			}
		);
		config.load("conf/config.json");
	}
);