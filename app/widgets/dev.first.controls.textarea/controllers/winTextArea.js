    //
	// Initialize libraries
	//
	var fn = require('tilib/core/CUtils');
	
	//
	// Variables
	//
	var mDisplayControl = null,	
		args = {};
	
	
	if (fn.isIOS()) {
		$.txtValueSetter.borderStyle = Titanium.UI.INPUT_BORDERSTYLE_ROUNDED;
	}
	
	if (fn.isAndroid())
		$.winTextArea.addEventListener('android:back', cancel);
	
	
	//
	// Event listeners
	//
	$.btnDone.addEventListener('touchstart', acceptData);
	$.btnCancel.addEventListener('touchstart', cancel);
	$.trans.addEventListener('touchstart', blur);
	
	if (fn.isMobileWeb()) {
		$.winTextArea.addEventListener('postlayout', setFocus);
		$.txtValueSetter.suppressReturn = false;
	} else {
		$.winTextArea.addEventListener('open', setFocus);
	}
	
	if (fn.isAndroid()) {
		$.txtValueSetter.enabled = true;
		$.txtValueSetter.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	}


	//
	// Private functions
	//
	function blur() {
		if (fn.isAndroid())
			Ti.UI.Android.hideSoftKeyboard();
		else		
	    	$.txtValueSetter.blur();
	}
	
	
	function open() {
		$.winTextArea.setZIndex(3);
		$.winTextArea.open();
	}
	
	function init(_args) {
		mDisplayControl = _args["displayControl"];
		var uppercase = _args["uppercase"] || false;
		var required = _args["required"] || false;
		var title = _args["label"] || "";
		
		if (uppercase) {
			$.txtValueSetter.autocapitalization = Ti.UI.TEXT_AUTOCAPITALIZATION_ALL;
		}
		
		if (required) {
			$.txtValueSetter.hintText = "Required";
		}
		
		$.lblTitle.setText(title);
	}
	
	function acceptData() {
		blur();
		$.winTextArea.close();
		
		var value = $.txtValueSetter.value;
		if (mDisplayControl != null) {
			mDisplayControl.value = fn.gets(value);
			mDisplayControl.text = fn.gets(value);
		}
	}
	
	function cancel() {
		blur();
		$.winTextArea.close();
	}
	
	function setFocus() {
		setTimeout(function(e){
			$.txtValueSetter.value = fn.gets(mDisplayControl.text);
	        $.txtValueSetter.focus();
	    }, 100);
	}
	
	
	//
	// Public functions
	//
	$.open = open;
	$.init = init;
