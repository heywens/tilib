	//
	// Initialize libraries
	//
	var fn = require('tilib/core/CUtils');
	var ctrlWinTxtArea = null;
	
	//
	// Assign control type
	//
	var mType = "textarea";
	
	//
	// Assign arguments to local variables
	//
	var _args = arguments[0] || {},
		top = _args["top"] || -1,
		required = _args["required"] || false,
		upperCase = _args["upperCase"] || false,
		lowerCase = _args["lowerCase"] || false,
		numeric = _args["numeric"] || false,
		restrict = _args["restrict"] || false,
		maxLength = _args["maxLength"] || 255;
	
	//
	// Initialize default values for controls
	//
	$.formItemLabel.text = _args['label'] || 'Label';
	$.ta.height = _args["taHeight"] || 150;
	$.mView.top = top;
	
	
	//set widget property values based on args
	for (var key in _args) {
		if (_args.hasOwnProperty(key)) {
			$.mView[key] = _args[key];	
		}
	}
	
	
	setEnabled(true);
	
	
	//
	// Private functions
	//
	function lblValue_click() {
		if (ctrlWinTxtArea == null) { 
			ctrlWinTxtArea = Widget.createController('winTextArea');
			_args["displayControl"] = $.lblValue;
			ctrlWinTxtArea.init(_args);
		}
		
		ctrlWinTxtArea.open();
	}
	
	function getText() {
		var v = $.lblValue.text || "";
		return v;
	}
	
	function getValue() {
		var v = $.lblValue.text || "";
		return v;
	}
	
	function setText(v) {
		$.lblValue.text = v;
	}
	
	function setValue(v) {
		$.lblValue.text = v;
	}
	
	function getType() {
		return mType;
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
			$.ta.addEventListener('touchstart', lblValue_click);	
		} else {
			$.ta.removeEventListener('touchstart', lblValue_click);
		}
		
	}
	
	
	//
	// Public functions
	//
	$.getValue = getValue;
	$.setValue = setValue;
	$.getText = getText;
	$.setText = setText;
	$.getType = getType;
	$.setVisible = setVisible;
	$.setEnabled = setEnabled;

	exports.cleanUp = function() {
		
	};
	