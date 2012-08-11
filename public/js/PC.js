var PC = {};

PC.core = (function(core, $, undefined){
	
	var section,
	step
	;
	
	
	var wizardManager = function(){
	
	
	/*
	
	$.ajax({
            type:       'GET',
            url:        '/api/pubs/near/151.203359/-33.858166/', //Test - get pubs near Lord Nelson
            //url:        '/api/pubs/near/151.187148/-33.879697/',   //Test - get pubs near Ancient Briton
            dataType:   'json',
            async:      false,
            data:       {},
            success:
                function(data) {

                    temp_pubs = data;

                    pubs = {};
                    pubs.length = 0;

                    for (var i = 0; i < temp_pubs.length; i++) {
                        temp_pubs[i].latlng = new google.maps.LatLng(temp_pubs[i].location.lat,temp_pubs[i].location.lon);
                        temp_pubs[i].id = temp_pubs[i]._id;

                        pubs.length++;

                        pubs[(temp_pubs[i]).id] = temp_pubs[i];
                    }
                }
        })
		
		*/
	
		//	Main object storing the pubs
		var pubCrawl = [],
		// Pub data retrieved from the system via AJAX
		pubs = [
			{
				id: 0,
				name : 'The Australian Heritage Hotel',
				address : '100 Cumberland Street, The Rocks NSW, Australia',
				latlng : new google.maps.LatLng(-33.859583,151.207038),
				comments: 'Este bar es una mierda, pero me dejan beber hasta que pierdo el sentido de la verticalidad'
			},
			{
				id: 1,
				name : 'The Glenmore Hotel',
				address : '96 Cumberland Street, The Rocks NSW, Australia',
				latlng : new google.maps.LatLng(-33.858778,151.207294),
				comments: 'Este bar es una mierda, pero me dejan beber hasta que pierdo el sentido de la verticalidad'
			},
			{
				id: 2,
				name : 'Lowenbrau Keller',
				address : '18 Argyle Street, The Rocks NSW, Australia',
				latlng : new google.maps.LatLng(-33.859079,151.207838),
				comments: 'Este bar es una mierda, pero me dejan beber hasta que pierdo el sentido de la verticalidad'
			},
			{
				id: 3,
				name : 'Fortune of War',
				address : '137 George Street, The Rocks NSW, Australia',
				latlng : new google.maps.LatLng(-33.859079,151.207838),
				comments: 'Este bar es una mierda, pero me dejan beber hasta que pierdo el sentido de la verticalidad'
			},
			{
				id: 4,
				name : 'Lord Nelson',
				address : '19 Kent Street, The Rocks NSW, Australia',
				latlng : new google.maps.LatLng(-33.859079,151.207838),
				comments: 'Este bar es una mierda, pero me dejan beber hasta que pierdo el sentido de la verticalidad'
			},
			{
				id: 5,
				name : 'Observer',
				address : '69 George Street, The Rocks NSW, Australia',
				latlng : new google.maps.LatLng(-33.859079,151.207838),
				comments: 'Este bar es una mierda, pero me dejan beber hasta que pierdo el sentido de la verticalidad'
			},
			{
				id: 6,
				name : 'Orient',
				address : '89 George Street, The Rocks NSW, Australia',
				latlng : new google.maps.LatLng(-33.859079,151.207838),
				comments: 'Este bar es una mierda, pero me dejan beber hasta que pierdo el sentido de la verticalidad'
			},
			{
				id: 7,
				name : 'Palisade',
				address : '35 Bettington Street, The Rocks NSW, Australia',
				latlng : new google.maps.LatLng(-33.859079,151.207838),
				comments: 'Este bar es una mierda, pero me dejan beber hasta que pierdo el sentido de la verticalidad'
			}
			
		];
		
		mediator.on('mapInitialised', function(){
			 PC.wizard.init();
		});
		
		// Pub added to the Pub Crawl
		mediator.on('addPub', function(data){
			var id = data[0],
			newPub = true;
			if(pubs[id]){
				for(var i=0, l = pubCrawl.length; i<l; i++){
					if(pubCrawl[i].id === id) newPub = false;  
				}
				if (newPub) pubCrawl.push(pubs[id]);
			}
			PC.mapManager.manageMarkers({control: 'select', id: id});
			PC.mapManager.route({pubCrawl:pubCrawl, travelMode : 'WALKING'});
			PC.wizard.updateTimeline(pubCrawl);
		});
		
		// Pub deleted from the Pub Crawl
		mediator.on('deletePub', function(data){
			for(var i=0, l = pubCrawl.length; i<l; i++){
				if(pubCrawl[i].id === data[0]) pubCrawl.splice(i,1) 
			}
			PC.mapManager.manageMarkers({control: 'remove', id: data[0]})
			PC.mapManager.route({pubCrawl:pubCrawl, travelMode : 'WALKING'});
			PC.wizard.updateTimeline(pubCrawl);
		});
		
		// Pub modified from the Pub Crawl
		mediator.on('modifyPubCrawl', function(data){
			pubCrawl = [];
			var list = data[0];
			for(var i=0, l=list.length; i<l; i++){ 
				pubCrawl.push(pubs[list[i]]);
			}
			PC.mapManager.route({pubCrawl:pubCrawl, travelMode : 'WALKING'});
			PC.wizard.updateTimeline(pubCrawl);
		});
		
		// Pub details displayed
		mediator.on('displayPubDetails', function(data){
			var id = data[0];
			PC.wizard.displayPubDetails(pubs[id]);
		});
		
		// MAP OPTIONS
		if(PC.mapManager){
			var map = {
				element : $('#mapContainer')[0],
				options : {
					center: new google.maps.LatLng(-33.859635,151.208701),
					zoom: 17,
					panControl: false,
					streetViewControl: false,
					zoomControl: true,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.SMALL
					},
					mapTypeControl: true,
					mapTypeControlOptions: {
						position: google.maps.ControlPosition.TOP_LEFT
					},
					mapTypeId: google.maps.MapTypeId.ROADMAP
				}
			},
			directions = {
				options : {
					draggable : true,
					suppressMarkers : true,
					preserveViewport : true
				}
			}
			
			PC.mapManager.init({mode:'wizard',map : map, directions : directions, pubs : pubs});
		}
	};
	
	var init = function(){
		var mapping = {
			wizard : wizardManager
		};
	
		$(document).ready(function(){
			section = $('body').data('section');
			step = $('body').data('step');
			
			mapping[section]();
			
		});
	}();
	
	return core;

})(PC.core || {}, jQuery);

