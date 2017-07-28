// create a blank namespace
var pastryApp = {};

pastryApp.clientId = 'WNANNEHBRREEDHVD4IVAOCHGT4SHT1Q4ZM0FWM3IQPEA2NNB';

pastryApp.clientSecret = '0QV0SFDCT3VULM5RBGCLQYRTLNC2PWG4TPUOR0WXQX3R5SPF';

pastryApp.init = function() {
	$('.search').on('submit', function (e) {
		e.preventDefault();
		pastryApp.place = $('.place').val();
		console.log('we should find treats in ' + pastryApp.place);
		pastryApp.getLocation(pastryApp.place);
		$('.place').val('');

		//clear out old locations
		$('.locationSuccess').html('');

		var divSuccess = $('<div>').addClass('locationSuccess');
		$('.setLocation').append(divSuccess);
		var locationSuccess = $('<p>').text('Looking for treats in ' + pastryApp.place + ', now...');
		divSuccess.append(locationSuccess);
	});

	$('a.doughnut').on('click', function(e) {
		e.preventDefault();
		var pastry = 'doughnut';
		console.log('we want ' + pastry);
		// pass the value of doughtnut to getBakery();
		pastryApp.getBakery(pastry);
	});

	$('a.cupcake').on('click', function(e) {
		e.preventDefault();
		var pastry = 'cupcake';
		console.log('we want ' + pastry);
		// pass the value of cupcake to getBakery();
		pastryApp.getBakery(pastry);
	});

	$('a.vegan').on('click', function(e) {
		e.preventDefault();
		var pastry = 'vegan bakery';
		console.log('we want ' + pastry);
		// pass the value of vegan bakery to getBakery();
		pastryApp.getBakery(pastry);
	});
} // end init

//=========
//ajax call
//=========

pastryApp.getLocation = function(place) {
	$.ajax({
		url : 'https://api.foursquare.com/v2/venues/explore?&v=20130815',
		type : 'GET',
		dataType : 'jsonp',
		data : {
			client_id : pastryApp.clientId,
			client_secret : pastryApp.clientSecret,
			format : 'jsonp',
			near : pastryApp.place
		},
		success : function (response) {
			console.log(response);
		}

	}) //end ajax
}

//=======================
//get & display functions
//=======================

pastryApp.getBakery = function(pastry, response) {
	$.ajax({
		url : 'https://api.foursquare.com/v2/venues/explore?&v=20130815',
		type : 'GET',
		dataType : 'jsonp',
		data : {
			client_id : pastryApp.clientId,
			client_secret : pastryApp.clientSecret,
			format : 'jsonp',
			near : pastryApp.place,
			venuePhotos : '1',
			query : pastry
		},
		success : function(result) {
			console.log(result);
			pastryApp.displayBakery(result);
		} // end success
	}); //end ajax
}; // end getBakery();

pastryApp.displayBakery = function(result) {
	//clear out old bakeries
	$('.bakeries').html('');
	
	var bakeries = result.response.groups[0].items;
	console.log(bakeries);
	
	//=========
	// for loop
	//=========
	for(var i = 0; i < bakeries.length; i++) {
		var div = $('<div>').addClass('bakery clearfix');
		var venues = bakeries[i].venue;
		
		// get bakery information
		var h2 = $('<h2>').text(venues.name);
		var locations = $('<p>').addClass('address').html('<i class="fa fa-home"></i>' + venues.location.address + ', ' + venues.location.city);
		
		// open links in new tab
		$('a.target-blank').attr('target','_blank');
		
		// selecting the photo
		var photoPrefix = venues.photos.groups[0].items[0];
		var photo = $('<img>').attr('src',photoPrefix.prefix + photoPrefix.height + photoPrefix.suffix);

		// linking to the Foursquare Page
		var addrPrefix = "https://foursquare.com/v/" + venues.id;
		var addr = $('<a>').addClass('foursquareAddr target-blank').attr('href', addrPrefix).html('<i class="fa fa-foursquare"></i> Find us on Foursquare!');
		
		div.append(h2,photo,location,addr)

		//======================
		// results if statements
		//======================

		// if the result has a phone number, do this
		if (pastryApp.hasPhone(venues.contact.formattedPhone)) {
			var contactPhone = $('<p>').addClass('contactPhone').html('<i class="fa fa-phone"></i>' + venues.contact.formattedPhone);
			div.append(h2,photo,locations,contactPhone,addr)
		} else {
			div.append(h2,photo,locations,addr)
		}

		// if the result has a twitter handle, create the contactTwitter variable and append to the html with everything
		var twitterPrefix = 'https://twitter.com/';
		if (pastryApp.hasTwitter(venues.contact.twitter)) {
			var contactTwitter = $('<a>').addClass('contactTwitter target-blank').attr('href', twitterPrefix + venues.contact.twitter).html('<i class="fa fa-twitter"></i>' + '@' + venues.contact.twitter);
			div.append(contactTwitter,addr);
		// if it does not have a twitter handle, do not create the variable, and append the rest without the twitter variable!	
		} else {
			// div.append(h2,photo,locations,addr);
		};

		// if the result has a website, do this, if not, do that
		if (pastryApp.hasWebsite(venues.url)) {
			var url = venues.url;
			var newUrl = venues.url.replace(/https?:\/\//, '');
			console.log(newUrl);

			if(venues.url.match(/https?:\/\//)) {
				console.log('matches')
				} else {
					console.log('doesnt match')
				}
			
			var website = $('<a>').addClass('websiteURL target-blank').attr('href',venues.url).html('<i class="fa fa-globe"></i>' + newUrl);
			div.append(website,addr)
		}	
		
		
		// adding the div to the html
		$('.bakeries').append(div);
	} // end for loop
} // end displayBakery

//==============
//has statements
//==============

pastryApp.hasPhone = function(phoneProperty) {
	if(!phoneProperty) {
		return false;
	} else {
		return true
	}
}

pastryApp.hasWebsite = function(websiteProperty) {
	if(!websiteProperty) {
		return false;
	} else {
		return true
	}
};

pastryApp.hasTwitter = function(twitterProperty){
	if (!twitterProperty) {
		return false;
	} else {
       return true
    }
}

//==============
//document ready
//==============

$(function() {
	pastryApp.init();
});