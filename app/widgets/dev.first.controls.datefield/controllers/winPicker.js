/*
 * Picker window for DateField
 * 
 */
	var fn = require('tilib/core/CUtils');
	
	$.cbAccept = null;
	
	var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var curMonth = null;
	var curDay = null;
	var curYear = null;
	var minDate = null;
	var maxDate = null;
	
	
	//
	//event listener
	//
	$.btnDone.addEventListener('touchstart', formatDate);
	$.btnCancel.addEventListener('touchstart', cancel);
	
	if (fn.isAndroid()) {
		$.winPicker.addEventListener('androidback', cancel);
	}
	
	
	if (fn.isAndroid() || fn.isMobileWeb()) { 
		$.madd.addEventListener('touchstart', increMonth);
		$.mmin.addEventListener('touchstart', decreMonth);
		$.dadd.addEventListener('touchstart', increDay);
		$.dmin.addEventListener('touchstart', decreDay);
		$.yadd.addEventListener('touchstart', increYear);
		$.ymin.addEventListener('touchstart', decreYear);
	}

	
	//
	// Functions
	//
	function init(_args) {
		_args = _args || {};
		
		var value = _args.value;
		minDate = _args.minDate;
		maxDate = _args.maxDate;
		
		if (fn.isIOS()) {
			$.fperiod.minDate = minDate;
			$.fperiod.maxDate = maxDate;
			$.fperiod.setValue(value);	
		}
	}
	
	function formatDate() {
		var v = getMDYWithSlash();
		$.winPicker.close();
		if ($.cbAccept != null) $.cbAccept(v);
	}
	
	function setValue(v) {
		v = fn.gets(v);
		if (!fn.isIOS()) {
			curMonth = 	parseInt(v.substring(4,6), 10);
			curDay = 	parseInt(v.substring(6,8), 10);
			curYear = 	parseInt(v.substring(0,4), 10);
	
			refreshSign(curMonth, curDay, curYear);
			showDate();
		} else {
			v = new Date(fn.left(v,4), fn.getn(fn.mid(v,5,2)) -1, fn.right(v,2));
			$.fperiod.setValue(v);
		}
	}
	
	function showDate() {
		$.lblmonth.setText(shortMonths[curMonth - 1]);
		$.lblday.setText(curDay);
		$.lblyear.setText(curYear);
	}
	
	function getValue() {
		return getMDYWithSlash();
	}
	
	function increMonth() {
		if (isValid('iM')) curMonth = curMonth + 1;
		showDate();
	}
	
	function decreMonth() {
		if (isValid('dM')) curMonth = curMonth - 1;
		showDate();
	}
	
	function increDay() {
		if (isValid('iD')) curDay = curDay + 1;
		showDate();
	}
	
	function decreDay() {
		if (isValid('dD')) curDay = curDay - 1;
		showDate();
	}
	
	function increYear() {
		if (isValid('iY')) curYear = curYear + 1;
		showDate();
	}
	
	function decreYear() {
		if (isValid('dY')) curYear = curYear - 1;
		showDate();
	}
	
	function isValid(c) {
		var TempcurMonth = curMonth;
		var TempcurDay = curDay;
		var TempcurYear = curYear;
		var stat = true;
		
		if (c == 'iM') TempcurMonth += 1;
		if (c == 'dM') TempcurMonth -= 1;
		if (c == 'iD') TempcurDay += 1;
		if (c == 'dD') TempcurDay -= 1;
		if (c == 'iY') TempcurYear += 1;
		if (c == 'dY') TempcurYear -= 1;
		
		var TempDate = fn.right("0" + TempcurMonth,2) + "/" + fn.right("0" + TempcurDay,2) + "/" + TempcurYear;
		var d = new Date(TempDate);
		
		//reset day if the current day is higher than the number days of the month/year selected.
		if (c == 'iM' || c == 'dM' || c == 'iY' || c == 'dY') {
			if (TempcurDay > getNumOfDays(TempcurYear, TempcurMonth)) {
				curDay = 1;
				TempcurDay = 1;
			}
		}
		
		//reset day and month if user is trying to increment year to the current year and the current 
		//date combination is higher than the max date
		if (c == 'iY' && maxDate < d && TempcurYear == maxDate.getFullYear()) {
			curMonth = 1;
			curDay = 1;
			TempcurMonth = 1;
			TempcurDay = 1;
			
		}
		
		//reset day if user is trying to increment month to the current month and the current 
		//date combination is higher than the max date
		if (c == 'iM' && maxDate < d && TempcurYear == maxDate.getFullYear() && TempcurMonth == maxDate.getMonth() + 1) {
			curDay = 1;
			TempcurDay = 1;
			
		}
		
		//reformat temp date
		TempDate = fn.right("0" + TempcurMonth,2) + "/" + fn.right("0" + TempcurDay,2) + "/" + TempcurYear;
		d = new Date(TempDate);
		
		if (TempcurMonth > 12 || TempcurMonth < 1) stat = false;
		if (TempcurDay > getNumOfDays(TempcurYear, TempcurMonth) || TempcurDay < 1) stat = false;
		
		
		if (minDate > d) stat = false;
		if (maxDate < d) stat = false;
		
		if (stat == true) refreshSign(TempcurMonth, TempcurDay, TempcurYear);
		
		return stat;
	}
	
	function refreshSign(month, day, year) {
		var tempDate = fn.right("0" + month,2) + "/" + fn.right("0" + day,2) + "/" + year;
		var d = new Date(tempDate);
		var f = minDate;
		var t = maxDate;
		
		f.setHours(0,0,0,0);
		t.setHours(0,0,0,0);
		
		//init	
		//RA 2014-04-04 > Alter opacity instead of its image property
		$.mmin.opacity = 1;;
		$.dmin.opacity = 1;
		$.ymin.opacity = 1;
		$.madd.opacity = 1;
		$.dadd.opacity = 1;
		$.yadd.opacity = 1;
		
		if (f >= d) {
			$.mmin.opacity = 0.4;
			$.dmin.opacity = 0.4;
			$.ymin.opacity = 0.4;
		}
		
		if (t <= d) {
			$.madd.opacity = 0.4;
			$.dadd.opacity = 0.4;
			$.yadd.opacity = 0.4;
		}
		
		if (month >= 12) $.madd.opacity = 0.4;
		if (month <= 1)  $.mmin.opacity = 0.4;
		if (day >= getNumOfDays(year, month)) $.dadd.opacity = 0.4;
		if (day <= 1) $.dmin.opacity = 0.4;
		
		if (year >= t.getFullYear()) $.yadd.opacity = 0.4;
		if (year <= f.getFullYear()) $.ymin.opacity = 0.4;
		if (year == t.getFullYear() && month >= t.getMonth() + 1) $.madd.opacity = 0.4;
		if (year == t.getFullYear() && month == t.getMonth() + 1 && day >= t.getDate()) $.madd.opacity = 0.4;
		
	}
	
	function getNumOfDays(year, month) {
		month -= 1;
		
		var monthStart = new Date(year, month, 1);
		var monthEnd = new Date(year, month + 1, 1);
		var monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
		
		return Math.round(monthLength);
	}
	
	function getMDYWithSlash() {
		if (!fn.isIOS()) {
			return fn.right("0" + curMonth,2) + "/" + fn.right("0" + curDay,2) + "/" + curYear;
		} else {
			var v = $.fperiod.getValue(); //ex. data: Thu January 10 2013 hh:mm:ss GMT+0800 (PHT)
			var d = new Date(v);
			
			//d.getMonth() = 0 to 11
			var m = d.getMonth() + 1;
			return fn.right("0" + m,2) + "/" + fn.right("0" + d.getDate(),2) + "/" + d.getFullYear();
		}
	}
	
	function cancel() {
		$.winPicker.close();	
	}
	
	function getMonthIndex(month) {
		return shortMonths.indexOf(month);
	}
	
	
	//
	// public functions
	//
	$.init = init;
	$.setValue = setValue;
	$.getValue = getValue;
	$.getMDYWithSlash = getMDYWithSlash;
	
