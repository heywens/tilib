	var fn = require('tilib/core/CUtils');
	var args;
	
	// Variables
	//
	var mDisplayControl = null;
	var args = {};
	var upperCase;
	var lowerCase; 
	
	
	
	if (fn.isIOS()) {
		$.txtValueSetter.borderStyle = Titanium.UI.INPUT_BORDERSTYLE_ROUNDED;
	}
	
	if (fn.isAndroid())
		$.winTextField.addEventListener('android:back', cancel);
	
	
	// Event listener
	//
	$.btnDone.addEventListener('touchstart', acceptData);
	$.btnCancel.addEventListener('touchstart', cancel);
	
	$.trans.addEventListener('touchstart', blur);
	$.lblTitle.addEventListener('touchstart', blur);
		
	if (fn.isMobileWeb()) {
		$.txtValueSetter.enabled = true;
		$.txtValueSetter.focusable = true;
		
		$.winTextField.addEventListener('postlayout', setFocus);
		
	} else {
		$.winTextField.addEventListener('open', setFocus);
	}
	
	$.txtValueSetter.addEventListener('return', acceptData);
	
	if (fn.isAndroid()) {
		$.txtValueSetter.enabled = true;
		$.txtValueSetter.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	}
	
	
	// Private functions
	//
	function blur() {
		if (fn.isAndroid())
			Ti.UI.Android.hideSoftKeyboard();
		else		
	    	$.txtValueSetter.blur();
	}
	
	function open() {
		$.winTextField.setZIndex(3);
		$.winTextField.open();
	}
	
	function init(_args) {
		mDisplayControl = _args["displayControl"];
		upperCase = _args["upperCase"] || false;
		lowerCase = _args["lowerCase"] || false;
		
		var numeric = _args["numeric"] || false;
		var required = _args["required"] || false;
		var title = _args["label"] || "";
		
		if (upperCase) {
			$.txtValueSetter.autocapitalization = Ti.UI.TEXT_AUTOCAPITALIZATION_ALL;
		}
		
		if (numeric) {
			$.txtValueSetter.keyboardType = Ti.UI.KEYBOARD_DECIMAL_PAD;
		}
		
		if (required) {
			$.txtValueSetter.hintText = "Required";
		}
		
		$.lblTitle.setText(title);
		
		$.txtValueSetter.setBackgroundColor("white");
	}
	
	function acceptData() {
		blur();
		$.winTextField.close();
		
		var v = $.txtValueSetter.value;
		if (mDisplayControl != null) {
			if (lowerCase)
				v = fn.gets(v).toLowerCase();
			
			if (upperCase)	
				v = fn.gets(v).toUpperCase();
				
			mDisplayControl.text = v;
		}
	}
	
	function cancel() {
		blur();
		$.winTextField.close();
	}
	
	function setFocus() {
    	setTimeout(function(e){
			$.txtValueSetter.value = fn.gets(mDisplayControl.text);
			$.txtValueSetter.focus();
	    }, 100);
	}
	
	
	// Public functions
	//
	$.open = open;
	$.init = init;
