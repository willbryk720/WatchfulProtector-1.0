/* 
Clock page for Chrome Extension

Referenced to only by popup.html
*/

var on_facebook = false;
var time_allowed = 0;
var time_spent = 0;
var save_popups_time;

// wait until popup is loaded
document.addEventListener('DOMContentLoaded', function() {

	// get data from storage. If data is undefined, default values will be ones specified in global variable declarations above
	chrome.storage.local.get(null,function(obj) {
		var whats_the_date = new Date();
		if (obj.OnFacebook != undefined) 
		{
    		on_facebook = obj.OnFacebook;
    	}	
    	if (obj.time_allowed >= 0)
		{
    		time_allowed = obj.time_allowed;
    	}	
    	
    	// find initial value for clock by getting time_spent that day on blocked sites
    	// will eventually subtract from time_allowed to get time left
    	if (on_facebook)
		{
			if ( (obj.TimeOnFacebook >= 0) && ((whats_the_date - (new Date(obj.DateForDelay)) ) >= 0))
			{
    			time_spent = obj.TimeOnFacebook + (whats_the_date - (new Date(obj.DateForDelay)));
    		}
    		else if (((whats_the_date - (new Date(obj.DateForDelay)) ) >= 0))
    		{
    			time_spent = whats_the_date - (new Date(obj.DateForDelay));
    		}
    	}
    	else if (obj.TimeOnFacebook >= 0)
    	{
    		time_spent = obj.TimeOnFacebook;
    	}

		// update the clock in the popup window
  		update_clock();
  		
	});

}, false);


function update_clock()
  	{
  		// get time left in milliseconds
  		var time_left_mil = time_allowed - time_spent;
  		
  		// output Out_of_Time if user used up time_allowed
  		if (time_spent >= time_allowed)
  		{
  			document.getElementById("clock_popup").firstChild.nodeValue = "Out_of_Time";
  			return;
  		}

		// turn time_left_mil into hours, minutes, and seconds
  		var hours = Math.floor(time_left_mil / 3600000);
  		var minutes = Math.floor( (time_left_mil - hours * 3600000)/ 60000 );
  		var seconds = Math.floor( (time_left_mil - hours * 3600000 - minutes * 60000)/ 1000 );  
  
  		// give zeros
  		if (hours < 10)
  			hours = "0" + hours;
  		else
  			hours = "" + hours;
  			
  		if (minutes < 10)
  			minutes = "0" + minutes;
  		else
  			minutes = "" + minutes;
		
		if (seconds < 10)
  			seconds = "0" + seconds;
  		else
  			seconds = "" + seconds;
	
  		// output clock for popup
  		document.getElementById("clock_popup").firstChild.nodeValue = hours + ":" + minutes + ":" + seconds;
  
  		// if user is on facebook update the clock every second with one more second added to time_spent
  		if (on_facebook)
  		{
  			time_spent = time_spent + 1000;
  			setTimeout(update_clock, 1000);
  		}
	
  	}