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
		if(!$.isArray(files))
		{
			console.log("File array required");
		}
		else
		{
			var filesLoaded = 0;
			$(files).each
			(
				function(index, item)
				{
					$.ajax
					({
						url: item,
						success: function()
						{
							filesLoaded++;
							if(filesLoaded == files.length - 1)
							{
								eventType = loaderRef.EVENT_COMPLETE;
							}
							else
							{
								eventType = loaderRef.EVENT_PROGRESS;
							}
							var eventObj = $.Event(eventType);
							eventObj.progress = (100 / files.length) * filesLoaded;
							dispatchEvent(eventObj);
						}
					});
				}
			);
		}
	}
}