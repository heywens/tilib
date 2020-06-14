/**
 * sysman/authorization
 * RA 2014-04-28
 * 
 */

	var fn = require('tilib/core/CUtils');
	
	var mAccessKey;
	var mOK;
	var mNG;
	
	$.btnOK.addEventListener('touchstart', acceptData);
	$.btnCancel.addEventListener('touchstart', cancel);
	
	if (fn.isAndroid()) {
		$.winAuth.addEventListener('androidback', cancel);
	}
	
	
	function init(key, ok, ng) {
		mAccessKey = key;
		mOK = ok;
		mNG = ng;
	}
	
	function acceptData() {
		if (!fn.checkRequired([$.sle_userid])) {
			fn.showError();
			return;
		}
		
		var cb = function(e) {
			var cbOK = function() {
				if (mNG != null) mNG();
				closePopup();
			};
			
			if (!fn.errorHandling(e,cbOK)) return;
			
			closePopup();
			mOK(e.data.fsupervisorid);
		};
		
		var sysman = require('tilib/sysman/CSysmanIntf');
		sysman.checkRights(mAccessKey, $.sle_userid.value, $.sle_password.value, cb);
	}
	
	function cancel() {
		if (mNG != null) mNG();
		closePopup();
	}
	
	function closePopup() {
		$.winAuth.close();
	}
	
	
	exports.init = init;
