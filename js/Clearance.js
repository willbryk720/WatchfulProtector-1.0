/* 
Clearance page for Chrome Extension

Referenced to only by Clearance.html
*/

var index_array = 0
var index;

// when clearance.html is loaded
document.addEventListener('DOMContentLoaded', function() {

	// get security level, tell user if no need for clearance
	chrome.storage.local.get("ClearanceLevel", function (obj) {
		if (obj.ClearanceLevel == undefined) 
		{
    		document.getElementById("current_level_message").innerHTML = "No need to get Clearance. You have no security level";
    	}
    	else if (obj.ClearanceLevel == "Level_0")
    	{
    		document.getElementById("current_level_message").innerHTML = "No need to get Clearance. Your security level is Level_0";
    	}
    	else
    	{
    		// tell user clearance level
    		document.getElementById("current_level_message").innerHTML = "Your security level is " + obj.ClearanceLevel; 
    		  
    		// wait for clearance button to be clicked
			var ClearanceButton = document.getElementById("clearance_button");
  			ClearanceButton.addEventListener('click', function() {
	
  				document.getElementById("text_build").innerHTML = "";
  					
  				// long strings for clearance challenge (sentences intended to make user rethink his decision to get clearance) 
  				messages_matrix = ['"We know who we are. We know not what we may be"', '"But why, some say, the moon? Why choose this as our goal? And they may well ask why climb the highest mountain? Why, 35 years ago, fly the Atlantic? We choose to go to the moon. We choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win."',
  				'"We are going to die, and that makes us the lucky ones. Most people are never going to die because they are never going to be born. The potential people who could have been here in my place, but who will in fact never see the light of day, outnumber the sand grains of Sahara. Certainly those unborn ghosts include greater poets than Keats, scientists greater than Newton. We know this because the set of possible people allowed by our DNA so massively outnumbers the set of actual people. In the teeth of these stupefying odds, it is you and I, in our ordinariness, that are here. We live on a planet that is all but perfect for our kind of life, not too warm and not too cold, basking in kindly sunshine, softly watered; a gently spinning, green and gold harvest-festival of a planet. Yes, and alas, there are deserts and slums; there is starvation and racking misery to be found. But take a look at the competition. Compared with most planets this is paradise and parts of Earth are still paradise by any standards. Imagine a spaceship full of sleeping explorers, deep-frozen would-be colonists of some distant world. The voyagers go into the deep-freeze, soberly reckoning the odds against their spaceship’s ever chancing upon a planet friendly to life. After millions of years the ship does find a planet capable of sustaining life: a planet of equable temperature, bathed in warm star shine, refreshed by oxygen and water. The passengers, Rip van Winkles, wake stumbling into the light. After a million years of sleep, here is a whole new fertile globe, a lush planet of warm pastures, sparkling streams and waterfalls, a world bountiful with creatures, darting through alien green felicity. Our travellers walk entranced, stupefied, unable to believe their unaccustomed senses or their luck. The story asks for too much luck; it would never happen. And yet, isn’t it what has happened, to each one of us? We HAVE woken after hundreds of millions of years asleep, defying astronomical odds. Admittedly we didn’t arrive by spaceship, we arrived by being born, and we didn’t burst conscious into the world but accumulated awareness gradually through babyhood. The fact that we gradually apprehend our world, rather than suddenly discovering it, should not subtract from its wonder. It is no accident that our kind of life finds itself on a planet whose temperature, rainfall and everything else are exactly right. If the planet were suitable for another kind of life, it is that other kind of life that would have evolved here. But still, we, as individuals, are hugely blessed, privileged, and not just privileged to enjoy our planet, more, we’re granted the opportunity to understand why our eyes are open, and why they see what they do, in the short time before they close forever. . ."'
				];
  				
  				// get level number and words from corresponding message for that level
  				index = parseInt(obj.ClearanceLevel.charAt(6));
				message = messages_matrix[index - 1];
				var words = message.split(' '); 
				
				// give button to begin challenge and first word of the challenge, get length of words_array
				document.getElementById("html_insert").innerHTML = "<input id=\"challenge_input\" type=\"text\"><button type=\"button\" id= \"enter_button\">Enter</button>";
				document.getElementById("text_insert").innerHTML = words[0];
				words_length = words.length;
					
				var EnterButton = document.getElementById("enter_button");
  				EnterButton.addEventListener('click', function() {
  					// when user presses button begin challenge
  					build_line(words,words_length)
  				});
  			});	
  		} 
    });
  					
});

function build_line(words,words_length)
{
	// get user's text input
	var text = document.getElementById("challenge_input").value;
	
	// if user inputted correct last word, update date user got clearance
  	if ((text == words[index_array]) && (index_array == words_length - 1))
  	{
  		document.getElementById("text_insert").innerHTML = "<br><u>You have one minute to:</u><br><br>Remove websites from blocked list<br><br>Increase how much time you are allowed on blocked sites each day<br><br>Decrease your security level";
  		document.getElementById("text_build").innerHTML = "";
  		index_array = 0;
  		var store_date = String(new Date());
  		chrome.storage.local.set({"ClearanceDate": store_date});
  	}
  	else if (text == words[index_array]) // if its not the end, build the output by one word and proceed with loop
  	{
  		index_array = index_array + 1;
  		document.getElementById("text_insert").innerHTML = words[index_array];
  		var build_message = document.getElementById("text_build").innerHTML;
  		build_message = build_message + text + "&nbsp;";
  		document.getElementById("text_build").innerHTML = build_message;
  	}
  	else // if user messed up word, delete progress user made and convince user to stop trying to look at puppy videos on youtube
  	{
  		index_array = 0;
  		document.getElementById("text_insert").innerHTML = "";
  		document.getElementById("html_insert").innerHTML = "";
  		document.getElementById("text_build").innerHTML = "You messed up. You sure you want to try again?";
  	}
}