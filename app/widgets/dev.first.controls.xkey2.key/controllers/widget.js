/**
 * Key
 * IRRA 2014-02-07
 * RBA 2014-04-04	> added search bar
 * 
 */
	
	var fn = require('tilib/core/CUtils');
	var mSelectedItem = {};
	var winSearch = null;
	var hasLoaded = false;
	var willLoad = false;
	
	//copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};
	
	//default property values
	var top = -1;
	
	//set custom component type
	var mType = "key";

	//set widget property values based on args
	top = _args["top"] || top;
	
	var animateSelect = Ti.UI.createAnimation({
		curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration : 100,
		backgroundColor : "#D7DADB",
		autoreverse : true
	});
	
	var mFilter = {};
	
	$.formItemLabel.text = _args["label"] || "";	
	$.mView.top = top;
	
	
	//passed other config to view
	for (var key in _args) {
		if (_args.hasOwnProperty(key)) {
			$.mView[key] = _args[key];	
		}
	}
	
	resetImage();	
	setEnabled(true);
	
	
	
	// Private function
	function helpselect() {
		var cb = function() {
			if ($.helpSelect != null) {
				
				//Populate list on open?
				if (willLoad) $.helpSelect(mFilter, winSearch.populate);
				
				//Controller has been loaded?
				if (!hasLoaded) {
					winSearch.onSelectRecord(setValue);
					_args["keyNames"] = $.keyNames;
					_args["helpSelect"] = $.helpSelect;
					_args["mFilter"] = mFilter;
					winSearch.init(_args);
					
					hasLoaded = true;	//initialize once 
				}
			}
			
			if (winSearch != null) winSearch.open();
		};
		
		$.mView.animate(animateSelect , cb);
	}
	
	function reset() {
		$.ti.text = "";
		$.tiname.text = "";
		mSelectedItem = {};
		
		resetImage();
	}
	
	function resetValue() {
		var sKeys = $.keyNames.split(",");
		
		reset();
		
		mSelectedItem[sKeys[0]] = null;
		mSelectedItem[sKeys[1]] = null;
	}
	
	function setValue(selectedRow) {
		var sKeys = $.keyNames.split(",");
		
		mSelectedItem = selectedRow;
		$.ti.text = fn.gets(mSelectedItem[sKeys[0]]);
		
		var v = fn.gets(mSelectedItem[sKeys[1]]);
		$.tiname.text = fn.isEmpty(v) ? "" : v;
		
		resetImage();
	}
	
	function getValue() {
		var sKeys = $.keyNames.split(",");
		return mSelectedItem[sKeys[0]];
	}
	
	function gets(index) {
		var sKeys = $.keyNames.split(",");
		
		index = index || sKeys[0];
		if (mSelectedItem == null) return "";
		return mSelectedItem[index] || '';
	}
	
	function setVisible(b) {
		b = fn.getb(b);
		$.mView.visible = b;
		$.mView.height = b ? Ti.UI.SIZE : 0;
		$.mView.top = b ? (_args["top"] || -1) : 0;
		$.mView.bottom = b ? (_args["bottom"] || 0) : 0;
		
		if (b)
			$.mView.show();
		else
			$.mView.hide();	
	}
	
	function setEnabled(b) {
		if (fn.getb(b)) {
			$.vSelect.addEventListener('touchstart', helpselect);
			winSearch = Widget.createController('winSearch');
			
			//$.vReset.addEventListener('touchstart', resetValue);
			/**
			$.ti.addEventListener('touchstart', helpselect);
			$.tiname.addEventListener('touchstart', helpselect);
			*/
		} else {
			$.vSelect.removeEventListener('touchstart', helpselect);
			winSearch = null;
			
			//$.vReset.removeEventListener('touchstart', resetValue);
			/**
			$.ti.removeEventListener('touchstart', helpselect);
			$.tiname.removeEventListener('touchstart', helpselect);
			*/
		}
	}
	
	function resetImage() {
		/**
		var isVisible = (!fn.isEmpty($.ti.text) || !fn.isEmpty($.tiname.text));
		if (isVisible) 
			$.vReset.hide();
		else
			$.vReset.show();
			
		$.vReset.visible = isVisible;
		$.vReset.width = isVisible ? 30 : 0;
		*/
	}
	
	// Public functions
	//
	$.dataProvider = null;
	$.reset = reset;
	$.resetValue = resetValue;
	$.setValue = setValue;
	$.getValue = getValue;
	$.gets = gets;
	
	$.setVisible = setVisible;
	$.setEnabled = setEnabled;
	
	$.setHelpSelect = function(cb) {
		$.helpSelect = cb;
	};
	
	$.setKeys = function(keys) {
		$.keyNames = keys;
	};
	
	$.getType = function() {
		return mType;
	};
	
	$.loadOnInit = function(b) {
		willLoad = fn.getb(b);
	};

	$.setFilter = function(e) {
		mFilter = e;
	};
	
	exports.cleanUp = function() {
		$.vSelect.removeEventListener('touchstart', helpselect);
		
		fn.removeChildren($.mView);
		
		fn = null;
		mSelectedItem = null;
		winSearch = null;
		hasLoaded = null;
		willLoad = null;
		_args = null;
		top = null;
		mType = null;
		animateSelect = null;
	};
	