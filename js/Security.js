/* 
Security page for Chrome Extension

Referenced to only by Security.html
*/

var index_array = 0;
var level_chosen;

// when security page is loaded
document.addEventListener('DOMContentLoaded', function() {

	// get clearance level
	chrome.storage.local.get("ClearanceLevel", function (obj) {
		if (obj.ClearanceLevel == undefined) 
		{
    		document.getElementById("current_level_message").innerHTML = "You do not have a security level currently";
    	}
    	else
    	{
    		document.getElementById("current_level_message").innerHTML = "Your security level is " + obj.ClearanceLevel;
    	}
    });
    
    // add listeners for each radio button 
	var checkButton = document.forms["myform"].elements["security_level"];

	for(var i = 0; i < checkButton.length; i++) 
	{
    	checkButton[i].addEventListener('click', function() {

			level_chosen = this.value;
			
			// respond to choice
			respond_to_choice();
    	});
	}
}, false);



function respond_to_choice()
{
	// need to find clearance level from storage again because it can change without having reloaded the document
	chrome.storage.local.get("ClearanceLevel", function (obj) {
	
		// if no clearance level just change clearance level to level chosen
		if (obj.ClearanceLevel == undefined) 
		{
    		chrome.storage.local.set({"ClearanceLevel" : level_chosen});
        	document.getElementById("current_level_message").innerHTML = " Your security level now is " + level_chosen;
    	}
		else // if there already is a clearance level
		{ 
			// get which level is chosen and which level user already has
    		index = parseInt(level_chosen.charAt(6));
			index2 = parseInt(obj.ClearanceLevel.charAt(6));
			if (index == index2)
			{
				document.getElementById("response_choice_message").innerHTML = " You already have that security level!";
			}
			else if (index > index2) // if level chosen is more difficult, change level and congratulate user
			{
				chrome.storage.local.set({"ClearanceLevel" : level_chosen});
				document.getElementById("current_level_message").innerHTML = " Your security level now is " + level_chosen;
				document.getElementById("response_choice_message").innerHTML = " You are a trooper!";
			}
			else
			{
				// if level chosen is less difficult, require clearance
				var is_clearance = false;
				
				chrome.storage.local.get("ClearanceDate", function (obj) {
					if (obj.ClearanceDate != undefined) 
					{
    					var current_date = new Date();
    					if ((current_date - (new Date(obj.ClearanceDate))) < 60000)
    					{
    						is_clearance = true;
    					}	
    				}
							
					// if user has clearance, change security level
					if (is_clearance)
					{
						chrome.storage.local.set({"ClearanceLevel" : level_chosen});
						document.getElementById("current_level_message").innerHTML = " Your security level now is " + level_chosen;
						document.getElementById("response_choice_message").innerHTML = "";
					}
					else // if user doesn't have clearance
					{
						document.getElementById("response_choice_message").innerHTML = "&emsp;" + "You're going to need clearance to change that." + "<br><br>" + "&emsp;" + "Go to the Clearance page and pass the challenge";	
					}
				});
			}
	    }
    	
	});		
}




	 

