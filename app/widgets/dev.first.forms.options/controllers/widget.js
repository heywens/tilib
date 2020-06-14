	var fn = require('tilib/core/CUtils');
	
	//copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};
	
	var mCallback = null;
	var cancelOpt = null;
	var atop = 0;
	var mDialog = null;
	
	$.mType = "options";
	
	function init(param) {
		var title = param['title'] || "";
		var options = param['option'] || [];
		cancelOpt = param['cancel'] || "X";
		mCallback = param['cb'] || null;
		
		if (fn.isAndroid() || fn.isMobileWeb()) {
			
			$.title.text = title;
			$.title.visible = fn.gets(title) != "";
			$.title.height = fn.gets(title) != "" ? 30 : 0;
			
			atop += fn.gets(title) != "" ? 30 : 0;
			setOptions(options);
			
		} else {
			
			if (mDialog == null) { 
				var o = [];
				var len = options.length;
				for (var i = 0; i < len; i++) {
					if (fn.gets(options[i]["title"]) != "")
						o.push(fn.gets(options[i]["title"]));
				}
				
				var opts = {
				  cancel: cancelOpt,
				  options: o,
				  title: title
				};
				
				mDialog = Ti.UI.createOptionDialog(opts);
				mDialog.addEventListener('click', function(e) {
					if (mCallback != null) 
						mCallback(fn.gets(e.index));
				});
			}
		}
	}
	
	function setOptions(opt) {
		var optInd = [];
		var optIndLabel = [];
		var optIndLabelv = [];
		var optIndLeftImage = [];
		var optIndLeftImagev = [];
		var len = opt.length;
		
		for (var i = 0; i < len; i++) {
			var withImage = fn.gets(opt[i]['leftIco']) != "";
			var withTitle = fn.gets(opt[i]['title']) != "";
			
			optInd[i] = Ti.UI.createView({
				id : "opt" + i,
				backgroundColor : "#2B3F4E",
				width : "95%",
				height : 50,
				layout : "horizontal"
			});
			
			atop += 50;
			
			//add image to options
			if (withImage) {
				optIndLeftImagev[i] = Ti.UI.createView({
					id : "imv" + i,
					height : 50,
					width : withTitle? "25%" : "100%",
				});
				
				optIndLeftImage[i] = Ti.UI.createLabel({
					id : "img" + i,
					text : opt[i]['leftIco'],
					width : 35,
					height : 31,
					color : "#fff",
					
					font : {
						fontFamily : "HqTi",
						fontSize : "30dp"
					}
				});
				
				optIndLeftImagev[i].add(optIndLeftImage[i]);
				optInd[i].add(optIndLeftImagev[i]);
			}
			
			//add text to tabs
			if (withTitle) {
				
				optIndLabelv[i] = Ti.UI.createView({
					id : "tiv" + i,
					height : 50,
					width : withImage? "70%" : "100%",
				});
			
			
				optIndLabel[i] = Ti.UI.createLabel({
					id : "tit" + i,
					text : opt[i]['title'],
					color : "#FFFFFF"
				});
				
				if (withImage) optIndLabel[i].left = "0";
				
				optIndLabelv[i].add(optIndLabel[i]);
				optInd[i].add(optIndLabelv[i]);
			}
			
			optInd[i].addEventListener('touchstart', function(e) {
				clickOption(this.id.substring(3));
			});
			
			$.opt.add(optInd[i]);
			
			if (i < opt.length - 1) {
				var spacer = Ti.UI.createView({
					backgroundColor : "#ffffff",
					width : "98%",
					height : 1,
					layout : "horizontal"
				});
				$.opt.add(spacer);
			}
		}
	}
	

	function clickOption(optID) {		
		if (optID == cancelOpt) 
			$.hide();
		else { 
			if (mCallback) mCallback(optID);
			$.hide();
		}
	}


	$.show = function() {
		if (fn.isIOS()) {
			mDialog.show();
			return;
		}
		
		$.winOptions.setZIndex(3);
		$.winOptions.open();
	};
	
	$.hide = function() {
		$.winOptions.close();
	};

	$.getType = function() {
		return mType;
	};
	
	//
	//Public functions
	//
	exports.init = init;