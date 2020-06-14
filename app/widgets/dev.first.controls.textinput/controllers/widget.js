	var fn = require('tilib/core/CUtils');
	
	
	// Copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};
	var top = _args["top"] || -1;
	var mType = "textinput";
	
	var required = _args["required"] || false;
	var upperCase = _args["upperCase"] || false;
	var lowerCase = _args["lowerCase"] || false;
	var numeric = _args["numeric"] || false;
	var restrict = _args["restrict"] || false;
	var maxLength = _args["maxLength"] || 255;
	var wLabel = _args["labelWidth"] || "40%";
	var wFormItem = _args["tiWidth"] || "60%";
	
	var ctrlWinTxtField = null;
	
	$.borderStyle = Ti.UI.INPUT_BORDERSTYLE_NONE;		
	$.borderStyle = Ti.UI.INPUT_BORDERSTYLE_NONE;
	$.formItemLabel.text = _args['label'] || 'Label';
	$.mView.top = top;
	
	$.vformItemLabel.width = wLabel;
	$.vlblValue.width = wFormItem;
	
	var animateSelect = Ti.UI.createAnimation({
		curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration : 100,
		backgroundColor : "#D7DADB",
		autoreverse : true
	});
	

	//set widget property values based on args
	for (var key in _args) {
		if (_args.hasOwnProperty(key)) {
			$.mView[key] = _args[key];	
		}
	}
	
	
	setEnabled(true);
	
	
	//
	// Private function
	//
	function lblValue_click() {
		$.mView.animate(animateSelect , open);
	}
	
	function open() {
		if (ctrlWinTxtField == null) { 
			ctrlWinTxtField = Widget.createController('winTextField');
			_args["displayControl"] = $.lblValue;
			ctrlWinTxtField.init(_args);
		}
		
		ctrlWinTxtField.open();
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
		setFieldValue(v);
	}
	
	function setValue(v) {
		setFieldValue(v);
	}
	
	function setFieldValue(v) {
		if (lowerCase)
			v = fn.gets(v).toLowerCase();
		if (upperCase)	
			v = fn.gets(v).toUpperCase();
			
		$.lblValue.text = v;	
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
			$.vlblValue.addEventListener('touchstart', lblValue_click);
		else
			$.vlblValue.removeEventListener('touchstart', lblValue_click);	
	}
	
	// Public function
	$.getValue = getValue;
	$.setValue = setValue;
	$.getText = getText;
	$.setText = setText;
	$.setVisible = setVisible;
	$.setEnabled = setEnabled;
	
	$.getType = function() {
		return mType;
	};
	
	exports.cleanUp = function() {
		
	};	