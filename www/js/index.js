/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
		app.getGeoLoc();
		navigator.vibrate(3000);
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('Received Device Ready Event');
        console.log('calling setup push');
        app.setupPush();
		//app.getGeoLoc();
    },
    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "XXXXXXXX"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        console.log('after init');

        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }

            var parentElement = document.getElementById('registration');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Yo Man!'                  // buttonName
            );
       });
    },
	getGeoLoc: function() {
		// onSuccess Callback
		// This method accepts a Position object, which contains the
		// current GPS coordinates
		//
		var onSuccess = function(position) {
			callAPI(position.coords.latitude, position.coords.longitude)
			/*alert('Latitude: '          + position.coords.latitude          + '\n' +
				  'Longitude: '         + position.coords.longitude         + '\n' +
				  'Altitude: '          + position.coords.altitude          + '\n' +
				  'Accuracy: '          + position.coords.accuracy          + '\n' +
				  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
				  'Heading: '           + position.coords.heading           + '\n' +
				  'Speed: '             + position.coords.speed             + '\n' +
				  'Timestamp: '         + position.timestamp                + '\n');*/
		};

		// onError Callback receives a PositionError object
		//
		function onError(error) {
			//alert('codesss: '    + error.code    + '\n' +
				  //'message: ' + error.message + '\n');
		}
		
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}
}
	
	function processData(data){
		data = JSON.parse(data).events;
		var markUp = '';
		
		//EventName":"Drag Race Happening","distance":"2.9285510017403205","sentiment":"77.99999999999989","count":"306"
		
		for (var i=0;i<data.length; i++){
			markUp += '<div class="event-holder">';
			
			markUp += '<div class="event-image">';
			markUp += '<img src="'+ data[i].image +'"/>';
			markUp += '</div>';
			
			markUp += '<div class="event-name">';
			markUp += '<span>'+ data[i].EventName +'</span>';
			markUp += '</div>';
			
			markUp += '<div class="event-distance overflow">';
			markUp += '<span class="first-span">Distance</span>';
			markUp += '<span class="second-span">'+ data[i].distance +'</span>';
			markUp += '</div>';
			
			markUp += '<div class="event-sentiment overflow">';
			markUp += '<span class="first-span">Sentiment</span>';
			markUp += '<span class="second-span">'+ data[i].sentiment +'</span>';
			markUp += '</div>';
			
			markUp += '<div class="event-count overflow">';
			markUp += '<span class="first-span">Count</span>';
			markUp += '<span class="second-span">'+ data[i].count +'</span>';
			markUp += '</div>';
			
			markUp += '</div>';
			
		}
		
		document.querySelector('.event-main').innerHTML = markUp;
	}
	
	function callAPI(lat, lon) {
		
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			   // Typical action to be performed when the document is ready:
			   processData(xhttp.responseText);
			}
		};
		xhttp.open("GET", "http://10.240.187.212:3000/events?radius=2000&lon="+lon+"&lat="+lat, true);
		xhttp.send();

};