PC.mapManager = (function(mapManager, $, undefined){

	var map,
	directionsDisplay,
	directionsService,
	geocoder,
	polyline,
	// Array of markers placed in the map
	markers = []
	;
	
	var loadBars = function(pubs){
		var getLocationFromAddress = function(i){
			geocoder.geocode( { 'address': pubs[i].address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					 pubs[i].latlng = results[0].geometry.location; 
					 var marker = new google.maps.Marker({
						position: pubs[i].latlng,
						map: map,
						icon : 'resources/images/pub_marker_unselected.png'
					});
					marker.set('id', pubs[i].id);	// marker gets the id of the pub
					markers[pubs[i].id] = marker;	// gets indexed in the its id
					// Display details
					google.maps.event.addListener(marker,'click', function() {
						if (mediator) mediator.publish('displayPubDetails',this.get('id'));
						else console.log('mediator is missing');
					});
					// Gets added
					google.maps.event.addListener(marker,'dblclick', function() {
						if (mediator) mediator.publish('addPub',this.get('id'));
						else console.log('mediator is missing');
					});
					google.maps.event.addListener(marker, 'mouseover', function() {
						this.setIcon('resources/images/pub_marker_unselected_highlight.png');
					});
					google.maps.event.addListener(marker, 'mouseout', function() {
						this.setIcon('resources/images/pub_marker_unselected.png');
					});			
				} else {
					console.log("Geocode was not successful for the following reason: " + status);
				}
			});
		};
		for (var i=0, l = pubs.length; i<l; i++){
			getLocationFromAddress(i);	
		}
	};
	
	mapManager.manageMarkers = function(config){
	
		var baseImageUrl = 'resources/images/pub_marker_',
		marker = markers[config.id];
		
		if(config.control === 'select') baseImageUrl += 'selected';
		else  baseImageUrl += 'unselected';
		
		marker.setIcon(baseImageUrl+'.png');
		
		google.maps.event.addListener(marker, 'mouseover', function() {
			this.setIcon(baseImageUrl+'_highlight.png');
		});
		google.maps.event.addListener(marker, 'mouseout', function() {
			this.setIcon(baseImageUrl+'.png');
		});	
	};
	
	mapManager.init = function(config){
		map = new google.maps.Map(config.map.element, config.map.options);
		directionsDisplay = new google.maps.DirectionsRenderer(config.directions.options);
		directionsService = new google.maps.DirectionsService();
		directionsDisplay.setMap(map);
		geocoder = new google.maps.Geocoder();
		
	/*	var $wizardSearchBar = $('<div id="wizardSearch"><input type="text" value="Search" name="wizardSearchBar" id="wizardSearchBar"/></div>');
		map.controls[google.maps.ControlPosition.TOP_LEFT].push($wizardSearchBar[0]);*/

		if (config.pubs.length > 0){
			loadBars(config.pubs)
		} else console.log('Pubs object is empty');
		
		google.maps.event.addListener(map, 'click', function(e) {
			// Handle adding a new venue
		});
		
		/*
			Handle click in path
			Handle drag in path
		*/
		
		if (mediator){ mediator.publish('mapInitialised');}
		else console.log('mediator is missing');
	};
	
	mapManager.staticMapURL = function(config){
	
		var url = 'http://maps.googleapis.com/maps/api/staticmap?',
		center = 'center='+map.center,
		zoom = '&zoom'+config.zoom,
		size = '&size='+config.size,
		scale = '&scale='+config.scale,
		maptype = '&maptype='+config.maptype,
		markers = '&markers=icon:resources/images/pub_marker_unselected.png%7',
		path = '&path=enc:'+polyline,
		sensor = '&sensor='+config.sensor
		;
		
		for (var i=0, l = config.pubCrawl.lenght; i<l; i++){
			markers += config.pubCrawl[i].latlng + '%7';
		}
		
		return url+center+zoom+size+scale+maptype+markers+path+sensor;
	};
	
	mapManager.route = function(config){
		
		var request = {
			travelMode :  google.maps.TravelMode[config.travelMode]
		};
		
		if(config.pubCrawl.length > 1){ 
			request.origin = config.pubCrawl[0].address;
			request.destination = config.pubCrawl[config.pubCrawl.length-1].address;
			request.waypoints = [];
			for (var i=1, l = config.pubCrawl.length-1; i<l; i++) { 
				request.waypoints.push({
					location: config.pubCrawl[i].address,
					stopover: true
				});
			}
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					polyline = response.routes[0].overview_polyline.points;
					directionsDisplay.setMap(map);	
					directionsDisplay.setDirections(response);
				  // Handle distances
				}
			});
		} else {
			directionsDisplay.setMap(null);		
		}
		
	};
	
	return mapManager;

})(PC.mapManager || {}, jQuery);


