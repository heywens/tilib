/**
 * ComboBox
 * RBA 2014-01-14
 * 
 */
	
	var fn = require('tilib/core/CUtils');
	var mType = "labellink";
	$.cbLink = null;
	
	//copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};
	
	//set widget property values based on args
	var formItemLabel = _args["label"];
	var labelColor = _args["labelColor"] || "#4D4D4D";
	var top =  _args["top"] || 0;
	
	
	//set widget property values based on args
	for (var key in _args) {
		if (_args.hasOwnProperty(key)) {
			$.mView[key] = _args[key];
		}
	}
	
	
	//init
	$.lblValue.text = _args["text"] || "";
	$.lblValue.setColor(labelColor);
	$.formItemLabel.text = formItemLabel;					
	$.mView.top = top;		
	
		
	setEnabled(true);
	
	
		
	//
	// Functions
	//
	function openWin () {
		if ($.cbLink != null && $.cbLink instanceof Function) {
			if (! fn.isEmpty($.lblValue.text)) {
				$.cbLink();				
			} 
		}
	} 
	
	function setText(text) {
		$.lblValue.setText(text);
		$.vSelect.visible = !fn.isEmpty(text); 	
	}
	
	function setFormItemLabel(text) {
		$.formItemLabel.setText(text);
	}
	
	function getText() {
		return $.lblValue.getText();
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
			$.vSelect.addEventListener('touchstart', openWin);
		} else {
			$.vSelect.removeEventListener('touchstart', openWin);
		}
	}
	
	function getVisible() {
		return $.mView.visible;
	}
	
	function addEventListener(eventType, cb) {
		$.lblValue.addEventListener(eventType, cb);
	}
	
	function removeEventListener(eventType, cb) {
		$.lblValue.removeEventListener(eventType, cb);
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
	
	exports.cleanUp = function() {
		$.vSelect.removeEventListener('touchstart', openWin);
		
		fn.removeChildren($.mView);
		
		fn = null;
		mType = null;
		$.cbLink = null;
		_args = null;		
		formItemLabel = null;
		labelColor = null;
		top = null;
	};
	