(function(){
	'use strict';

	angular.module('fsCordova', [])
	    .service('CordovaService', ['$document', '$q',
	        function($document, $q) {
	            var d = $q.defer(),
	                resolved = false;
	            var self = this;
	            this.ready = d.promise;
	            document.addEventListener('deviceready', function() {
	                resolved = true;
	                d.resolve(window.cordova);
	            });

	            // Check to make sure we didn't miss the
	            // event (just in case)
	            setTimeout(function() {
	                if (!resolved) {
	                    if (window.cordova) d.resolve(window.cordova);
	                }
	            }, 3000);
	        }]);

	var app = angular.module('myApp', ['onsen.directives', 'google-maps', 'fsCordova']);

	app.factory('Deals', function($http) {
		var dealId;
	    var Deals = {
	        endpoint: 'http://padma-convenios.herokuapp.com/api',

	        setDealId: function(id) {
	        	dealId = id;
	        },

	        getDealId: function() {
	        	return dealId;
	        },

	        getDeals: function() {
	            return this.makeCall(this.endpoint + '/deals.json?callback=JSON_CALLBACK');
	        },
	        
	        getDeal: function(id) {
	            return this.makeCall(this.endpoint + '/deals/'+id+'.json?callback=JSON_CALLBACK');
	        },

	        makeCall: function(url){
	            return $http.jsonp(url).then(function(response){
	                return response.data;
	            });            
	        }
	    };
	    return Deals;
	});
	
	app.controller("mapController", function($scope, $location, Deals, CordovaService) {
	    $scope.map = {
		    center: {
		        latitude: 0,
		        longitude: 0
		    },
		    zoom: 10
		};

		CordovaService.ready.then(function() {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        });

		// Center map using geolocation
		var onSuccess = function(position) {
		    $scope.map.center = {
		        latitude: position.coords.latitude,
		        longitude: position.coords.longitude
		    };
		    $scope.$apply();
		}
		var onError = function(error) {
		    console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
		}
		
		//DO THIS IF NOT MOBILE navigator.geolocation.getCurrentPosition(onSuccess, onError);

		// Open marker page on click
		$scope.markersEvents = {
		    click: function (gMarker, eventName, model) {
		      var element = document.querySelector( ".navigator-container");
        	  var scope = angular.element( element ).scope();
        	  // Store the model id on the service for use on the markerController
        	  Deals.setDealId(model.id);
		      scope.pushPage('marker.html');
		    }
		};

		$scope.getDeals = function() {
			Deals.getDeals().then(function(data) {
				$scope.markers = data;
			});
		};


		// call service
		$scope.getDeals();
	});

	app.controller("markerController", function($scope, $location, Deals) {
	    
		$scope.getDeal = function() {
			// Use the id stored on the service (on the marker click event) to load the full data for the Deal.
			Deals.getDeal(Deals.getDealId()).then(function(data) {
				$scope.deal = data;
			});
		};


		// call service
		$scope.getDeal();
	});
})();
