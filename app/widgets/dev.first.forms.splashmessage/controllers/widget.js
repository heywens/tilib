/**
 * SplashMessage
 * RBA 2014-01-18
 * 
 */

	var fn = require('tilib/core/CUtils');
	
	
	//copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};
	
	//default property values
	var message = "Loading...";
	var lblColor = "#FFFFFF";
	
	var activityIndicatorStyle;
	
	if (fn.isIOS()) {
		activityIndicatorStyle = Titanium.UI.iPhone.ActivityIndicatorStyle;
	
	} else if (fn.isAndroid()) {
		activityIndicatorStyle = Titanium.UI.ActivityIndicatorStyle;
	}
	
	if (activityIndicatorStyle) {
		$.mSplash.style = activityIndicatorStyle.PLAIN;	
	}
	
	$.mType = "splashmessage";
	
	if (fn.isAndroid())
		$.winSplash.addEventListener('androidback', ignore);
		
	$.winSplash.addEventListener('open', setMessage);	

	
	//set widget property values based on args
	for (var key in _args) {
		if (_args.hasOwnProperty(key)) {
			switch(key) {
				//splash
				case "message":
					message = _args[key] || message;
					break;
					
				case "color":
					lblColor = _args[key] || lblColor;
					break;
					
				default:
					$.winSplash[key] = _args[key];
					break;					
			}
		}
	}
	
	//init
	$.lblMessage.color = lblColor;
	$.lblMessage.setText(message);
	
	function ignore() {
		//NOTHING TO DO
		//Let it be; wait for current process to end
	}
	
	
	function setMessage() {
		$.mSplash.show();
		$.lblMessage.setText(message);
	}

	$.show = function(msg) {
		message = msg;
		$.winSplash.setZIndex(5);
		$.winSplash.open();
	};
	
	$.hide = function() {
		$.winSplash.close();
	};

	$.getType = function() {
		return mType;
	};
