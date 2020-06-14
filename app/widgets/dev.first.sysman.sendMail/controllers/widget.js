
	var fn = require('tilib/core/CUtils');
	var sysman = require('tilib/sysman/CSysmanIntf');
	
	var mParam = {};
	var mPrintFunc = null;
	var mKey = "";
	
	var mPdf = true;
	var mExcel = true;
	
	var mRowData = {};
	
	$.winSendMail["isFullScreen"] = true;
	
	
	//
	// Even Listener
	//
	$.btnSend.addEventListener('touchstart', sendMail);
	$.btnCancel.addEventListener('touchstart', closePopup);
	
	
	
	//
	//Functions
	//
	function init() {
		if (fn.isAndroid())
			$.winSendMail.addEventListener('androidback', closePopup);
			
		mKey = "SendMail." + sysman.getmUserId() + ".attachment";
		
		var mTrxType = [];
		if (mPdf) {
			mTrxType.push({label:"PDF", data:"pdf"});
		}
		
		if (mExcel) {
			mTrxType.push({label:"Excel", data:"excel"});
		}
		
		$.trxtype.setDataProvider(mTrxType);
				
				
		if (mPdf && mExcel) {
			$.trxtype.setSelectedValue(fn.getCookie(mKey,"pdf") == "excel" ? "excel" : "pdf");
		} else {
			$.trxtype.setSelectedValue(mExcel ? "excel" : "pdf");
		}	
	}
	
	function sendMail() {
		//Check if any of the recipients are present
		if (fn.trim($.fto.getText()) == "" &&
				fn.trim($.fcc.getText()) == "" &&
				fn.trim($.fbcc.getText()) == "") {
			fn.illegal("Please enter an email address");
			return;		
		}	
		
		var cb = function(n) {
			if (n == "1") {
				var o = fn.cloneObject(mParam);
				
				if (mPdf && mExcel) { 
					fn.setCookie(mKey,fn.gets($.trxtype.gets()));
				}	
					
				if ($.trxtype.gets() == "excel")
					o["excel"] = 1;
					
				o["_sendmail"] = 1;
				o["_ffromid"] = sysman.getmUserId();
				o["_ffrom"] = sysman.getmUserName();
				o["_fto"] = $.fto.getValue();
				o["_fcc"] = $.fcc.getValue();
				o["_fbcc"] = $.fbcc.getValue();
				o["_fsubject"] = $.fsubject.getValue();
				o["_fbody"] = $.fbody.getValue();

				o["fnoretry"] = 1;
				
				if (mPrintFunc != null) { 
					mPrintFunc(o);
					fn.ok("Done","This request has been submitted for processing.",closePopup);
				}	
			}
		};
		
		fn.ask("Confirm Action", 
			"Are you sure you want to send this mail?", cb);
	}
	
	function setParam(title, printFunc, param) {
		mPrintFunc = printFunc;
		mParam = param;
		
		$.fsubject.setValue(title);
		$.fbody.setValue("Hi,\n\nPlease refer to the attached file.\n\nThanks,\n" 
							+ sysman.getmUserName() + "\n");
	}
	
	function allowPdf(allow) {
		mPdf = allow;
	}
	
	function allowExcel(allow) {
		mExcel = allow;
	}
	
	function closePopup() {
		fn.closeSplash();
		$.winSendMail.close();
	}
	
	function setTitle(title) {
		title = title || "Send Mail";
		$.lblTitle.setText(title);
	}
	
	
	//
	// Public functions
	//
	exports.init = init;
	exports.setParam = setParam;
	exports.allowPdf = allowPdf;
	exports.allowExcel = allowExcel;
	exports.setTitle = setTitle;
	