/**
 * Label
 * RBA 2014-01-15
 * 
 */

	var fn = require('tilib/core/CUtils');
	$.cbLink = null;
	
	//copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};
	
	//default property values
	var top = 0;
	
	var mType = "label";
	

	//set widget property values based on args
	var formItemLabel = _args["label"];
	var labelColor = _args["labelColor"] || "#4D4D4D";
	
	top =  _args["top"] || top;
	
	
	//set widget property values based on args
	for (var key in _args) {
		if (_args.hasOwnProperty(key)) {
			$.mView[key] = _args[key];
		}
	}
	
	
	//init
	$.lbl.text = _args["text"] || "";
	$.formItemLabel.text = formItemLabel;					
	$.mView.top = top;		
	$.lbl.setColor(labelColor);
	
		
	setEnabled(true);
	
	
	//
	// functions
	//	
	function openWin () {
		if ($.cbLink != null && $.cbLink instanceof Function) {
			if (! fn.isEmpty($.lbl.text)) {
				
			} 
			$.cbLink();			
		}
	} 
	
	function setText(text) {
		$.lbl.setText(text);
	}
	
	function setFormItemLabel(text) {
		$.formItemLabel.setText(text);
	}
	
	function getText() {
		return $.lbl.getText();
	}
	
	function setVisible(b) {
		b = fn.getb(b);
		$.mView.visible = b;
		$.mView.height = b ? Ti.UI.SIZE : 0;
		$.mView.top = b ? (_args["top"] || 0) : 0;
		$.mView.bottom = b ? (_args["bottom"] || 0) : 0;
		
		if (b)
			$.mView.show();
		else
			$.mView.hide();	
	}
	
	function setEnabled(b) {
		if (fn.getb(b)) {
			$.lbl.addEventListener('touchstart', openWin);
		} else {
			$.lbl.removeEventListener('touchstart', openWin);
		}
	}
	
	function getVisible() {
		return $.mView.visible;
	}
	
	function addEventListener(eventType, cb) {
		$.lbl.addEventListener(eventType, cb);
	}
	
	function removeEventListener(eventType, cb) {
		$.lbl.removeEventListener(eventType, cb);
	}
	
	
	//
	// set public methods here
	//
	$.setText = setText;
	$.getText = getText;
	$.setVisible = setVisible;
	$.setEnabled = setEnabled;
	$.addEventListener = addEventListener;
	$.removeEventListener = removeEventListener;
	$.setFormItemLabel = setFormItemLabel;
	
	$.getType = function() {
		return mType;
	};
	
	$.setBackgroundColor = function(color) {
		if (!fn.isEmpty(color))
			$.mView.backgroundColor = color;
	};
	
	exports.cleanUp = function() {
		$.lbl.removeEventListener('touchstart', openWin);
		
		fn.removeChildren($.mView);
		
		fn = null;
		$.cbLink = null;
		_args = null;
		top = null;
		mType = null;
		formItemLabel = null;
		labelColor = null;
	};	
