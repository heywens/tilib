/**
 * DateField
 * RBA 2014-01-15
 * 
 */

	var fn = require('tilib/core/CUtils');
	var dt = require('tilib/core/CDate');
	
	//copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};
	
	//default property values
	var top = -1;
	
	var currentDate = new Date();
	var mMinDate = "20000101";
	var mMaxDate = (currentDate.getFullYear() 
						+ fn.right("0" + String(currentDate.getMonth() + 1),2) 
						+ fn.right("0" + String(currentDate.getDate()), 2));
	
	var mType = "datefield";
	
	var ctrlPicker = null;
	var atop = fn.getStatusBarHeight();
	
	var minDate = new Date();
	var maxDate = new Date();
	

	//set widget property values based on args
	var formItemLabel = _args["label"];
	
	var labelWidth = _args["labelWidth"] || "40%";
	mMinDate = _args["minDate"] || mMinDate;
	mMaxDate = _args["maxDate"] || mMaxDate;
	top =  _args["top"] || top;
	
	//set widget property values based on args
	for (var key in _args) {
		if (_args.hasOwnProperty(key)) {
			$.mView[key] = _args[key];	
		}
	}
	
	
	//init
	$.lblDate.text = currentDate.getDate() + "-" + 
					dt.getMonthName(currentDate.getMonth() + 1) + "-" +
					currentDate.getFullYear();
	$.formItemLabel.text = formItemLabel;					
	$.formItemLabel.setWidth(labelWidth);
	$.mView.top = top;		
	
	
	// date picker config
	minDate.setFullYear(mMinDate.substr(0,4));
	minDate.setMonth(fn.getn(fn.mid(mMinDate,5,2)) - 1); 
	minDate.setDate(fn.getn(fn.right(mMinDate,2)));
	
	maxDate.setFullYear(fn.left(mMaxDate,4));
	maxDate.setMonth(fn.getn(fn.mid(mMaxDate,5,2)) - 1); 
	maxDate.setDate(fn.right(mMaxDate,2));

	
	setEnabled(true);	
	
	//
	// Functions
	//	
	function openPicker() {
		var winPicker = null;
		var cb = function() {
			if (ctrlPicker == null) {
				ctrlPicker = Widget.createController('winPicker');
				ctrlPicker.cbAccept = setDate;
				
				ctrlPicker.init({
					'title':formItemLabel, 
					'minDate':minDate, 
					'maxDate':maxDate});
					
			}
			
			winPicker = ctrlPicker.winPicker;
			if (!winPicker) return;
			if (fn.isMobileWeb()) winPicker.setZIndex(3);
			winPicker.open();
			
			ctrlPicker.setValue(getYMD());
			winPicker = null;
		};
		
		fn.selectTableRow($.mView, cb, "#D7DADB");
	}
	
	function setDate(v) { //format MM/DD/YYYY
		var day = fn.getn(fn.mid(v,4,2));
		day = day < 10 ? fn.right(day,1) : day;
		$.lblDate.text = day + "-" + dt.getMonthName(fn.left(v,2)) + "-" + fn.right(v,4);
	}
	
	function getValue() {
		return $.lblDate.text;
	}
	
	function getYMD() {
		var v = getValue();
		v = v.split("-"); // day-Month-year
		return v[2] + "" + fn.right("0" + String(dt.getMonthIndex(v[1]) + 1),2) + "" 
				+ fn.right("0" + String(v[0]),2);
	}
	
	function getMdyWithSlash() {
		var v = getValue();
		v = v.split("-"); // day-Month-year
		return fn.right("0" + String(dt.getMonthIndex(v[1]) + 1),2) 
				+ "/" + fn.right("0" + String(v[0]),2)
				+  "/" + v[2];
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
		if (fn.getb(b))
			$.touchpoint.addEventListener('touchstart', openPicker);
		else
			$.touchpoint.removeEventListener('touchstart', openPicker);	
	}
	
	
	//
	// set public methods here
	//
	$.setDate = setDate;
	$.getValue = getValue;
	$.getYMD = getYMD;
	$.getMdyWithSlash = getMdyWithSlash;
	$.setVisible = setVisible;
	$.setEnabled = setEnabled;
	
	$.getType = function() {
		return mType;
	};
	
	exports.cleanUp = function() {
		$.lblDate.removeEventListener('touchstart', openPicker);
		
		fn.removeChildren($.mView);
		
		fn = null;
		dt = null;
		_args = null;
		top = null;
		currentDate = null;
		mMinDate = null;
		mMaxDate = null;
		mType = null;
		ctrlPicker = null;
		atop = null;
		minDate = null;
		maxDate = null;
		formItemLabel = null;
		labelWidth = null;
	};
