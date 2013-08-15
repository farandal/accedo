# Video Podcast web app #

This is a simple webapp which lets you browse and watch a subset of the CNN Video Podcast catalog.

## V1.0 Features: ##
* 	The application reads the RSS file for one of the video podcasts available on http://www.cnn.com/services/podcasting/ 
* 	The application display a list of available episodes for the feed. 
* 	The list shows four episodes, and allow the user to scroll up and down in the list using arrow keys in case more than four episodes are available.
* 	When the user selects one episode, that episode shall start playing in the video playback area and the episode's description must appear beneath the video playback area.
* 	The app works even if the RSS feed from CNN is changed to another CNN video podcast RSS feed with the same structure. 

## Information Display:##
* 	The podcast name
* 	The podcast description
* 	A list of episodes with their title and pub date
* 	A video window showing episodes
* 	A description of the current video

## Technical Requirements ##
* 	The app work in Firefox 5.+ and/or in Chrome.
* 	The app was developed using (X)HTML, JavaScript and CSS.
* 	The app is usable by using only the arrow keys (UP/DOWN/LEFT/RIGHT) for navigation, and the return key (ENTER) for selection. No dependencies on mouse navigation are required.
* 	The app fits entirely inside an area of 1280x720 pixels. It can fit other resolutions, but no other scenario was tested.
* 	The app is runnable using a normal Apache server. 

## Additional Plugins: ##
* 	Player: JWPlayer is used, also the script can be extended to support any other player.
* 	Proxy: Goolge API is used as a ‘proxy’ is used in order to read XML feeds from CNN.com using AJAX.
* 	Javascript: JQuery framework is used in order to simplify Ajax requests and DOM Manipulation.
* 	Styling: (ex Twitter) Bootstrap is used as the base CSS framework and some CSS3-features such as rounded corners and gradients are used.


