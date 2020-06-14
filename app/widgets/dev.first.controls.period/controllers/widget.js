/**
 * Period
 * RBA 2014-01-15
 * 
 */

//TODO
/**
 * Future plan
 * 
 * Allow empty date for search
 * idea: add clear button somewhere to remove clear date (blank)
 */

	var fn = require('tilib/core/CUtils');
	
	//copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};
	
	var top =  _args["top"] || 0;
	var mStart = _args["start"];
	var mEnd = _args["end"];
	var label = _args[key] || "Period";
	
	var mType = "period";
	
	
	//set widget property values based on args
	for (var key in _args) {
		if (_args.hasOwnProperty(key)) {
			$.mView[key] = _args[key];	
		}
	}
	
	
	//init
	$.mView.top = top;
	$.formItemLabel.text = label;
	
	
	//
	// Functions
	//
	function getStartDate() {
		return $.fperiod_fsdate.getMdyWithSlash();
	}
	
	function getEndDate() {
		return $.fperiod_fedate.getMdyWithSlash();
	}
	
	function setStartDate(v) {
		$.fperiod_fsdate.setDate(v);
	}
	
	function setEndDate(v) {
		$.fperiod_fedate.setDate(v);
	}
	
	function validate() {
		var fsdate = $.fperiod_fsdate.getYMD();
		var fedate = $.fperiod_fedate.getYMD();
		
		
		if ($.fperiod_fsdate.getValue() != "" && $.fperiod_fedate.getValue() != ""
				&& fn.getn(fsdate) > fn.getn(fedate)) {
			fn.illegal("Please enter a valid period for " + label);
			return false;
		}
		return true;
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
		b = fn.getb(b);
		$.fperiod_fsdate.setEnabled(b);
		$.fperiod_fedate.setEnabled(b);
	}
	
	function setEnabledStart(b) {
		$.fperiod_fsdate.setEnabled(b);
	}
	
	function setEnabledEnd(b) {
		$.fperiod_fedate.setEnabled(b);
	}
	
	
	//
	// public functions
	//
	$.getStartDate = getStartDate;
	$.getEndDate = getEndDate;
	$.setStartDate  = setStartDate;
	$.setEndDate = setEndDate;
	$.validate = validate;
	$.setVisible = setVisible;
	$.setEnabled = setEnabled;
	$.setEnabledStart = setEnabledStart;
	$.setEnabledEnd = setEnabledEnd;
	
	$.getType = function() {
		return mType;
	};
	
	exports.cleanUp = function() {
		
	};
