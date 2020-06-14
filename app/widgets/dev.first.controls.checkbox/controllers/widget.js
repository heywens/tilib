/**
 * CheckBox
 * RBA 2014-01-15
 * 
 */

	var fn = require('tilib/core/CUtils');
	
	
	//copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};
	
	//default property values
	var top = -1;
	
	
	var mSelectedValue = false;
	
	//set custom component type
	var mType = "checkbox";
	
	var animateLeft = Ti.UI.createAnimation({
		curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration : 200,
		borderColor : "#BEBEBE",
		backgroundColor : "#F4F4F4",
		borderWidth : 1
	});
	
	
	var animateRight = Ti.UI.createAnimation({
		curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration : 200,
		borderColor : "#53B53F",
		backgroundColor : "#53B53F",
		borderWidth : 1
	});
	
	
	//set widget property values based on args
	formItemLabel = _args["label"];
	mSelectedValue = _args["selectedValue"] || false;	
	top =  _args["top"] || top;		
	
	
	//set widget property values based on args
	for (var key in _args) {
		if (_args.hasOwnProperty(key)) {
			$.mView[key] = _args[key];	
		}
	}
		
	
	//init
	if (fn.isIOS()) {
		$.cb.setValue(mSelectedValue);
	} else {
		$.cb2.left = mSelectedValue ? 20 : 0;
	}
	
	$.mView.top = top;
	$.formItemLabel.text = formItemLabel;
	
	
	setEnabled(true);
	
	
	//
	//Functions
	//	
	function cbSwipe(e) {		
		if (e.direction == 'right') {
			enableCheck();
		} else if (e.direction == 'left') {
			disableCheck();
		}
		
		mSelectedValue = e.direction == 'right';
	}
		
	function cbTap(e) {	
		if ($.cb2.left == 0) {
			enableCheck();
		} else {
			disableCheck();
		}
		
		mSelectedValue = $.cb2.left == 20;
	}
	
	function toggleEnable(b) {
		if (fn.isIOS()) return;
		
		b = fn.getb(b);
		
		if (b) {
			enableCheck();
		} else {
			disableCheck();
		}
	}
	
	function enableCheck() {
		if (fn.isIOS()) return;
		
		$.cb1.borderColor = "#53B53F";	//check - enable
		$.cb1.animate(animateRight);
		$.cb2.left = 20;
	}
	
	function disableCheck() {
		if (fn.isIOS()) return;
		
		$.cb1.borderColor = "#BEBEBE";	//
		$.cb1.animate(animateLeft);
		$.cb2.left = 0;
	}
	
	function setValue(b) {
		b = fn.getb(b);
		mSelectedValue = b;
		
		if (fn.isIOS()) {
			$.cb.setValue(b);
		} else {
			$.cb2.left = mSelectedValue ? 20 : 0;
			toggleEnable(mSelectedValue);
		}
	}
	
	function getValue() {
		if (fn.isIOS()) {
			mSelectedValue =  $.cb.getValue();
		}
		return mSelectedValue;
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
		
		if (fn.isIOS())
			$.cb.enabled = b;
		else {
			
			//mobileweb, android
			if (b) {
				$.cb2.addEventListener('swipe', cbSwipe);	
				$.cb1.addEventListener('singletap', cbTap);
			} else {
				//we have to remove event listeners
				$.cb2.removeEventListener('swipe', cbSwipe);	
				$.cb1.removeEventListener('singletap', cbTap);
			}
		}	
	}
	
	
	//
	//public functions
	//
	$.setValue = setValue;
	$.getValue = getValue;
	$.setVisible = setVisible;
	$.setEnabled = setEnabled;
	
	$.getType = function() {
		return mType;
	};
	
	exports.cleanUp = function() {
		if (!fn.isIOS()) { 
			$.cb2.removeEventListener('swipe', cbSwipe);	
			$.cb1.removeEventListener('singletap', cbTap);
		}
		
		fn.removeChildren($.mView);
		
		fn = null;
		_args = null;
		top = null;
		mSelectedValue = null;
		mType = null;
		animateLeft = null;
		animateRight = null;
	};

