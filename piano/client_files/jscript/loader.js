this.loader = new function()
{
	// self ref
	var loaderRef = this;

	// event constants
	this.EVENT_PROGRESS = "loaderProgress";
	this.EVENT_COMPLETE = "loaderComplete";

	var dispatchEvent = function(eventObj)
	{
		$(loaderRef).triggerHandler(eventObj);
	}

	this.load = function(files)
	{
		// check that we have an array
		if(!$.isArray(files))
		{
			console.log("File array required");
		}
		else
		{
			// set loaded counter
			var filesLoaded = 0;
			$(files).each
			(
				function(index, item)
				{
					// create ajax request to cache file
					$.ajax
					({
						url: item,
						success: function()
						{
							// increment counter
							filesLoaded++;
							// are we done?
							if(filesLoaded == files.length - 1)
							{
								// dispatch complete event
								eventType = loaderRef.EVENT_COMPLETE;
							}
							else
							{
								// nope, dispatch progress event
								eventType = loaderRef.EVENT_PROGRESS;
							}
							var eventObj = $.Event(eventType);
							// attach progress to event object
							eventObj.progress = (100 / files.length) * filesLoaded;
							dispatchEvent(eventObj);
						}
					});
				}
			);
		}
	}
}