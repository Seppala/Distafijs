//Button listeners

jQuery(window).ready(function(){
        	
			//<td><a href="#" id="setStart" onclick="saveStartPos(startPos)">Click here to confirm beginning location of the shot.</a>
			
			//Click on start 
			
			//When one of the club links is clicked the geolocation is started
			jQuery(".club").click(initiate_geolocation);
			
			//jQuery("#setStart").click(saveStartPos(startPos));
			
			//When calculate is clicked the geoposition for the second place(where the ball landed) 
			//is calculated and the distance also calculated and shown to the user
			jQuery("#calculate").click(initiate_secondgeo);
			
			//When "save" is clicked the shot metrics (geopositions, club and distance) are saved.
			jQuery("#saveShot").click(saveShot);
			
			//When "save" is clicked the shot metrics (geopositions, club and distance) are saved.
			
			var clubId;
			jQuery(".club").click(function() {
				clubId = $(this).attr("id");
				localStorage.setItem("currentClub", clubId);
				document.getElementById("club").innerHTML= clubId;
				
			});
		});
		
		// How it works:
		// 1. Click on a club that fetches current geolocation. (initate_geolocation)
		// 2. Calculate the and show the coordinates to the user (calculateSpot)
		// 3. When the coordinates are accurate enough, the user saves the location saveStartLoc (save)
		// 4. At ball, acquire new coordinates ()
		
		//initiates a geolocation and sends it to calculateSpot that calculates and gives location to user
        function initiate_geolocation() {
            var startpoint = navigator.geolocation.watchPosition(calculateSpot, handle_errors, {enableHighAccuracy:true} );
			document.getElementById("status").innerHTML= 'acquiring geolocation for startposition';
        }
		
		
		//Shows the spot and accuracy to the user
		
		var startPos;
		
		function calculateSpot(position)
		{
			var pointAccur = position.coords.accuracy;
			
			//Calculate the position
			startPos = position;
			//show the user the position
			document.getElementById("accuracy").innerHTML= pointAccur;
			document.getElementById("longitude").innerHTML= startPos.coords.longitude;
			document.getElementById("latitude").innerHTML= startPos.coords.latitude;
			document.getElementById("status").innerHTML= 'Calculating position and accuracy for the shot';
			
			
		}
		
		//Saves the current position that has been calculated by initate_geolocation.
		//Then resets the geolocation to get ready to fetch the ending location of the ball. 
		//Then saves the current position so that it can be used for calculation with a new position.
		function saveStartPos(startPos) {
			//saves current position
			
			//saves the savedPos to the browsers local storage
			if (typeof(localStorage) == 'undefined' ) {
				alert('Your browser does not support HTML5 localStorage. Try upgrading.');
			} else {
				try {
					localStorage.setItem("savedPos", JSON.stringify(startPos)); //saves to the database, "key", "value"
				} catch (e) {
				 	 if (e == QUOTA_EXCEEDED_ERR) {
				 	 	 alert('Data couldnt be saved because the Quota was exceeded!'); //data wasn't successfully saved due to quota exceed so throw an error
					}
				}

			}
			document.getElementById("longitude1").innerHTML= startPos.coords.longitude;
			document.getElementById("latitude1").innerHTML= startPos.coords.latitude;
			
			//stops the geolocation
			stopWatch();
			document.getElementById("status").innerHTML= 'Saved location for where the shot was taken from';
			
		}
		
		//the endpoint variable is used to store the ending location of a shot or another place compared to where the shot was
		//hit from
		var endpoint
		
		function initiate_secondgeo() {
			endpoint = navigator.geolocation.watchPosition(calculate_distanceH, handle_errors, {enableHighAccuracy:true} );
			document.getElementById("status").innerHTML= 'Acquiring geolocation for endposition';
		}
		
		//d is the variable for the distance.
		var d;
		
		//Calculates the distance between position1 and position2
		function calculate_distanceH(position1){
			var R = 6371; // km
			var lat1 = position1.coords.latitude;
			var lon1 = position1.coords.longitude;
			
			//fetches the position that has been saved
			try {
				var savedPost = localStorage.getItem("savedPos"); 
				
				savedPost = jQuery.parseJSON( savedPost );
			} catch (e) {
				
				//alert('Couldnt fetch the location where the ball was hit from? Did you remember to set it? Sorry about that.');
				return;
			}
			try {
				var lat2 = savedPost.coords.latitude;
				var lon2 = savedPost.coords.longitude;
			} catch (f) {
				document.getElementById("status").innerHTML= 'Theres no position saved, click "hit from here" first ' + d + ' meters with your ' + clubId;
			}
			
			//Calculate the distance d from the saved position to the new fetched position.
			var dLat = (lat2-lat1).toRad();
			var dLon = (lon2-lon1).toRad();
			
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
			        Math.sin(dLon/2) * Math.sin(dLon/2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			d = (R * c)*1000;
			
			//show the distance to the user in the element with the id "distance"
			document.getElementById("distance").innerHTML= d;
			//stopWatchEnd();
			document.getElementById("status").innerHTML= 'Calculated distance';
			
			if (typeof(localStorage) == 'undefined' ) {
				alert('Your browser does not support HTML5 localStorage. Try upgrading.');
			} else {
				try {
					localStorage.setItem("tempEndingPos", JSON.stringify(position1)); //saves to the database, "key", "value"
				} catch (e) {
				 	 if (e == QUOTA_EXCEEDED_ERR) {
				 	 	 alert('Data couldnt be saved because the Quota was exceeded!'); //data wasn't successfully saved due to quota exceed so throw an error
					}
				}

			}
			
		document.getElementById("status").innerHTML= 'Calculated the distance for the shot, acquiring best location data.';
			
		}
		
		
		//saves the ending location (position1) to the browsers local storage
		function saveEnd() {
		
		
			try {
				var savedPost = localStorage.getItem("tempEndingPos"); 
				
			//savedPost = jQuery.parseJSON( savedPost );
			} catch (e) {
				
				alert('You shouldnt have to go through this. We Couldnt fetch the ending location for your shot? Did you press calculate to calculat the distance first? If you did, hit us an email at riku@seppa.la and well take care of that!');
				return;
			}
		
			if (typeof(localStorage) == 'undefined' ) {
				alert('Your browser does not support HTML5 localStorage. Try upgrading.');
			} else {
				try {
					localStorage.setItem("savedEnd", JSON.stringify(savedPost)); //saves to the database, "key", "value"
				} catch (e) {
			 	 	if (e == QUOTA_EXCEEDED_ERR) {
			 	 	 	alert('Data couldnt be saved because the Quota was exceeded!'); //data wasn't successfully saved due to quota exceed so throw an error
				}
			}

		}
		document.getElementById("status").innerHTML= 'Saved the ending position for the shot';
		}
		
		// Saves the shot, creates a shot object and stores the new shot object.
		
		function saveShot(position) {
			//Create a shot object and save it.
			savedPos = localStorage.getItem("savedPos");
			savedEnd = localStorage.getItem("savedEnd");
			clubId = localStorage.getItem("currentClub");
			
			//Create the shot object
			var shot = {'club': clubId, 'start': savedPos, 'end': savedEnd, 'distance': d};
			//create a unique ID for the object.
			var newDate = new Date();
			var itemId = newDate.getTime();
			
			try {
				localStorage.setItem("shot" + itemId, JSON.stringify(shot)); //saves to the database, "key", "value"
				document.getElementById("status").innerHTML= 'Shot saved! You shot ' + d + ' meters with your ' + clubId;
				
			} catch (e) {
			 	 if (e == QUOTA_EXCEEDED_ERR) {
			 	 	 alert('For some reason we couldnt save this shot');
				}
			}
			//delete the locally saved positions for shots.
			
			//Delete the position that had been saved.
			localStorage.removeItem("savedPos"); 
			localStorage.removeItem("savedEnd");
			stopWatch();
			
		}
		
		function stopWatch() {
		      // Cancel the updates when the user clicks a button.
		      navigator.geolocation.clearWatch(startpoint);
		    }
		
		function stopWatchEnd() {
		      // Cancel the updates when the user clicks a button.
		      navigator.geolocation.clearWatch(endpoint);
		    }

        function handle_errors(error)
        {
            switch(error.code)
            {
                case error.PERMISSION_DENIED: alert("user did not share geolocation data");
                break;

                case error.POSITION_UNAVAILABLE: alert("could not detect current position");
                break;

                case error.TIMEOUT: alert("retrieving position timed out");
                break;

                default: alert("unknown error");
                break;
            }
        }
	
		
		
		
		//torad function turns degrees into radians
		if (typeof(Number.prototype.toRad) === "undefined") {
		  Number.prototype.toRad = function() {
		    return this * Math.PI / 180;
		  }
		}
