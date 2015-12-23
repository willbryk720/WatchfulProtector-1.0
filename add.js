/* 
Add page for Chrome Extension

Referenced to only by Add.html
*/


blocked_urls=[];

// when Add.html is loaded
document.addEventListener('DOMContentLoaded', function() {


	// function to display on page all sites that are blocked
    chrome.storage.local.get("bad_sites_key", function (obj) {
    	if (Object.keys(obj).length !== 0) 
		{
    		blocked_urls = obj.bad_sites_key;

      		document.getElementById("first").innerHTML = "";
       		var print_sites;
       		var id_label;
       		
       		// build html with button next to each site
       		for (var i = 0; i < blocked_urls.length; i++)
			{
			  	id_label = "remove_" + String(i);
    			print_sites = document.getElementById("first");
				print_sites.innerHTML = print_sites.innerHTML + "&emsp;&emsp;" + blocked_urls[i] + 
				'<button id= \"' + id_label + '\" style=\"position:absolute;left:300px;\">Remove Page</button>' + "<br><br>";
			}	
		}
	});



	// wait until user clicks add page button
	var checkButton = document.getElementById("add_page");
  	checkButton.addEventListener('click', function() {

    	// get the value of the input 
    	var text = document.getElementById("url_input").value;
    
    	// make sure input is a normal website name
    	if ((text.indexOf(".com") !== -1) || (text.indexOf(".org") !== -1) || (text.indexOf(".edu") !== -1) 
    	   || (text.indexOf(".gov") !== -1) || (text.indexOf(".net") !== -1)) 
    	{
    		// check if url doesn't already exist in blocked sites array
    		for (var i = 0; i < blocked_urls.length; i++)
    		{
    			if ((text.indexOf(blocked_urls[i]) !== -1) || (blocked_urls[i].indexOf(text) !== -1))
    			{
    				return;
    			}
    		}
    		
    		// if url doesn't already exist, add it to the array of blocked sites
    		blocked_urls.push(text);
    		 
   	 		// redo display on page all sites that are blocked
    	  	document.getElementById("first").innerHTML = "";
    		var print_sites;
    		var id_label
       		for (var i = 0; i < blocked_urls.length; i++)
			{
			  	id_label = "remove_" + String(i);
    			print_sites = document.getElementById("first");
				print_sites.innerHTML = print_sites.innerHTML + "&emsp;&emsp;" + blocked_urls[i] + 
				'<button id= \"' + id_label + '\" style=\"position:absolute;left:300px;\">Remove Page</button>' + "<br><br>";
    		}	
			
			// update bad sites array in storage
			chrome.storage.local.set({"bad_sites_key" : blocked_urls});
		} 

	}, false);



	//remove from blocked page array
	var checkButton = document.getElementById("first");
	checkButton.addEventListener('click', function(e) {
	
    	var is_clearance = false;
    	var current_level = "Level_0"; // in case clearance level is undefined. Level_0 means user always has clearance
    	var clearance_date;
    	
    	// get clearance level and clearance date
    	chrome.storage.local.get("ClearanceLevel", function (obj) {
    		chrome.storage.local.get("ClearanceDate", function (obj_two) {

    			if (obj.ClearanceLevel == undefined) 
					is_clearance = true;
    			else
    				current_level = obj.ClearanceLevel;
    		
    			if (obj_two.ClearanceDate == undefined) 
					clearance_date = "undef"
    			else
    				clearance_date = obj_two.ClearanceDate;
    				
    			// get the value of the security level
        		var level_index = parseInt(current_level.charAt(6));
        		// if the level is 1 or greater
        		if (level_index >= 1)
        		{
        			// the clearance date has to be defined and within one minute ago for is_clearance to become true
					if (clearance_date != "undef")
					{
  	  					var current_date = new Date();
						if ((current_date - new Date(clearance_date)) < 60000)
    						is_clearance = true;	
    				}
				}
				else
					is_clearance = true;
		
				// if user doesn't have clearance let user know
    			if (!is_clearance)
    			{
    				document.getElementById("clearance_message").innerHTML = "<br> You do not have clearance to remove sites! Why remove it anyway? To procrastinate? You can beat procrastination. If you must, go to the security page to get clearance. :( ";
    			}
    			else // if user does have clearance to remove
    			{
    				// get the index of the site to be removed
    				index = parseInt(e.target.id.charAt(7));
    				
    				// take out the site from the blocked_urls array
    				blocked_urls.splice(index,1);
    
    				// update storage
    				chrome.storage.local.set({"bad_sites_key" : blocked_urls});
    
    				// redo display on page all sites that are blocked
    				document.getElementById("first").innerHTML = "";
    				var print_sites;
    				var id_label
    				for (var i = 0; i < blocked_urls.length; i++)
					{
						id_label = "remove_" + String(i);
    					print_sites = document.getElementById("first");
						print_sites.innerHTML = print_sites.innerHTML + "&emsp;&emsp;" + blocked_urls[i] + 
						'<button id= ' + id_label + ' style=\"position:absolute;left:300px;\">Remove Page</button>' + "<br><br>";
					}
    			}

			});	
    	});

	}, false);



}, false);


