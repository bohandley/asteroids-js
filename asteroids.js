var dateForm = document.getElementById('date-form');

dateForm.addEventListener('submit', function(event){
	event.preventDefault();
	removeElementsByClass('asteroid');
	var date = dateForm.elements['date'].value;
	// Error handling for date
	var regex = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
	var click = document.getElementById('click');
	if ( date.match(regex) && date.substr(0,4) > 1950 ){
		click.textContent = 'Click on an asteroid to blow it up!';
	} else if ( date.substr(0,4) < 1951 ){
		click.textContent = 'Please enter a date later than 1951.';
	}
	else {
		click.textContent = 'Try entering a valid date: YYYY-MM-DD.';
	}
	//Get an API key from https://api.nasa.gov/index.html#apply-for-an-api-key
	var key = 'yAyH8cJEzor6tU5Kl6iLxnNnqLunMUq9jpy9rES4';
	
	//URL for NASA's API
	var url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=' + date + '&api_key=' + key;
	
	//Fetch call to get JSON data
	fetch(url).then(function(response) {
		return response.json();
	}).then(function(json) {
		//Access the asteroid data of the JSON
		var asteroids = json.near_earth_objects[date];
		//Iterate through the data 
		asteroids.map(function(element){
			//Access the distance, speed, size and hazard data for each asteroid
			var distance = element.close_approach_data[0].miss_distance.kilometers;
			var speed = element.close_approach_data[0].relative_velocity.kilometers_per_hour;
			var size = element.estimated_diameter.meters.estimated_diameter_max;
			var hazardous = element.is_potentially_hazardous_asteroid;
			//What does the data look like?
			console.log('Hazard: ' + hazardous + '\n' + 
									'Distance: ' + distance + ' km\n' +
									'Speed: ' + speed + ' km/h \n' +
									'Size: ' + size + ' m');
			//Place each asteroid on the page            
			placeAsteroid(hazardous, distance, speed, size);
		});
	});
});

// Remove elements by class name
function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

//This function creates each asteroid,
//sets the distance, speed, size and hazard,
//then appends each asteroid to the Solar System
function placeAsteroid(hazardous, distance, speed, size) {
	var asteroid = document.createElement('a');
	asteroid.textContent = '*';
	asteroid.className += 'asteroid';
  
	setSpeed(asteroid, speed);
	setSize(asteroid, size);
	setDistance(asteroid, distance);
	setHazard(asteroid, hazardous);
  
	var solarSystem = document.getElementById('solar-system');
	append(solarSystem, asteroid);
  
	destroyAsteroid(asteroid);
}

//This function sets the distance of
//the asteroid from Earth by changing the
//margin-left style of the asteroid node
function setDistance(asteroid, distance) {
	asteroid.style.marginLeft = distance/100000 + 'px';
	return asteroid;
}

//This function sets the size of the asteroid
//by adding a class that sets the 
//font-size style
function setSize(asteroid, size) {
	if (size>100) {
		size = size/10;
	}
	asteroid.style.fontSize = size + 'px';
	return asteroid;
}

//This function sets the speed of the asteroid
//by adding a class which adds text-shadow styles
function setSpeed(asteroid, speed) {
	if (speed > 50000) {
		asteroid.className += ' speed-high';
	} else if (speed > 25000) {
		asteroid.className += ' speed-medium';
	} else {
		asteroid.className += ' speed-low';
	}
	return asteroid;
}

//This function sets the color of the asteroid
//by adding a class to show if it is hazardous
function setHazard(asteroid, hazardous) {
	if (hazardous === true) {
		asteroid.className += ' hazardous';
	} 
	return asteroid;  
}

//This function appends the asteroid node to the Solar System node
function append(parent, el) {
	return parent.appendChild(el);
}

//This function add an listens for the click event
//and runs the boom function
function destroyAsteroid(asteroid) {
	asteroid.addEventListener('click', boom);
	return asteroid;
}

//this function replaces the text content in the asteroid node 
//with 'BOOM!!' on a click event
function boom() {
	this.textContent = 'BOOM!!';
	this.className += ' boom';
	return this;
} 
