/* 
Background page for Chrome Extension
*/


// found it easier to declare variables here then to pass them into function arguments
blocked_urls=[];
var previously_on_facebook; 
var time_spent;
var startTime;
var endTime;
var time_allowed;
var starting_date;
var save_url = "dummy"; // dummy variable
var blocked_url_name;
var url_new;
var previous_url;

// get all data from storage, then use it to update information necessary before listening for url requests
chrome.storage.local.get(null,function(everything) {

    // This code restarts time_spent if it's a new day, since you havn't spent time yet during a new day
	var date_for_update = String(new Date());
	if (everything.DateForNewDay != undefined) //undefined means first day extension used so TimeOnFacebook already 0.
	{
    	var date_parts1 = date_for_update.split(' ');
    	var date_parts2 = everything.DateForNewDay.split(' ');
    	// parse last date on record and current date, check if any difference in day,month, or year
		if ( (date_parts1[1] != date_parts2[1]) || (date_parts1[2] != date_parts2[2]) || (date_parts1[3] != date_parts2[3]))
    	{
    		chrome.storage.local.set({"TimeOnFacebook" : 0});
    	}
    }	

	// need to store StartingDate that used application, will eventually need to know day of usage. Stored as string. 
    if (everything.StartingDate == undefined) 
	{	
		starting_date = String(date_for_update);
		chrome.storage.local.set({"StartingDate" : String(date_for_update)});
	}	
	else
	{
		// need this variable to send to statistics page
		starting_date = everything.StartingDate
	}
	
	// store date of last time background page was opened. Important that this comes after checking for new day
	chrome.storage.local.set({"DateForNewDay" : String(date_for_update)});

});

// listen for message from statistics page requesting WebHistory data, and then send data
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  	chrome.storage.local.get("WebHistory", function (obj) { 
  		chrome.storage.local.get("bad_sites_key", function (obj_two) { 	
    			sendResponse([obj.WebHistory,obj_two.bad_sites_key,starting_date]);
    	});
    	return true;
    });
    return true;
});


// listen for new url request
chrome.webRequest.onBeforeRequest.addListener( function(details) {
    	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    		if (tabs.length == 0)
    		{
    			return;
    		}	
    		url_new = tabs[0].url;

			// with new url, check to make sure url is different than the previous one stored.
			// this helps avoid redundant calculations, since often many of the same url's are requested when a website is searched
    		if (save_url != url_new)
    		{
    			previous_url = save_url;
    			save_url = url_new;
    			// get all data, then update site
				chrome.storage.local.get(null,function(everything) {
		
					if (everything.bad_sites_key != undefined) 
					{
    					blocked_urls = everything.bad_sites_key;
					}
			
					if (everything.TimeOnFacebook != undefined) 
					{
    					time_spent = everything.TimeOnFacebook;
					}	
					else
					{
						time_spent = 0;
					}
			
					if (everything.time_allowed != undefined) 
					{
    					time_allowed = everything.time_allowed;
					}	
					else
					{
						time_allowed = 0;
					}
			
					update_site()				
				});
			}	
		});
    }, { urls: ["<all_urls>"] }, ["blocking"]
);