PC.wizard = (function(wizard, $, undefined){
	
	var $timeline,
	$sidePanel
	;
	
	var controlSidePanel = function(control){
		var mode = {
			toggle : function(){
				if($sidePanel.is(':visible'))  $sidePanel.hide("blind", { direction: "right" });
				else $sidePanel.show("blind", { direction: "left" });
			},
			open : function(){
				if(!$sidePanel.is(':visible'))  $sidePanel.show("blind", { direction: "right" });
			},
			close : function(){
				if($sidePanel.is(':visible'))  $sidePanel.hide("blind", { direction: "right" });
			},
		};
		mode[control]();
	};
	
	wizard.init = function(){
		$timeline = $('#timeline');
		$sidePanel = $('#sidePanel');
		var $timeList = $timeline.find('ul');
		$timeList.sortable();
		
		// Close panel
		$('a.closePanel').click(function(e){
			e.preventDefault();
			$sidePanel.data('id','');
			controlSidePanel('close');
		});
		
		//Add a pub from the panel
		$('a.addPub').click(function(e){
			e.preventDefault()
			var pubId = $sidePanel.data('id');
			if (mediator) mediator.publish('addPub',pubId);
			else console.log('mediator is missing');
		});
		
		// Remove a pub
		$(document).on("click","a.deletePub", function(e){
			e.preventDefault(); 
			if (mediator) mediator.publish('deletePub',$(this).parent().data('id'));
			else console.log('mediator is missing');
		});
		
		// Display pub details
		$(document).on("click","span.pubName", function(e){
			e.preventDefault();
			if (mediator) mediator.publish('displayPubDetails',$(this).parent().data('id'));
			else console.log('mediator is missing');
		});
		
		// Modify Pub Crawl arrangement
		$timeList.on('sortstop', function(e){
			var idList = [];
			$(this).find('li').each(function(i,el){
				idList.push($(el).data('id'));
			});
			if (mediator){ mediator.publish('modifyPubCrawl', idList);}
			else console.log('mediator is missing');
		});
		
		if (mediator){ mediator.publish('wizardInitialised');}
		else console.log('mediator is missing');
	};
	
	wizard.displayPubDetails = function(pub){
		$sidePanel.find('#pubName').text(pub.name).end().find('#pubAddress').text(pub.address).end().find('#comments').text(pub.comments);
		$sidePanel.data('id',pub.id);
		controlSidePanel('open');
	};
	
	wizard.updateTimeline = function(pubCrawl){
		var	$target = $timeline.find('ul').html(''),
		$item = $('<li><a href="" class="deletePub"></a><span class="pubName"></span></li>'),
		aux
		;
		for(var i=0, l=pubCrawl.length; i<l; i++){ 
			aux = $item.clone();
			aux.data('id',pubCrawl[i].id).find('.pubName').text(pubCrawl[i].name);
			$target.append(aux);
		}
	};

	return wizard;

})(PC.wizard || {}, jQuery);