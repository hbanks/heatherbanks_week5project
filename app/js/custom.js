//==========
// NAMESPACE
//==========
var pastryApp = {};

//====
// API
//====
pastryApp.clientId = "WNANNEHBRREEDHVD4IVAOCHGT4SHT1Q4ZM0FWM3IQPEA2NNB";
pastryApp.clientSecret = "0QV0SFDCT3VULM5RBGCLQYRTLNC2PWG4TPUOR0WXQX3R5SPF";

//=========
// APP INIT
//=========
pastryApp.init = () => {	
	$(".search").on("submit", function (e) {
		e.preventDefault();
		pastryApp.place = $(".place").val();
		pastryApp.getLocation(pastryApp.place);
		$(".place").val("");
		$(".locationSuccess").html("");
		var divSuccess = $("<div>").addClass("locationSuccess");
		$(".setLocation").append(divSuccess);
		var locationSuccess = $("<p>").text("Looking for treats in " + pastryApp.place + ", now...");
		divSuccess.append(locationSuccess);
		console.log("we should find treats in " + pastryApp.place);
	});
	$("a.doughnut").on("click", function(e) {
		e.preventDefault();
		var pastry = "doughnut";
		pastryApp.getBakery(pastry);
		console.log("we want " + pastry);
	});
	$("a.cupcake").on("click", function(e) {
		e.preventDefault();
		var pastry = "cupcake";
		pastryApp.getBakery(pastry);
		console.log("we want " + pastry);
	});
	$("a.vegan").on("click", function(e) {
		e.preventDefault();
		var pastry = "vegan bakery";
		pastryApp.getBakery(pastry);
		console.log("we want " + pastry);
	});
};

//=====
// AJAX
//=====
pastryApp.getLocation = place => {
	$.ajax({
		url : "https://api.foursquare.com/v2/venues/explore?&v=20130815",
		type : "GET",
		dataType : "jsonp",
		data : {
			client_id : pastryApp.clientId,
			client_secret : pastryApp.clientSecret,
			format : "jsonp",
			near : pastryApp.place
		},
		success : function (response) {
			console.log(response);
		}
	});
};

//==========
// FUNCTIONS
//==========
pastryApp.getBakery = (pastry, response) => {
	$.ajax({
		url : "https://api.foursquare.com/v2/venues/explore?&v=20130815",
		type : "GET",
		dataType : "jsonp",
		data : {
			client_id : pastryApp.clientId,
			client_secret : pastryApp.clientSecret,
			format : "jsonp",
			near : pastryApp.place,
			venuePhotos : "1",
			query : pastry
		},
		success : function(result) {
			console.log(result);
			pastryApp.displayBakery(result);
		}
	});
};

pastryApp.displayBakery = result => {	
	$(".bakeries").html("");	
	var bakeries = result.response.groups[0].items;
	for(var i = 0; i < bakeries.length; i++) {
		var div = $("<div>").addClass("bakery clearfix");
		var venues = bakeries[i].venue;
		var h2 = $("<h2>").text(venues.name);
		var locations = $("<p>").addClass("address").html("<i class=\"fa fa-home\"></i>" + venues.location.address + ", " + venues.location.city);
		$("a.target-blank").attr("target","_blank");
		var photoPrefix = venues.photos.groups[0].items[0];
		var photo = $("<img>").attr("src",photoPrefix.prefix + photoPrefix.height + photoPrefix.suffix);
		var addrPrefix = "https://foursquare.com/v/" + venues.id;
		var addr = $("<a>").addClass("foursquareAddr target-blank").attr("href", addrPrefix).html("<i class=\"fa fa-foursquare\"></i> Find us on Foursquare!");
		div.append(h2,photo,location,addr);
		if (pastryApp.hasPhone(venues.contact.formattedPhone)) {
			var contactPhone = $("<p>").addClass("contactPhone").html("<i class=\"fa fa-phone\"></i>" + venues.contact.formattedPhone);
			div.append(h2,photo,locations,contactPhone,addr);
		} else {
			div.append(h2,photo,locations,addr);
		}
		var twitterPrefix = "https://twitter.com/";
		if (pastryApp.hasTwitter(venues.contact.twitter)) {
			var contactTwitter = $("<a>").addClass("contactTwitter target-blank").attr("href", twitterPrefix + venues.contact.twitter).html("<i class=\"fa fa-twitter\"></i>" + "@" + venues.contact.twitter);
			div.append(contactTwitter,addr);
		}
		if (pastryApp.hasWebsite(venues.url)) {
			var newUrl = venues.url.replace(/https?:\/\//, "");
			var website = $("<a>").addClass("websiteURL target-blank").attr("href",venues.url).html("<i class=\"fa fa-globe\"></i>" + newUrl);
			div.append(website,addr);
		}
		$(".bakeries").append(div);
	}
};

//===========
// CONDITIONS
//===========
pastryApp.hasPhone = phoneProperty => {
	if(!phoneProperty) {
		return false;
	} else {
		return true;
	}
};
pastryApp.hasWebsite = websiteProperty => {
	if(!websiteProperty) {
		return false;
	} else {
		return true;
	}
};
pastryApp.hasTwitter = twitterProperty => {
	if (!twitterProperty) {
		return false;
	} else {
		return true;
	}
};

//===============
// DOCUMENT READY
//===============
$(function() {
	pastryApp.init();
});