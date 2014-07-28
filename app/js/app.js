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
		
		alert("The map loaded without any Hiccups.");

	});
})();
