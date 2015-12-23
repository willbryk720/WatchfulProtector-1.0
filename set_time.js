/* 
Set Time page for Chrome Extension

Referenced to only by options.html (set_time page of website)
*/

// when options.html is loaded
document.addEventListener('DOMContentLoaded', function() {

    var time_allowed;
    var spent_minutes;
    
    // get data from storage
    chrome.storage.local.get("time_allowed", function (obj) {
   		chrome.storage.local.get("TimeOnFacebook", function (obj_two) {

    		if (obj.time_allowed == undefined) 
			{
				time_allowed = 0
    		}
    		else
    		{
    			time_allowed = obj.time_allowed;
    		}
    		if (obj_two.TimeOnFacebook == undefined) 
			{
				spent_minutes = 0
    		}
    		else
    		{
    			spent_minutes = obj_two.TimeOnFacebook;
    		}
			document.getElementById("timeset_message").innerHTML = "<br> You have used " + Math.floor(spent_minutes/60000) + " Minutes, " + Math.floor((spent_minutes % 60000)/1000) + 
			" Seconds today while your time allowed each day is currently " + (time_allowed/60000).toFixed(2) + " Minutes";
		});
	});

	// wait for user to click set time button 
	var checkButton = document.getElementById("set_timer");
  	checkButton.addEventListener('click', function() {
	
    	var num_value = document.getElementById("timer_input").value;
    
    	var is_clearance;
    
    	// get the clearance date and clearance level
   		chrome.storage.local.get("ClearanceDate", function (obj) {
    	 chrome.storage.local.get("ClearanceLevel", function (obj_two) {

    		if ((obj_two.ClearanceLevel == undefined) || (obj_two.ClearanceLevel == "Level_0"))
			{
				// if there's no level or the level is 0, no need for clearance
				is_clearance = true;
    		}
    		else
    		{
    			if (obj.ClearanceDate == undefined) 
				{
					// if there's no clearance date, user certainly has no clearance
					is_clearance = false;
    			}
    			else
    			{
    				// check if clearance date is within one minute ago
    				var current_date = new Date();
    				if ((current_date - (new Date(obj.ClearanceDate))) < 60000)
    					is_clearance = true;	
   		 			else
    					is_clearance = false;
    			}
    		}
    		
    		// respond to user's request
    		send_message(is_clearance, num_value, time_allowed, spent_minutes);
    		
    	 });
    	});

	
	}, false);
	
}, false);


function send_message(is_clearance, num_value, time_allowed, spent_minutes)
{
	//make sure inputted appropriate number (number of minutes in day is max-limit)
    if (!isNaN(num_value) && (num_value != '') && (num_value >= 0) && (num_value < 86400)) 
    {
    	// if user requested more time and user doesn't have clearance
    	if (!is_clearance && (num_value > time_allowed/60000 ) )
    	{
    		document.getElementById("timeset_message").innerHTML = "<br> C'mon man. Don't underestimate yourself. You can beat procrastination. If you must, go to the security page to get clearance. :( ";
    	}
    	else // any other possibility is fine
    	{
    		// update time allowed each day and let the user know
			chrome.storage.local.set({"time_allowed" : Math.floor(num_value * 60 * 1000)}); 
    		document.getElementById("timeset_message").innerHTML = "<br> Time Allowed Each Day Successfully Changed To " + num_value + " Minutes" + "<br><br> You have used " + Math.floor(spent_minutes/60000) + " Minutes, " + Math.floor((spent_minutes % 60000)/1000) + " Seconds today";
       	}

	} 
}
