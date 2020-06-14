/*
 * sysman > initialSetup
 *  
 */

	$.winSetup.open();
	
	var fn = require('ph.com.alliance.iportfolio/core/CUtils');
	
	$.txtAddress1.setValue(fn.getCookie('mServerURL1'));
	$.lblAddress.setValue(fn.getCookie('mServerURL2'));
	
	if (fn.isAndroid())
		$.winSetup.addEventListener('androidback', cancel);
	
	$.btnOK.addEventListener('touchstart', setServer);
	$.btnCancel.addEventListener('touchstart', cancel);
	
	function setServer() {
		if ($.txtAddress1.value == '') {
			fn.illegal('Server address is required.');
		} else {
			var url1 = $.txtAddress1.value.toLowerCase();
			
			if ($.lblAddress.getValue() == '') {
				$.lblAddress.setValue(".devfirst.com");
			} 
			
			var url2 = $.lblAddress.value.toLowerCase();
			var mServerAddress = "http://" + url1 + url2;
			
			
			//we need to check if server address exists
			fn.splashMessage("Please wait, verifying URL...");
			
			var conn = Titanium.Network.createHTTPClient({
				timeout : 60000
			});
			
			conn.onload = function() {
					if (this.status == '200') {
						if (this.readyState == 4) {
							fn.setCookie('mServerURL1', url1);
							fn.setCookie('mServerURL2', url2);
							fn.setCookie('mServerAddress', mServerAddress);
							
							$.winSetup.close();
							fn.closeSplash();
							
							conn.abort();
						}
					}
				};
			
			conn.onerror = function(e) {
					fn.closeSplash();
					
					var a = Titanium.UI.createAlertDialog({
					    title: 'Not found',
					    message: 'Server URL does not exist.',
					    buttonNames : ["OK"]
					});
					a.show();
					fn.closeSplash();
					$.lblAddress.setValue("");
				};
			
			conn.open("GET",mServerAddress);
			conn.send();
		}	
	}
	
	function cancel() {
		$.winSetup.close();
	}