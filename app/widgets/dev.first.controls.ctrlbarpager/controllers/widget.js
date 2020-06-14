/**
 * RBA 2014-03-12
 * 
 */

	var fn = require('tilib/core/CUtils');
	

	//Paging properties
	var mStart = 0,
		mEnd = 0,
		mTotal = 0,
		mMaxLines = 0,
		mHeader = "",
		mPageUp = 0,
		mPageDown = 0;
		
	var winList = null;
	var options = [];
	processOptions = null;
	optionTitle = "";
	contList = null;
	
	var ctrlOptions = null;
	
	
	//
	// Event listener
	//
	$.btnBack.addEventListener('touchstart', pageUp);
	$.btnForward.addEventListener('touchstart', pageDown);
	$.btnOptions.addEventListener('touchstart', showOptions);
	
	function init(args) {
		reset();
		args = args || {};
		
		winList = args["mainWindow"];
		contList = args["listView"];
		processOptions = args["optionsCb"];
		options = args["options"] || [];
		$.resultHandler = args["resultHandler"];
		
		var headerHeight = fn.getn(args["headerHeight"]) || 0;
		
		if (fn.isIOS()) {
			$.ctrlbar.top = fn.getbHeight() - headerHeight;
			
			if (contList == null) return;
			contList.top = 0;
			contList.height = 100 * ((fn.getbHeight() + 35) / fn.getDeviceHeight()) + "%";
		} 
		
		if (options.length == 1) $.btnOptions.text = options[0].leftIco;
		
		var isOptionVisible = options.length > 0;
		$.oView1.width = isOptionVisible ? "75%" : (100 - (100 * (20 / fn.getDeviceWidth()))) + "%";
		$.btnOptions.visible = isOptionVisible;
		$.btnOptions.width = isOptionVisible ? 40 : 0;
	}
	
	function pageUp() {
		if (mStart <= 1) return;
		
		fn.splashMessage("Please wait, retrieving data...");
		
		if (winList == null) return;
		var mFilter = winList.mFilter || {};
		mFilter["fstart"] = fn.gets(mPageUp);  
		winList.searchRecordFunc(mFilter,$.resultHandler);
	}
	
	function pageDown() {
		if (mEnd >= mTotal) return;
		
		fn.splashMessage("Please wait, retrieving data...");
		
		if (winList == null) return;
		var mFilter = winList.mFilter || {};
		mFilter["fstart"] = fn.gets(mPageDown);  
		winList.searchRecordFunc(mFilter,$.resultHandler);
	}
	
	function setPage(start, end, total, maxlines) {
		start = fn.getn(start);
		end = fn.getn(end);
		total = fn.getn(total);
		maxlines = fn.getn(maxlines);
		
		maxlines = maxlines || 100;
		mStart = start;
		mEnd = end;
		mTotal = total;
		mMaxLines = maxlines;
		
		mPageUp = start - maxlines;
		
		if (mPageUp < 0) mPageUp = 0;
		
		if (end >= total)
			mPageDown = start;
		else 
			mPageDown = end + 1;
			
		$.lblPage.setText(mStart + "-" + mEnd + " of " + mTotal);	
		
		
		var backEnabled = mStart > 1;
		var forwardEnabled = mEnd < mTotal;
		
		$.btnBack.opacity = backEnabled ? 1 : 0.2;
		$.btnForward.opacity = forwardEnabled ? 1 : 0.2;
	}
	
	function showOptions() {
		if (options.length == 1) {
			if (processOptions != null) processOptions("0");
			return;	
		}
		
		if (ctrlOptions == null) { 
			ctrlOptions = Alloy.createWidget('dev.first.forms.options');
			
			ctrlOptions.init({
				title : optionTitle,
				option : options,
				cancel : 1,
				cb : processOptions
			});	
		}

		ctrlOptions.show();		
	}
	
	function reset() {
		mStart = 0;
		mEnd = 0;
		mTotal = 0;
	}
	
	function setVisible(b) {
		b = fn.getb(b);
		$.ctrlbar.visible = b;
		$.ctrlbar.height = b ? 50 : 0;
		
		if (b) $.ctrlbar.show();
		else   $.ctrlbar.hide();	
	}
	

	//
	// Public functions
	//
	exports.init = init;
	exports.setPage = setPage;
	exports.setVisible = setVisible;
	
	exports.cleanUp = function() {
		$.btnBack.removeEventListener('touchstart', pageUp);
		$.btnForward.removeEventListener('touchstart', pageDown);
		$.btnOptions.removeEventListener('touchstart', showOptions);
		
		fn.removeChildren($.ctrlbar);
		
		fn = null;
		mStart = null;
		mEnd = null;
		mTotal = null;
		mMaxLines = null;
		mHeader = null;
		mPageUp = null;
		mPageDown = null;
		winList = null;
		options = null;
		processOptions = null;
		optionTitle = null;
		contList = null;
		ctrlOptions = null;
	};
	