function update_site()
{
		// using variable to check if site requested is blocked (blocked means user only allowed to spend certain amount of time each day)
        var is_blocked = false;
        
        // store which site blocked the url for recording history purposes
        for (var i = 0; i < blocked_urls.length; i++) { // if 0 length is_blocked will remain false
            if (url_new.indexOf(blocked_urls[i]) !== -1)
            {
            	is_blocked = true;
            	blocked_url_name = blocked_urls[i];
            	break;
            }
        }
		
		// if site is not on blocked sites list, need to know if user came from a blocked site
        if(!is_blocked) 
        {
        	if (previously_on_facebook == undefined)
			{
				previously_on_facebook = false; // must be first request since background page last loaded. 
			}       	
        	else if (previously_on_facebook )  // user went from blocked site to non-blocked site so record time_spent
        	{
        		// save date when user switched pages, and update information
        		previously_on_facebook = false;
        		endTime = new Date();
        		time_spent = time_spent + (endTime - startTime);
        		record_history((endTime - startTime), blocked_url_name, endTime);
        	}
        }
        else // we know user is on a blocked page now. Need to know if user came from a blocked page
        { 
        	if (previously_on_facebook == undefined)
        	{
        		startTime = new Date();			
				previously_on_facebook = true;
        	}
			else if (previously_on_facebook) // user came from blocked page and is now on a different blocked page, calculate time spent
			{
				var midTime = new Date();
        		time_spent = time_spent + (midTime - startTime);
        		
        		// we need to save the url user came from (previous_url), not the current one
        		// we need to record history using previous_url's corresponding blocked name
        		var save_blocked_name;
        		for (var i = 0; i < blocked_urls.length; i++) 
        		{
            		if (previous_url.indexOf(blocked_urls[i]) !== -1)
            		{
            			saved_blocked_name = blocked_urls[i];
            			break;
            		}
        		}
        		record_history((midTime - startTime), saved_blocked_name, midTime);

        		startTime = midTime;
			}
			else if (!previously_on_facebook) 
			{
				// user came from non-blocked page so start clock to eventually calculate how much time user was on it
				startTime = new Date();			
				previously_on_facebook = true;
			}
		
			// if time on blocked pages is already more than time allowed on pages, redirect to my personal page (hope it's inspirational!)
    		if (time_spent >= time_allowed)
			{
				chrome.tabs.update({url: "redirect.html"});
			}
        } 
        
        // set new values for these stored variables
        chrome.storage.local.set({"OnFacebook" : previously_on_facebook});
        chrome.storage.local.set({"TimeOnFacebook" : time_spent});
		chrome.storage.local.set({"DateForDelay" : String(new Date())});
} 
        
// record history function
function record_history(time_used,url_blocked,date_finished)
{
	var history_object = {};
	var time_days_array = [];
	var starting_date;
	
	// get starting date and WebHistory data
	chrome.storage.local.get("StartingDate", function (obj) {
		starting_date = String(new Date(obj.StartingDate));

    	chrome.storage.local.get("WebHistory", function (obj_two) {
    		if (obj_two.WebHistory != undefined) 
    		{
    			history_object = obj_two.WebHistory;
    			if (history_object[url_blocked] != undefined)
    			{
					time_days_array = history_object[url_blocked];
				}
			}
			// now update the history
			change_history(time_used,url_blocked,date_finished,history_object,starting_date,time_days_array);
    	});
	});
}

function change_history(time_used,url_blocked,date_finished,history_object,starting_date,time_days_array)
{   
    var day_of_usage; // 0 is the first day
    
    // formula to figure out which day it is currently, relative to the first day (starting_date)
	var date_hms = starting_date.split(' ')[4].split(':');
	// find milliseconds that were left in the starting_date
	var mill_left = (86400000 - (date_hms[0] * 3600000 + date_hms[1] * 60000 + date_hms[1] * 1000));
	var date_today = date_finished;
	
	// now find current day_of_usage
	if ((date_today - new Date(starting_date)) >= mill_left)
	{	
		// uses number of milliseconds between current date and midnight of starting_date to find current day
		day_of_usage = Math.floor(((date_today - new Date(starting_date)) - mill_left) / 86400000) + 1;		
	}
	else
	{
		day_of_usage = 0;
	}
   	if (time_days_array[day_of_usage] == undefined)
   	{
   		time_days_array[day_of_usage] = Math.ceil(time_used/1000);
   	}
   	else
   	{
   		time_days_array[day_of_usage] = Math.ceil((time_days_array[day_of_usage] * 1000 + time_used)/1000);
   	}

    // if the blocked url does not have previous data from days before day_of_usage, those days will have undefined values
    // since user must have spent no time on this website those days, change undefined to 0
    for (var i = 0; i < time_days_array.length; i++)
    {
    	if (time_days_array[i] == undefined)
    	{
    		time_days_array[i] = 0;
    	}
    }
    
    // update WebHistory with new data for particular website
    history_object[url_blocked] = time_days_array;
    
    chrome.storage.local.set({"WebHistory" : history_object});
}
