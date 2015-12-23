/* 
Statistics page for Chrome Extension

Referenced to only by Statistics.html
*/


// when Statistics.html is loaded
document.addEventListener('DOMContentLoaded', function() {  
	// send a message request for data
	// background page will be listening and will send a response with WebHistory, blocked sites list, 
	// and the starting date of the website 
  	chrome.runtime.sendMessage("message",function(event) {
  	
  		var history_object = event[0];
  		var bad_sites = event[1];
  		var starting_date = event[2];
		// if there is some web history already
    	if (history_object != undefined) 
    	{	
    		// start out page with intro
			graphs_intro = document.getElementById("graphs_intro");
			graphs_intro.innerHTML = "<h3>Here are the graphs of the websites you are tracking</h3><h4><u>Graphs track minutes spent per day</u></h4><h5>All Data began logging the first day you used Watchful Protector: " + starting_date.substring(0, 10) + "</h5><br>";
		
			graph_layout = document.getElementById("graph_page");
			graph_layout.innerHTML = "";
		
			// each array should have a length equal to the number of days user has had extension
			// find_days_used returns number of days with the first day being 0, so add 1
			var longest_length = find_days_used(starting_date) + 1;
			for (var i = 0; i < bad_sites.length; i++)
    		{
    			// input graph title as well as a canvas ready for the graph input
				graph_layout.innerHTML = graph_layout.innerHTML + "<h3>" + bad_sites[i] + "</h3>" + 
				"<canvas id=\"" + "graph_" + i + "\"width=\"300\" height=\"200\"></canvas>" + "&emsp;"; 
    		}
  		
  			// needed to do loop twice because chart.js would only load the last graph if this code were in the previous loop
  			for (var i = 0; i < bad_sites.length; i++)
    		{
    			// if user has a site on the blocked site list that user has never used, pad array with zeros 
    			// because user still wants to track time spent on that website
    			if (history_object[bad_sites[i]] == undefined)
    			{
    				history_object[bad_sites[i]] = []
    				for (var j = 0; j < longest_length; j++)
    					history_object[bad_sites[i]][j] = 0;
    			}
    			else
    			{
    				for (var j = 0; j < longest_length; j++)
    				{	
    					// pad arrays that are shorter with zeroes (user spent zero time on those sites those days)
    					if (history_object[bad_sites[i]][j] == undefined)
    						history_object[bad_sites[i]][j] = 0;
    					else // turn seconds value into minutes value
    						history_object[bad_sites[i]][j] = history_object[bad_sites[i]][j]/60;
    				}
    			}
    				
    			// create x axis for graph, days from 1 to number of days since starting date
    			var OnetoNarray = [];
    			for (var z = 1; z < longest_length + 1; z++)
    			{
    				OnetoNarray[z-1] = z;
    			}
    		
    			// add graph data for Chart.js to create chart
    			var graph_data = 
    			{
					labels : OnetoNarray, // x-axis
					datasets : [
						{
						fillColor : "rgba(172,194,132,0.4)",
						strokeColor : "#ACC26D",
						pointColor : "rgba(50,182,93,1)",
						pointStrokeColor : "#9DB86D",
						data : history_object[bad_sites[i]] // minutes spent each day
						}
				  	]
				}
				// input graph to corresponding html element
    			var graph_i = document.getElementById("graph_" + i).getContext('2d');
    			new Chart(graph_i).Line(graph_data);		
    		}
    
    	}
    	else // if there's no WebHistory yet
		{
    		graph_layout = document.getElementById("graph_page");
			graph_layout.innerHTML = "<h3>No Statistics to Print</h3>"
		}
    
	});

}, false);

function find_days_used(starting_date)
{
	var day_of_usage; // 0 is the first day
    
    // formula to figure out which day it is currently, relative to the first day (starting_date)
	var date_hms = starting_date.split(' ')[4].split(':');
	// find milliseconds that were left in the starting_date
	var mill_left = (86400000 - (date_hms[0] * 3600000 + date_hms[1] * 60000 + date_hms[1] * 1000));
	var date_today = new Date();
	
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
	return day_of_usage;
}
