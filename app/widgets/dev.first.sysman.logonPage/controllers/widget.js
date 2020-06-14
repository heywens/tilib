/*
 * sysman > logonPage
 * 
 */

	var sm = require('tilib/sysman/CSysmanIntf'),
		fn = require('tilib/core/CUtils');
		
	var masterintf = require('tilib/master/CMasterIntf');
	var posmgrintf = require('tilib/posmgr/CPosMgrIntf');	
	var sysman = require('tilib/sysman/CSysmanIntf');
	
	var successCb = null;
	
	var _args = arguments[0] || {};
	var	appName = _args["appName"] || "DEV First",
		appLogo = _args["imgPath"] || "/mo_images/devfirst_logo.png";
		
	
	// event listener
	$.winLogonPage.addEventListener('open', configure);
	
	if (!fn.isMobileWeb()) { 
		$.authuserid.addEventListener('return', focusNext);
	}
	
	$.authuserpassword.addEventListener('return', doLogon);
	
	
	if (fn.isMobileWeb()) { 
		$.btnGPlay.visible = false;
		$.icoSignOn.addEventListener('touchstart', doLogon);
		
	} else { 
		$.btnContainer.addEventListener('touchstart', doLogon);
		$.lblConfigure.addEventListener('touchstart', configureServer);
	}
		
	if (fn.isAndroidBrowser()) {
		$.mLink.html = '<a href="market://details?id=' + Ti.App.id + '"><img src="/tilib_images/google_play.png" style="width:132px;height:32px;"></a>'; 
	}	
	
	
	//we want to go back to android's main menu if android back if pressed
	if (fn.isAndroid())
		$.winLogonPage.exitOnClose = true;
	
	
	$.lblApp.setText(appName);
	$.lblVersion.setText(fn.getVersion());
	$.imgLogo.setBackgroundImage(appLogo);
	
	
	//check if desktop browser or		
	if (fn.isMobileWeb() && fn.isMobileBrowser()) {
		$.scrollBody.setWidth("95%");
	} 
	
	if (fn.isDesktopBrowser()) {
		
		//Let's set its minimum width
		var hWidth = fn.getDeviceWidth() * .5;
		if (hWidth <= 400)			
			$.scrollBody.setWidth(400 * .95);
		else
			$.scrollBody.setWidth("50%");
	}	
	
	
	
	//
	// Functions
	//
	function doLogon(e) {
		if (!fn.checkRequired([$.authuserid])) {
			fn.illegal('Please enter required field');
			return;
		}
		
		$.authuserid.blur();
		$.authuserpassword.blur();
		
		fn.splashMessage("Please wait, processing request...");
		
		var userid = $.authuserid.value;
		var password = $.authuserpassword.value;
		
		var cb = function (e) {
			if (!fn.errorHandling(e)) return;
			
			fn.splashMessage("Please wait, processing request...");
			$.authuserpassword.setValue('');
			
			//Let's see if we can still use this user
			var mCompanyData = sysman.getmCompanyData();
			if (fn.getn(mCompanyData["fexpiry"]) < 0) {
				fn.illegal("License has expired. " +
					"You need to purchase terminal license to continue using the headquarter system for this company.");
				return;
			}
			
			posmgrintf.clearCache();	
			masterintf.clearCache();
			
			//Load main page here
			if (successCb != null) successCb();
		};
		
		sm.logon(userid,password,{},cb); 
	}
	
	function configure() {
		fn.closeSplash();
		
		//Configure server except for mobile web
		if (fn.getCookie('mServerAddress') == '') {
			configureServer();	
		}
	}
	
	function configureServer() {
		if (fn.isMobileWeb()) return;
		
		var winSetup = Alloy.createWidget('dev.first.sysman.initialSetup').winSetup;
		winSetup.open();
	}
	
	function setSuccessCb(cb) {
		successCb = cb;
	}
	
	function gotoMarket() {
		var url = "market://details?id=" + Ti.App.id;
		if (Ti.Platform.canOpenURL(url))
			Ti.Platform.openURL(url);
	}
	
	function focusNext() {
		$.authuserpassword.focus();
	}
	
	exports.setSuccessCb = setSuccessCb;
	
	
	exports.cleanUp = function() {
		$.winLogonPage.removeEventListener('open', configure);
	
		if (!fn.isMobileWeb()) 
			$.authuserid.removeEventListener('return', focusNext);
		
		$.authuserpassword.removeEventListener('return', doLogon);
		
		if (fn.isMobileWeb()) { 
			$.icoSignOn.removeEventListener('touchstart', doLogon);
		} else { 
			$.btnContainer.removeEventListener('touchstart', doLogon);
			$.lblConfigure.removeEventListener('touchstart', configureServer);
		}
		
		fn.removeChildren($.winLogonPage);
		
		sm = null;
		fn = null;
		masterintf = null;
		posmgrintf = null;	
		sysman = null;
		successCb = null;
	};
	
