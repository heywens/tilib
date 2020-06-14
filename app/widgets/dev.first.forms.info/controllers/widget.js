	var fn = require('tilib/core/CUtils');
	
	//copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};

	var mCallback = null;
	var cancelOpt = null;
	$.mType = "info";
	
	if (fn.isMobileWeb()) {
		//check if desktop browser or		
		if (fn.isMobileBrowser()) {
			$.mView.setWidth("80%");
		} else {
			
			//Let's set its minimum width
			var hWidth = fn.getDeviceWidth() * .4;
			if (hWidth <= 400)			
				$.mView.setWidth(400 * .95);
			else
				$.mView.setWidth("40%");
		}	
	}
	
	if (fn.isAndroid())
		$.winInfo.addEventListener('androidback', cancel);
	
	
	function init(param) {
		//$.title.text 	= param['title'] || "";
		$.msg.text 	= param['msg'] || "";
		
		var options = param['option'] || [];
		cancelOpt = param['cancel'] || "X";
		mCallback = param['cb'] || null;
		
		fn.removeAllChildren($.opt);
		setOptions(options);
		$.show();
	}
	
	function setOptions(opt) {
		var optInd = [];
		var optIndLabel = [];
		var optLen = opt.length;
		var widthLen = 99.5/optLen;
		
		for (var i = 0; i < optLen; i++) {
			
			optInd[i] = Ti.UI.createView({
				id : "opt" + i,
				backgroundColor : "#b30024",
				width : widthLen + '%',
				height : "100%"
			});
			
			optIndLabel[i] = Ti.UI.createLabel({
				id : "lbl" + i,
				text : opt[i],
				color : "#FFFFFF",
				textAlign : "center",
				top : 10,
				font: {
					fontSize : "18dp",
				}
			});
			
			optInd[i].addEventListener('touchstart', function(e) {
				optionClick(this.id.substring(3));
			});
			
			optInd[i].add(optIndLabel[i]);
			$.opt.add(optInd[i]);
			
			if (i != optLen - 1) {
				var separator = Ti.UI.createView({
					width : 0.5,
					backgroundColor : "#FFFFFF",
					height : "85%"
				});
				$.opt.add(separator);
			}
		}
		
	}
	
	function optionClick(optID) {		
		if (optID == cancelOpt) 
			$.hide();
		else {
			if (mCallback) mCallback(optID);
			$.hide();
		}
	}
	
	function cancel() {
		$.hide();
	}
	
	$.hide = function() {
		$.winInfo.close();
	};
	
	
	$.show = function() {		
		$.winInfo.setZIndex(3);
		$.winInfo.open();
	};
	

	$.getType = function() {
		return mType;
	};
	
	//
	//Public functions
	//
	$.init = init;