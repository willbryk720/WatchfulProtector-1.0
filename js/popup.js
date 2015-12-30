/* 
Popup page for Chrome Extension

Referenced to only by popup.html
*/

document.addEventListener('DOMContentLoaded', function() {
	
  // open up options page if settings button on popup is clicked
  var checkButton = document.getElementById('checkPage');
  checkButton.addEventListener('click', function() {

	chrome.tabs.create({'url': chrome.extension.getURL('options.html')});
	
  }, false);
  
}, false);