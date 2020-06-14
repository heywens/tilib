/**
 * CDate
 * 
 */

	var val = new Date();
	var fn = require('tilib/core/CUtils');
	
	var months = ["January", "February", "March", "April", "May", "June", "July",
				  "August", "September", "October", "November", "December"];
	
	
	//
	//Functions
	//
	function newDate(s) {
		if (s == null || fn.isObject(s)) {
			val = new Date();
			return getYmd();
		}
		if (s != "") return sets(s);
	}
	
	function getStartOfMonth() {
		return getMdyWithSlash(
			newDate(val == null ? "" : val.getFullYear().toString() + 
				fn.right("0" + (val.getMonth() + 1).toString(), 2) +
				"01".toString()));
	}
	
	
	function getEndOfMonth() {
		return getMdyWithSlash(
			newDate(val == null ? "" : val.getFullYear().toString() + 
				fn.right("0" + (val.getMonth() + 1).toString(), 2) +
				val.getDaysInMonth().toString()));
	} 

	function getYmd() {
		return (val == null) ? "" : (val.getFullYear().toString() +
			fn.right("0" + (val.getMonth() + 1), 2) +
			fn.right("0" + val.getDate(), 2));
	}
	
	function getYmdHms() {
		return val == null ? "" : 
			String(val.getFullYear()) + 
			fn.right("0" + String(val.month + 1),2) + 
			fn.right("0" + String(val.date),2) + 
			fn.right("0" + String(val.hours),2) +  
			fn.right("0" + String(val.minutes),2) + 
			fn.right("0" + String(val.seconds),2);
	}
	
	
	function getToday() {
		return new Date();
	}
	
	function setFullDate(v) {
		if (v == null) {
			val = new Date();
			return getYmd();
		}
		
		val = new Date(fn.mid(v,5,2) + '/' +
					fn.mid(v,7,2) + '/' +
					fn.mid(v,1,4) + " " +
					fn.mid(v,9,2) + ':' +
					fn.mid(v,11,2) + ':' +
					fn.mid(v,13,2));
		return val;
	}
	
	function getMdyWithSlash() {
		return val == null ? "" : fn.right("0" + (val.getMonth() + 1).toString(), 2) + "/" +
			fn.right("0".toString() + (val.getDate()).toString(), 2) + "/" +
			(val.getFullYear()).toString();
	}
	
	
	function getMdWithSlash() {
		return val == null ? "" : fn.right("0" + (val.getMonth() + 1).toString(), 2) + "/" +
			fn.right("0".toString() + (val.getDate()).toString(), 2);
	}
	
	
	function sets(v) {
		v += ""; //convert to string		
		
		//Wed May 22 2013 00:00:00 GMT+0800 (PHT)
		if (v.toString().length > 30) {
			var d = new Date(v);
			v = d.getFullYear() + "" + (d.getMonth() + 1) + "" + d.getDate() 
					+ "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds(); // YYYYMMDDhhmmss
			
			if (fn.right(v, 6) == '000000') {
				v = fn.left(v,8); // let's get only YYYYMMDD
			}
		}
		
		// MM/DD/YYYY
		if (fn.pos(v,'/') > 0 && fn.mid(v,3,1) == '/' && fn.mid(v,6,1) == '/') {
			v = fn.mid(v,1,2) + "/" +  fn.mid(v,4,2) + "/" + fn.mid(v,7,4);
		}
		// YYYY/MM/DD
		if (fn.pos(v,'/') > 0 && fn.mid(v,5,1) == '/' && fn.mid(v,8,1) == '/') {
			v = fn.mid(v,1,4) + "/" +  fn.mid(v,6,2) + "/" + fn.mid(v,9,2);
			
		} else {
			
			if (fn.pos(v,"-") > 0 ) {
				v = fn.searchReplace(v,"-","/");
			}
			
			//YYYYMMDDhhmmss
			if (v.length == 14) {
				val = new Date(fn.getn(fn.mid(v,5,2)) + '/' +
							fn.getn(fn.mid(v,7,2)) + '/' +
							fn.getn(fn.mid(v,1,4)) + ' ' +
							fn.getn(fn.mid(v,9,2)) + ':' +
							fn.getn(fn.mid(v,11,2)) + ':' +
							fn.getn(fn.mid(v,13,2)));
				return val;
			} 
			//YYYYMMDD
			else if (v.length == 8) {
				val = new Date(fn.getn(fn.mid(v,5,2)) + '/' +
							fn.getn(fn.mid(v,7,2)) + '/' +
							fn.getn(fn.mid(v,1,4)) + ' ');

				return val;
			} else if (fn.pos(v,"/") == 0) {
				
				//MMDDYYYY
				if (v.length == 8 && fn.getn(fn.mid(v,5,4)) >= 2000)  
					v = fn.mid(v,3,2) + "/" + fn.mid(v,1,2) + "/" + fn.mid(v,5,4);
				else  
					v = fn.mid(v,5,2) + "/" + fn.mid(v,7,2) + "/" + fn.mid(v,1,4);
			}
		}
		
		val = (v == null) ? null : new Date(v);
		return val;
	}
	
	
	function dateAdd(datePart, number, date) {
		if (date == null) {
			date = new Date();
		}
		
		var returnDate = new Date(date);
		
		switch (datePart.toLowerCase()) {
			case "fullyear" :
				return returnDate.addYear(number);
			case "month" :
				return returnDate.addMonths(number);
			case "date":
				return returnDate.addDays(number);
            case "hours":
            	return Date.add(returnDate, Ext,Date.HOUR, number);
            case "minutes":
            	return Date.add(returnDate, Ext,Date.MINUTE, number);
            case "seconds":
            	return Date.add(returnDate, Ext,Date.SECOND, number);
            case "milliseconds":
            	return Date.add(returnDate, Ext,Date.MILLI, number);
            default:
                /** Unknown date part, do nothing. */
            	return returnDate;
                break;
        }
	}
	
	Date.prototype.addDays = function(days) {
	    this.setDate(this.getDate() + days);
	    return this;
	};
	
	Date.prototype.addYear = function(years) {
	    this.setDate(this.getFullYear() + years);
	    return this;
	};
	
	Date.isLeapYear = function (year) { 
	    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
	};
	
	Date.getDaysInMonth = function (year, month) {
	    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	};
	
	Date.prototype.isLeapYear = function () { 
	    var y = this.getFullYear(); 
	    return (((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0)); 
	};
	
	Date.prototype.getDaysInMonth = function () { 
	    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
	};
	
	Date.prototype.addMonths = function (value) {
	    var n = this.getDate();
	    this.setDate(1);
	    this.setMonth(this.getMonth() + value);
	    this.setDate(Math.min(n, this.getDaysInMonth()));
	    return this;
	};
	
	function addMonths(n) {
		if (n == null || n == 0) return;
		val = dateAdd("month", n, val);
	}
	
	function addDays(n) {
		if (n == null || n == 0) return;
		val = dateAdd("date", n, val);
	}
	
	function addMinutes(n) {
		if (n == null || n == 0) return;
		val = dateAdd("minutes", n, val);
	}
	
	function sGetStartOfMonth() {
		newDate();
		val = sets(getStartOfMonth());
		return getMdyWithSlash();
	}
	
	function sGetToday() {
		newDate();
		return getMdyWithSlash();
	}
	
	function getMonthIndex(month) {
		return months.indexOf(month);
	}
	
	function getMonthName(idx) {
		idx = fn.getn(idx) - 1;
		if (idx < 0 || idx > 12) return "";				
		return months[idx];
	}
	
	function getMonthShortName(idx) {
		return getMonthName(idx).substr(0,3);
	}	
	
	function getDmyWithDash(v) { //accepts string in MM/DD/YYYY format
		if (v == null || v == "") {
			return "";
		}
		
		var day = fn.getn(fn.mid(v,4,2));
		day = day < 10 ? fn.right(day,1) : day;
		return day + "-" + getMonthName(fn.left(v,2)) + "-" + fn.right(v,4);
	}
	
	function getDateWithDash() {
		if (v == null || v == "") {
			v = newDate("");
			v = getMdyWithSlash();
		}
		
		var day = fn.getn(fn.mid(v,4,2));
		day = day < 10 ? fn.right(day,1) : day;
		return day + "-" + getMonthName(fn.left(v,2)) + "-" + fn.right(v,4);
	}
	
	
	function format(v, format) {
		switch (format) {
			// case "YmdHis":
				// return
		}
	}
	
	
	function createRange(number, date) {
		if (date == null) {
			date = new Date();
		}
		
		var pDate;
		
		pDate = dateAdd('date', number, date);
		
		return {
			label 	: months[pDate.getMonth()].substring(0,3) + ' ' + pDate.getDate() + ' - ' + months[date.getMonth()].substring(0,3) + ' ' + date.getDate() + ', ' + date.getFullYear(),
			data 	: pDate.getFullYear() + fn.right("0" + String(pDate.getMonth() + 1),2) + fn.right("0" + String(pDate.getDate()),2) + ',' + date.getFullYear() + fn.right("0" + String(date.getMonth() + 1),2) + fn.right("0" + String(date.getDate()),2),
			bDate 	: pDate,
			eDate 	: date
		};
		
	}
	

	//
	//public
	//
	exports.newDate = newDate;
	exports.getStartOfMonth = getStartOfMonth;
	exports.getEndOfMonth = getEndOfMonth;
	exports.getYmd = getYmd;
	exports.getYmdHms = getYmdHms;
	exports.getToday = getToday;
	exports.setFullDate = setFullDate;
	exports.getMdyWithSlash = getMdyWithSlash;
	exports.getMdWithSlash = getMdWithSlash;
	exports.sets = sets;
	exports.dateAdd = dateAdd;
	exports.addMonths = addMonths;
	exports.addDays = addDays;
	exports.addMinutes = addMinutes;
	exports.sGetStartOfMonth = sGetStartOfMonth;
	exports.sGetToday = sGetToday;
	exports.getMonthIndex = getMonthIndex;
	exports.getMonthName = getMonthName;
	exports.getMonthShortName = getMonthShortName;
	exports.getDmyWithDash = getDmyWithDash;
	exports.getDateWithDash = getDateWithDash;
	exports.createRange = createRange;
