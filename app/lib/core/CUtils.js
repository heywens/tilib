/*
 * lib > core > CUtils
 */ 
	
	var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",		 
		lastError = '';
		parseResult = '',
		
		mServerVersion = '',
		mVersion = 'V7.39.39.F08280',
		mCopyright = 'Copyright (C) 2015 DEV First',
		mAppName = 'DEV First',
		mSubHeader = '',
		mSplashMessage = null,
		mSplashWin = null,
		mInfo = null,
		currencySymbol = "P",
		mUserAgent = Ti.getUserAgent();
		
	var osname = Ti.Platform.osname;
	
	var pWidth = Ti.Platform.displayCaps.platformWidth;
	var pHeight = Ti.Platform.displayCaps.platformHeight;
	
	
	//Fonts
	var os = function(/*Object*/ map) {
	    var def = map.def||null; //default function or value
	    if (map[osname]) {
	        if (typeof map[osname] == 'function') { 
	        	return map[osname](); 
	        } else { 
	        	return map[osname]; 
	        }
	    } else {
	        if (typeof def == 'function') {
	        	return def();
	        } else { 
	        	return def; 
	        }
	    }
	};
	
	//
	// Public properties
	//
	exports.getLastError	= function() { return lastError; };
	exports.getParseResult 	= function() { return parseResult; };
	exports.getDeviceWidth  = function() { return pWidth; };
	exports.getDeviceHeight = function() { return pHeight; };
	exports.getVersion		= function() { return mVersion; };
	
	
	//
	// Public functions
	//
	exports.executeOnFly = executeOnFly;
	exports.isEmpty = isEmpty;	
	exports.checkRequired = checkRequired;
	exports.errorHandling = errorHandling;
	exports.setCookie = setCookie;
	exports.getCookie = getCookie;
	exports.getStatusBarHeight = getStatusBarHeight;
	exports.isAndroid = isAndroid;
	exports.isIphone = isIphone;
	exports.isIpad = isIpad;
	exports.stringifyArray = stringifyArray;
	exports.isString = isString;
	exports.left = left;
	exports.right = right;
	exports.mid = mid;
	exports.sLen = sLen;
	exports.min = min;
	exports.max = max;
	exports.getn = getn;
	exports.isNumeric = isNumeric;
	exports.gets = gets;
	exports.searchReplace = searchReplace;
	exports.isObject = isObject;
	exports.pos = pos;
	exports.checkDates = checkDates;
	exports.showError = showError;
	exports.currency = currency;
	exports.mergeObject = mergeObject;
	exports.getb = getb;
	exports.cloneObject = cloneObject;
	exports.parseValue = parseValue;
	exports.nextParse = nextParse;
	exports.trim = trim;
	exports.bin2String = bin2String;
	exports.isEncrypted = isEncrypted;
	exports.encode = encode;
	exports.decode = decode;
	exports.base64_encode = base64_encode;
	exports.base64_decode = base64_decode;
	exports.abs = abs;
	exports.cloneArray = cloneArray;
	exports.currencyLabelNonZero = currencyLabelNonZero;
	exports.objectToArray = objectToArray;
	exports.round0 = round0;
	exports.round2 = round2;
	exports.round1 = round1;
	exports.findArrayIndex = findArrayIndex;
	exports.getHostName = getHostName;
	exports.isMobileWeb = isMobileWeb;
	exports.isIOS = isIOS;
	exports.splashMessage = splashMessage;
	exports.closeSplash = closeSplash;
	exports.illegal = illegal;
	exports.fatal = fatal;
	exports.info = info;
	exports.getChildrenValues = getChildrenValues;
	exports.getItemValues = getItemValues;
	exports.setChildrenValues = setChildrenValues;
	exports.numericLabelNonZero = numericLabelNonZero;
	exports.yesNoNullLabel = yesNoNullLabel;
	exports.isObjectEmpty = isObjectEmpty;
	exports.numFormat = numFormat;
	exports.setChildrenVisibleByData = setChildrenVisibleByData; 
	exports.currencyLabel = currencyLabel;
	exports.setCurrencySymbol = setCurencySymbol;
	exports.getCurrencySymbol = getCurrencySymbol;
	exports.removeAllChildren = removeAllChildren;
	exports.os = os;
	exports.setComboBox = setComboBox;
	exports.getbHeight = getbHeight;
	exports.removeChildren = removeChildren;
	exports.openModal = openModal;
	exports.openWindow = openWindow;
	exports.isAndroidBrowser = isAndroidBrowser;
	exports.makeComboList = makeComboList;
	
	exports.ok = ok;
	exports.ask = ask;
	exports.askCancel = askCancel;
	
	
	exports.isMobileBrowser = isMobileBrowser;
	exports.isDesktopBrowser = isDesktopBrowser;
	
	exports.trimStartEnd = trimStartEnd;
	exports.splitLine = splitLine;
	exports.selectTableRow = selectTableRow;
	exports.getbHeightdpi = getbHeightdpi;
	
	//for debugging purposes
	exports.debug = debug;
	exports.var_dump = var_dump;
	exports.monitorMemory = monitorMemory; 
	
	exports.getBrowserBackgroundColor = getBrowserBackgroundColor; 
	exports.getBrowserWidth = getBrowserWidth;
	exports.getBrowserHeight = getBrowserHeight;
	exports.getRecomBrowserWidth = getRecomBrowserWidth; 
	exports.changeWidthSize = changeWidthSize;
	exports.getContentHeight = getContentHeight;
	
	//
	// Functions
	//	
	
	/** For Debugging purposes */
	function debug(msg) {
		Ti.API.info(msg);
	}
	
	function monitorMemory() {
		if (isMobileWeb()) return;
		var unit = "MB";
		if (isAndroid()) unit = "bytes";
		setInterval(function() {
			debug("!!! Available Memory = " + currency(Ti.Platform.availableMemory,0) + " " + unit);
    	}, 3000);
	}
	
	
	function var_dump(_var, _level) {
		var dumped_text = "";
		if (!_level) _level = 0;
     
		//The padding given at the beginning of the line.
		var level_padding = "";

		for (var j = 0; j < _level + 1; j++) level_padding += "    ";
 
		if (typeof(_var) == 'object') { //Array/Hashes/Objects 
			for (var item in _var) {
				var value = _var[item];
         
				if (typeof(value) == 'object') { // If it is an array,
					dumped_text += level_padding + "'" + item + "' ...\n";
					dumped_text += var_dump(value, _level+1);
				} else {
  					dumped_text += level_padding +"'"+ item +"' => \""+ value +"\"\n";
				}
  			}
		} else { //Stings/Chars/Numbers etc.
  			dumped_text = "===>"+ _var +"<===("+ typeof(_var) +")";
    	}
    	
  		debug(dumped_text);
	}
	/** For Debugging purposes --END **/
	
	
	function executeOnFly(cb) {
		setTimeout(cb, 0);
	}
	
	function isEmpty(s) {
		return (s == null) || (s == "") || (s == undefined);
	}

	
	function checkRequired(objs) {
		if (objs == null) return false;
		
		var len = objs.length;
		for (var i = 0; i < len; i++) {
			var obj = objs[i];
			
			if (obj == null) return false;
			
			var s = obj.value;
			if (isEmpty(s)) {
				lastError = "This field is required.";
				return false;
			}
		}
		return true;
	}
	
	
	function errorHandling(obj, callback, parent) {	
		lastError = '';	
		
		var msgs = '';			
		var warn = false;
		 
		if (obj == null) return true;
	
		try {
			msgs = obj.messages.message;
		} catch (err) {
			msgs = obj.messages;
		}
	
		lastError = msgs;
	
		if (obj.isFatal) {
			fatal(msgs, callback);
		} else if (obj.isError) {
			illegal(msgs, callback);
		} else if (warn && msgs != "") {
			setTimeout(function(e) {
				illegal(msgs, callback);
			}, 1000);
			return true;
			
		} else 
			return true;
		
		return false;
	}
	
	
	function illegal(msg, cb) {
		closeSplash();
		
		mInfo = Alloy.createWidget("dev.first.forms.info");
		
		mInfo.init({
			msg 	: msg,
			option 	: ["OK"],
			cancel 	: 0,
			cb 		: cb
		});
	}
	
	function fatal(msg, cb) {
		closeSplash();
		
		mInfo = Alloy.createWidget("dev.first.forms.info");
		
		mInfo.init({
			msg 	: msg,
			option 	: ["OK"],
			cancel 	: 0,
			cb 		: cb
		});
	}
	
	function info(msg) {
		closeSplash();
		
		mInfo = Alloy.createWidget("dev.first.forms.info");
		
		mInfo.init({
			msg 	: msg,
			option 	: ["OK"],
			cancel 	: 0
		});
	}
	
	function ok(title, msg, cb) {
		closeSplash();
		
		mInfo = Alloy.createWidget("dev.first.forms.info");
		
		mInfo.init({
			title 	: title,
			msg 	: msg,
			option 	: ["OK"],
			cancel 	: 0,
			cb 		: cb
		});
	}
	
	function ask(title, msg, cb) {
		mInfo = Alloy.createWidget("dev.first.forms.info");
		
		mInfo.init({
			title 	: title,
			msg 	: msg,
			option 	: ["No","Yes"],
			cancel 	: 0,
			cb 		: cb
		});
	}
	
	function askCancel(title, msg, cb) {				
		if (mInfo == null)
			mInfo = Alloy.createWidget("dev.first.forms.info");
		
		mInfo.init({
			title 	: title,
			msg 	: msg,
			option 	: ["No","Yes"],
			cancel 	: 0,
			cb 		: cb
		});
	}
	
	
	function setCookie(key, value) {
		Ti.App.Properties.setString(key, value);
	}
	
	
	function getCookie(key) {
		return Ti.App.Properties.getString(key,'');
	}
	
	
	function getStatusBarHeight() {
		if (isMobileWeb()) return 0;
		
		switch ( Ti.Platform.displayCaps.density ) {
			case 160: return 25;
			case 120: return 19;
			case 240: return 38;
			case 320: return 50;
			default:  return 25;
		}
	}
	
	
	function isAndroid() {
		return osname === 'android';
	}
	
	
	function isIphone() {
		return osname === 'iphone';
	}
	
	
	function isIpad() {
		return osname === 'ipad';
	}
	
	
	function stringifyArray(arr) {
		if (arr == null)
			return [];
		
		if (!(arr instanceof Array)) {
			arr = Array(arr);
		} 
		
		var retval = [];
		var len = arr.length;
		for (var i = 0; i < len; i++) {
			var data = arr[i];
			
			for (var fld in data) {
				if (!isString(data[fld]))
					data[fld] = "";
			}
			
			retval.push(data);
		}
		
		return retval;
	}
	
	
	function isString(s) {
		return typeof s == "string" || (isObject(s) && s.constructor === String);
	}
	
	
	function left(s,n) {
		if (s == null || isObject(s)) return "";
		s = gets(s);
		return s.substr(0,min(n,sLen(s)));	
	}
	
	
	function right(s,n) {
		if (s == null || isObject(s)) return "";
		s = gets(s);
		return s.substr(max(sLen(s) - n, 0), n);
	}
	
	
	function mid(s, idx, n) {
		if (s == null || isObject(s)) return "";
		if (isNaN(n)) n = sLen(s);
		s = right(s,sLen(s) - idx + 1);
		return left(s,n);
	}
	
	
	function sLen(s) {
		return s.toString().length;
	}
	
	
	function min(v1, v2) {
		return v1 < v2 ? v1 : v2;
	}
	
	
	function max(v1, v2) {
		return v1 > v2 ? v1 : v2;
	}
	
	
	function getn(v) {
		var s = String(v);
		var s = searchReplace(s, ",");
	
		s = searchReplace(s, ",");
		
		if (isNumeric(s)) return Number(s);
		return 0;	
	}
	
	
	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	
	function gets(s) {
		if (s == null) return "";
		if (isObject(s)) return "";
		return String(s);
	}
	
	
	function searchReplace(orgStr, findStr, repStr) {
		if (orgStr == null) return orgStr;
		if (findStr == null) return orgStr;
		if (repStr == null) repStr = "";
		
		var nPos = pos(orgStr,findStr);
		if (nPos <= 0) return orgStr;
		
		var s1 = left(orgStr,nPos - 1) + repStr;
		var s2 = mid(orgStr,nPos + sLen(findStr));
		
		s2 = searchReplace(s2,findStr,repStr);
		return s1 + s2;
	}
	
	
	function isObject(s) {
		return typeof s == "object";
	}
	
	
	function pos(s1, s2, sPos) {
		if (s1 == null || isObject(s1) || s2 == null || isObject(s1)) return 0;
		if (sPos == null) sPos = 1;
		return s1.indexOf(s2,max(sPos - 1, 0)) + 1;
	}
	
	
	function checkDates(objs,format) {
		format = format || "MM/DD/YYYY";
		var date_regex;
		
		switch (format) {
			case "YYYY/MM/DD":
				date_regex = /^[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])$/;
				break;
			default: // MM/DD/YYY
				date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
				break;	
		}
		
		var len = objs.length;
		for (var i = 0; i < len; i++) {
			var p = objs[i];
			if (p == null) continue;
			if (p.value != "" && p.value != undefined && !date_regex.test(p.value)) {
				lastError = "Invalid date format. Please enter " + format + ".";
				return false;
			}
		}
		
		return true;
	}
	
	function isMobileBrowser () {
		return pos(mUserAgent, "Mobile") > 0;
	}
	
	function isDesktopBrowser() {
		return isMobileWeb() && !isMobileBrowser() && !isAndroidBrowser();
	}
	
	function isAndroidBrowser() {
		return isMobileWeb() && (pos(mUserAgent, "Android") > 0);
	}
	
	
	function showError() {
		illegal(lastError);
	}
	
	
	function currency(v, precision) {
		v = getn(v);
		precision = precision || 2; 
		return v.formatMoney(precision);
	}
	
	Number.prototype.formatMoney = function(precision, d, t) {
		var n = this, 
		    precision = isNaN(precision = Math.abs(precision)) ? 2 : precision, 
		    d = d == undefined ? "." : d, 
		    t = t == undefined ? "," : t, 
		    s = n < 0 ? "-" : "", 
		    i = parseInt(n = Math.abs(+n || 0).toFixed(precision)) + "", 
		    j = (j = i.length) > 3 ? j % 3 : 0;
		
		return s + (j ? i.substr(0, j) + t : "") 
				+ i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) 
				+ (precision ? d + Math.abs(n - i).toFixed(precision).slice(2) : "");
	};
	
	function mergeObject(obj1, obj2) {
	    var obj3 = {};
	    for (var attrname in obj1) { 
	    	obj3[attrname] = obj1[attrname]; 
	    }
	    
	    for (var attrname in obj2) { 
	    	obj3[attrname] = obj2[attrname]; 
	    }
	    
	    return obj3;
	}
	
	
	function getb(v) {
		if (v == null || v == "0" || v == "N" || v == undefined || v == "n" || v == "" || gets(v) == "false") 
			return false;
		return true;
	}
	
	
	function cloneObject(obj) {
		if (obj == null || typeof obj != 'object')
	        return obj;
	
	    var ret = obj.constructor();
	
	    for(var key in obj)
	        ret[key] = cloneObject(obj[key]);
	    return ret;
	}
	
	
	function parseValue(s, delimeter) {
		if (delimeter == null) delimeter = ",";
		
		var p = pos(s, delimeter);
		if (p == 0) {
			parseResult = "";
			return trim(s);
		}
		
		parseResult = trim(mid(s, p + delimeter.length));
		return trim(left(s, p - 1));
	}
	
	
	function nextParse() {
		return parseResult;
	}
	
	
	function trim(s) { 
		s = gets(s);
		return s.replace(/\s+/g,'');
	}
	
	
	function bin2String(array) {
		var result = "";
		var len = array.length;
		for (var i = 0; i < len; i++) {
			result += String.fromCharCode(parseInt(array[i], 2));
		}
		return result;
	}
	
	
	function isEncrypted(data) {
		if (data == "" || data == undefined)
			return false;
		if (data.length > 5) {
			return (data.substr(0, 5) == "!x=G8" && data.substr(
					data.length - 1, 1) == "@");
		}
		return false;
	}
	
	
	function encode(data) {
		if (data == "" || data == undefined)
			return "";
	
		if (isEncrypted(data))
			return data;
	
		data = base64_encode(data);
		return "!x=G8" + data + "@";
	}
	
	
	function decode(data) {
		if (data == "" || data == undefined)
			return "";
	
		if (isEncrypted(data)) {
			data = data.substr(5, data.length - 6);
			return base64_decode(data);
		}
	
		return data;
	}
	
	
	function base64_encode(input) {
		var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef"
				+ "ghijklmnopqrstuv" + "wxyz0123456789+/" + "=";
		input = escape(input);
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
	
		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
	
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
	
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
	
			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
					+ keyStr.charAt(enc3) + keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
	
		return output;
	}
	
	
	function base64_decode(input) {
		var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef"
				+ "ghijklmnopqrstuv" + "wxyz0123456789+/" + "=";
	
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
	
		//remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		var base64test = /[^A-Za-z0-9\+\/\=]/g;
		if (base64test.exec(input)) {
			illegal("There were invalid base64 characters in the input text.\n"
					+ "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n"
					+ "Expect errors in decoding.");
		}
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	
		do {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));
	
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
	
			output = output + String.fromCharCode(chr1);
	
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
	
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
	
		} while (i < input.length);
	
		return unescape(output);
	}
	
	
	function abs(v) {
		return Math.abs(getn(v));
	}
	
	
	function cloneArray(otherArray) {
		if (otherArray == null) return [];
		
		otherArray = stringifyArray(otherArray);
		var array = [];
		
		var len = otherArray.length;
		for (var i = 0; i < len; i++) {
			array.push(cloneObject(otherArray[i]));
		}
		
		return array;
	}
	
	
	function currencyLabelNonZero(item,fid) {
		var s = item[fid];
		if (isEmpty(s)) return "";
		if (getn(s) == 0) return "";
		return currency(getn(s));
	}
	
	
	function objectToArray(obj) {
		if (obj) {
			var _Array = [];
			
	       	for (var name in obj) {
	        	_Array[name] = obj[name];
	       	}
	       	return _Array;
		}
	}
	
	
	function round0(v) {
		return Math.round(getn(v));
	}
	
	
	function round2(v) {
		var n = getn(v);
		var sign = n < 0 ? -1 : 1;
		n = n * 100.0 + (0.0000001 * sign);
		n = Math.round(n);
		n = n / 100;
		return n;
	}
	
	
	function round1(v) {
		var n = getn(v);
		n = n * 10.0 + 0.0000001;
		n = Math.round(n);
		n = n / 10;
		return n;
	}
	
	
	function findArrayIndex(list, value, index) {
		index = index || "data";
		
		var len = list.length;
		for (var i = 0; i < len; i++) {
			var o = list[i];
			if (o[index] == value) return o;	
		}
		return null;
	}
	
	
	function getHostName() {
		var g_BaseURL = document.location.host;
		var g_HostString;
		var pattern1; 
		 
		pattern1 = new RegExp("http://[^/]*/[^/]*/[^/]*/");
		if (g_BaseURL.match(pattern1)) {
			g_HostString = pattern1.exec(g_BaseURL).toString();
			return g_HostString;
		}
		
		pattern1 = new RegExp("http://[^/]*/[^/]*/");
		if (g_BaseURL.match(pattern1)) {
			g_HostString = pattern1.exec(g_BaseURL).toString();
		    return g_HostString;
		}
		 
		pattern1 = new RegExp("http://[^/]*/");
		if (g_BaseURL.match(pattern1)) {
			g_HostString = pattern1.exec(g_BaseURL).toString();
			return g_HostString;
		} 
		
		pattern1 = new RegExp("https://[^/]*/[^/]*/[^/]*/");
		if (g_BaseURL.match(pattern1)) {
			g_HostString = pattern1.exec(g_BaseURL).toString();
			return g_HostString;
		}
		
		pattern1 = new RegExp("https://[^/]*/[^/]*/");
		if (g_BaseURL.match(pattern1)) {
			g_HostString = pattern1.exec(g_BaseURL).toString();
			return g_HostString;
		}
		
		pattern1 = new RegExp("https://[^/]*/");
		if (g_BaseURL.match(pattern1)) {
			g_HostString = pattern1.exec(g_BaseURL).toString();
			return g_HostString;
		} 
		
		g_HostString = "http://localhost:8888/";
		return g_HostString;
	}
	
	
	function isMobileWeb() {
		return osname === "mobileweb";
	}
	
	
	function isIOS() {
		return isIphone() || isIpad();
	}
	
	
	function getChildrenValues(f, p) {
		var wType = f.__widgetId;

		if (p == null) p = {};
		if (f == null) return p;
		
		if (f.id != "" && f.id != null) {
			var widgetType = f.__widgetId;
			switch (wType) {
				case "dev.first.controls.period":
					p[f.id + "_fsdate"] = f.getStartDate();
					p[f.id + "_fedate"] = f.getEndDate();
					return p;
					
				case "dev.first.controls.datefield":
					if (left(f.id,1) == "_") return p;
					if (isEmpty(f.getValue())) 
						p[f.id] = "";
					else 
						p[f.id] = f.getYMD();
					return p;
					
				case "dev.first.controls.textinput":
				case "dev.first.controls.textarea":
					if (left(f.id,1) == "_") return p;
					p[f.id] = f.getValue();
					return p;
					
				case "dev.first.controls.time":
					p[f.id] = f.getValue();
					return p;
						
				case "dev.first.controls.checkbox":
					p[f.id] = f.getValue() ? "1" : "0";
					return p;
					
				case "dev.first.controls.combobox":
					p[f.id] = f.getSelectedValue();
					return p;
					
				case "dev.first.controls.key":
					p[f.id] = f.getValue();
					return p;
			}	
		}
		
		if (f.children == null) return p;
		
		var len = f.children.length;
		for (var i = 0; i < len; i++) {
			var c = f.children[i];
			p = getChildrenValues(c,p);
		}
		return p;
	}
	
	function getItemValues(arrItem, p) {
		if (p == null) p = {};
		if (arrItem == null) return p;
		if (arrItem.length <= 0) return p;
		
		var len = arrItem.length;
		for (var i = 0; i < len; i++) {
			var f = arrItem[i];
			var wType = f.getType(); // f.__widgetId;
			var fid = f.getView().id;
			
			switch (wType) {
				case "period":
					p[fid + "_fsdate"] = f.getStartDate();
					p[fid + "_fedate"] = f.getEndDate();
					break;
					
				case "datefield":
					if (left(fid,1) == "_") return p;
					if (isEmpty(f.getValue())) 
						p[fid] = "";
					else 
						p[fid] = f.getYMD();
					break;
					
				case "textinput":
				case "textarea":
					if (left(fid,1) == "_") return p;
					p[fid] = f.getValue();
					break;
					
				case "time":
					p[fid] = f.getValue();
					break;
						
				case "checkbox":
					p[fid] = f.getValue() ? "1" : "0";
					break;
					
				case "combobox":
					p[fid] = f.getSelectedValue();
					break;
					
				case "key":
					p[fid] = f.gets();
					break;
					
				
				case "label": 
				case "labellink":
					p[fid] = f.getText();	
					break;	
			}	
		}
		
		return p;
	}
	
	
	function splashMessage(msg, parent) {
		var cb = function() { 
			if (mSplashMessage == null) {
				mSplashMessage = Alloy.createWidget('dev.first.forms.splashmessage');
			}
			
			mSplashMessage.show(msg);
		};
		executeOnFly(cb);		
	}
	
	
	function closeSplash() {
		if (mSplashMessage == null) return;
		mSplashMessage.hide();
	}
	
	
	function openModal(w) {
		w.open();
	}
	
	
	function setChildrenValues(formItems,data) {
		if (formItems == null) return;
		if (formItems.length <= 0) return;
		
		var len = formItems.length;
		for (var i = 0; i < len; i++) {
			var f = formItems[i];
			var wType = f.getType(); // f.__widgetId;
			var fid = f.getView().id;
			
			if (isEmpty(wType)) continue;
			if (isEmpty(fid)) continue;
			
			switch (wType) {
				case "period":
					f.setStartDate(data[fid + "_fsdate"]);
					f.setEndDate(data[fid + "_fsdate"]);
					break;
					
				case "datefield":
					f.setDate(data[fid]);
					break;
					
				case "textinput":
				case "textarea":
					f.setText(data[fid]);
					break;
					
				case "checkbox":
					f.setValue(data[fid]);
					break;
					
				case "combobox":
					f.sets(data[fid]);
					break;
					
				case "key":
					f.sets(data[fid]);
					break;
					
					
				case "label":
				case "labellink":
					f.setText(data[fid]);
					break;	
			}	
		}	
	}
	
	function numericLabelNonZero(item,fid) {
		var s = gets(item[fid]);
		if (isEmpty(s)) return "";
		if (getn(s) == 0) return "";
		return String(getn(s));
	}	
	
	function yesNoNullLabel(item,fid) {
		var s = String(getn(item[fid]));
		return s == "1" ? "Y" : "";
	}	
	
	function isObjectEmpty(obj) {
	    for (var key in obj) {
	        if (hasOwnProperty.call(obj, key)) return false;
	    }
	
	    return (obj == null) 
	    	|| (typeof obj === "undefined")
			|| (obj.length <= 0)
			|| (obj.length < 0);
	}
	
	function numFormat(v,precision,useNegative,useThousandsSeparator) {
		precision = isEmpty(precision)? precision : 2;
		useNegative = !isEmpty(useNegative)? useNegative : true;
		useThousandsSeparator = !isEmpty(useThousandsSeparator)? useThousandsSeparator : true;
		
		v = getn(v);
		
		var pattern = "###" + (useThousandsSeparator ? "," : "") + "##0" +  (precision>0 ? "." : "") + right("0000",precision);
		return String.formatDecimal(v,"en-US",pattern);
	}
	
	function setChildrenVisibleByData(formItems,data) {
		if (formItems == null) return;
		if (formItems.length <= 0) return;
		
		var len = formItems.length;
		for (var i = 0; i < len; i++) {
			var f = formItems[i];
			var fid = f.getView().id;
			
			f.setVisible(!isEmpty(data[fid]));
			f.setVisible(getn(data[fid]) != 0);
		}	
	}

	function currencyLabel(item,fid) {
		return currency(getn(item[fid]));
	}
	
	function setCurencySymbol(currency) {
		currencySymbol = currency;
	}
	
	function getCurrencySymbol() {
		return currencySymbol;
	}
	
	function removeAllChildren(view) {
		if (isMobileWeb()) { 
			var len = view.children.length;
			for (var i = len; i >= 0; i--) {
				view.remove(view.children[i]);
			}
		} else {
			view.removeAllChildren();
		}
	}
	
	function removeChildren(view, cb) {
		if (view && view.children != undefined) {   
		    var memPool = Ti.UI.createWindow({width:1, height:1});
		    memPool.open();
			memPool.hide();
			
		    for (var i = view.children.length; i > 0; i--) {
		        memPool.add(view.children[i - 1]);
		        view.remove(view.children[i - 1]);
		    };
		    
		    memPool.close();
		    view = null;
		    memPool = null;
		    
		    if (cb) cb();
		}
	}
	
	function setComboBox(f, callback, primaryList, setNewPrimaryList, label, pk, searchFunc) {
		var searchParameters = {};
		if (f == null) f = {};
		if (f["searchParams"] != null) 
			searchParameters = f.searchParams;
		
		var setList = function() {
			var list = [];
			
			if (f["prelist"] != undefined)
				list = f.prelist;
			
			if (f["insertAll"] != null && f["insertAll"] == true) {
				list.push({label:"(All)",data:""});
			}
			
			if (f["insertBlank"] != null && f["insertBlank"] == true) {
				list.push({label:"(All)",data:""});
			}
			
			primaryList = convertToComboList(primaryList,label,pk);
			list = list.concat(primaryList);
			
			if (f["postlist"] != undefined)
				list = list.concat(f.postlist);

			
			if (f["field"] != undefined)
				f.field.setDataProvider(list);
				
			if (list.length > 0) 
				f.field.setSelectedValue(list[0].data);	
			
			if (callback != null) callback();
		};
		
		var cb = function(e) {
			primaryList = [];
			
			if (!e.isError) {
				primaryList = stringifyArray(e.data.list);
			}
			
			if (setNewPrimaryList != null) setNewPrimaryList(primaryList);
			setList();
		};
		
		searchParameters.fnomax = 1;
		if (primaryList == null || primaryList.length == 0) {
			searchFunc("",searchParameters,cb);
		} else {
			setList();
		}
	}
	
	function convertToComboList(list,flabel, fdata) {
		var newlist = [];
		var len = list.length;
		for (var i = 0; i < len; i++) {
			var obj = list[i];
			var p = {};
			p.data = gets(obj[fdata]);
			p.label = gets(obj[flabel]);
			newlist.push(p);
		}
		
		return newlist;
	}
	
	function getbHeight() { 
		// 100 => 50 (nav height) + 50 (ctrl bar height);
		return pHeight - getStatusBarHeight() - 100;
	}
	
	function openModal(w) {
		w.zIndex = 3;
		w.open();
	}
	
	function openWindow(w) {
		w.zIndex = 3;
		if (isIOS()) {
			var isFullScreen = getb(w["isFullScreen"]);
			if (isFullScreen) w.top = getStatusBarHeight();
		}
		
		w.open();
	}
	
	
	function numberWithCommas(num, precision) {
		precision = precision || 2;
		num = getn(num);
		
		var temp = num.toFixed(precision);
	    var parts = temp.toString().split(".");
	    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    return parts.join(".");
	}

	function trimStartEnd(str) {
		return str.replace(/^\s+|\s+$/g,'');
	}
	
	function splitLine(str) {
		var pos 	= str.indexOf("   ");
		var len  	= str.length;
		
		if (pos == -1) return [str, ""];
		
		return [
					str.substring(0,pos),
					trimStartEnd( str.substring(pos,len) )
			   ];
	}
	
	
	function selectTableRow(row, cb, color) {
		color = color || "#B40026";
		var temp = row.backgroundColor;
		row.backgroundColor = color;
		
		var timeout = setTimeout(function() {
			row.backgroundColor = temp;
			if (cb != null) cb();
			clearTimeout(timeout);
		},50);
	}
	
	
	function getbHeightdpi() { 
				
		var dpiDF = Ti.Platform.displayCaps.logicalDensityFactor;
		
		if (isAndroid()) 	return (pHeight/dpiDF) - (100 + getStatusBarHeight() + 10); //100 => 50 (nav height) + 50 (ctrl bar height);
		if (isMobileWeb()) 	return getbHeight() - 10;
		if (isIOS()) 		return getbHeight() - 10;
		
	}
	
	function makeComboList(list, flabel, fdata, copyObject) {
		if (copyObject == null) copyObject = false;
	
		var flist = [];
		var idx = 0;
		
		for (var i = 0; i < list.length; i++) {
			var obj = list[i];

			if (copyObject) {
				var o = cloneObject(obj);
				o.label = gets(obj[flabel]);
				o.data = gets(obj[fdata]);
				flist.push(o);
			} else {
				flist[idx] = 
					{label:gets(obj[flabel]),data:gets(obj[fdata])};
			}
			idx++;
		}
		return flist;
	}
	
	
	function getBrowserBackgroundColor() {
	    return "#999999";
	}
	
	function getBrowserWidth() {
	    return window.innerWidth;
	}
	
	function getBrowserHeight() {
        return window.innerHeight;
    }
	
	function getRecomBrowserWidth() {
	    return "800";
	}
	

    function changeWidthSize(view) {
        if (getBrowserWidth() < getRecomBrowserWidth()) {
             view.setWidth("100%");
         } else{
            view.setWidth(getRecomBrowserWidth());
         }            
    }
    
    function getContentHeight() {
        return getBrowserHeight - 150; //50 (nav height) + 60 (tab bar height) + 40 (header height)
    }
	
	