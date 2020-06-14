/**
 * WinSearch
 * IRRA 2014-02-07
 */

	var fn = require('tilib/core/CUtils');
	
	//copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};
	
	var keyNames = "";
	var sKeys = [];
	var mDataProvider = [];
	var cbSearch = null;
	var pWidth = fn.getDeviceWidth();
	
	$.mSelectedItem = null;
	
	$.winSearch.top = fn.getStatusBarHeight();
	$.btnClear.visible = false;
	
	//
	// Event listener
	//
	$.btnCancel.addEventListener('touchstart', cancel);
	$.tblView.addEventListener('click', selectRecord);
	$.fkeyword.addEventListener('change', onChange);
	$.btnClear.addEventListener('touchstart', clear);
	$.btnSearch.addEventListener('touchstart', search);
	$.btnReset.addEventListener('touchstart', reset);
	
	
	$.vSearch.width = (100 - ((60 / pWidth) * 100)) + "%";
	$.fkeyword.width = (100 - ((50 / pWidth) * 100)) + "%";
	if (fn.isAndroid()) {
		$.winSearch.addEventListener('androidback', cancel);
		
		$.vSearch.width = (100 - ((120 / pWidth) * 100)) + "%";
		$.vSearch.borderRadius = 40;
		$.fkeyword.width = (100 - ((80 / pWidth) * 100)) + "%";
	}
	
	if (fn.isIOS()) {
		$.tblView.height = 100 * ((fn.getbHeight() + 50) / fn.getDeviceHeight()) + "%";
	}
	
	
	//
	// Private functions
	//
	function init(_args) {
		var title = _args["label"] || "";
		keyNames = _args["keyNames"];
		sKeys = keyNames.split(",");
		cbSearch = _args["helpSelect"];
		
		$.winSearch.mFilter = _args["mFilter"] || {};
		$.winSearch.mFilter.fkeyword = $.fkeyword.value;
		$.winSearch.searchRecordFunc = cbSearch;
		
		$.ctrlbar.init({
			mainWindow: $.winSearch,
			listView: $.tblView,
			headerHeight : 60,
			
			resultHandler: populate
		});	
		
		$.lblTitle.setText(title);
	}
	
	function open() {
		$.winSearch.setZIndex(3);
		$.winSearch.open();		
	}
	
	function populate(e) {
		if (!fn.errorHandling(e)) {
			clearList();
			return;
		}
		
		var data = [];
		var n = 0;
		
		var mList = fn.stringifyArray(e.data.list) || [];
		var skeyLen = sKeys.length;
		var len = mList.length;
		
		//Control paging here
		var isPagerVisible = !fn.isEmpty(e.data.fstart);
		
		$.ctrlbar.setVisible(isPagerVisible);
		$.tblView.height = isPagerVisible 
			? (100 - (100 * ((fn.getStatusBarHeight() + 160) / fn.getDeviceHeight())) + "%")
			: Ti.UI.FILL;
			
		if (isPagerVisible) 
			$.ctrlbar.setPage(e.data.fstart,e.data.fend,e.data.ftotal,e.data.fmaxlines);
		
		for (var i = 0; i < len; i++) {
			var p = mList[i];
			var o = {};
			
			for (var j = 0; j < skeyLen; j++) {
				var key = sKeys[j];
				if (p.hasOwnProperty(key)) {
					o[key] = p[key];
				}
			}
			
			data.push(o);
			n++;
		}
		
		mDataProvider = data;
		setData(data);
	}
	
	function setData(data) {
		var mDataProvider = [];
		
		var len = data.length;
		for (var i = 0; i < len; i++) {
			var p = data[i];
			
			var row = Ti.UI.createTableViewRow({
				backgroundColor: "#FFFFFF",
				className: "mList"
			});
			
			if (fn.isIOS())
				row.selectedBackgroundColor = "#B40026";
			else
				row.backgroundSelectedColor = "#B40026";
			
			//styles/row config here
			//table view row contents
			var mView = Ti.UI.createView({
				layout : "composite",
				height : Ti.UI.SIZE,
				width : "100%"
			});
			
			if (!fn.isIOS()) {
				mView.focusable = true;
				mView.backgroundSelectedColor = "#b40026";
				mView.backgroundFocusedColor = "#b40026";
			}
				
			var dataview = Ti.UI.createView({
				layout : "vertical",
				height : Ti.UI.SIZE,
				width : "100%",
				left : 10,
				top : 10,
				bottom : 10
			});
			
			if (fn.gets(p[sKeys[0]]) != "") { 
				var lblKey1 = Ti.UI.createLabel({
					text : fn.gets(p[sKeys[0]]),
					color : "#000000",
					width : "100%",
					height : Ti.UI.SIZE,
					touchEnabled: false,
					
					font : {
						fontSize : "16dp",
						fontWeight : "bold",
						fontFamily: fn.os({
							ios:'Open Sans',
							iphone:'Open Sans',
				            ipad: 'Open Sans',
				            ipod: 'Open Sans',
				            android:'OpenSans-Bold',
				            mobileweb: 'Open Sans'
						})
					}
				});
				dataview.add(lblKey1);
			}
			
			
			if (fn.gets(p[sKeys[1]]) != "") {
				var lblKey2 = Ti.UI.createLabel({
					text : fn.gets(p[sKeys[1]]),
					color : "#000000",
					width : "100%",
					height : Ti.UI.SIZE,
					touchEnabled : false,
					
					font : {
						fontSize : "16dp",
						fontFamily: fn.os({
							ios:'Open Sans',
							iphone:'Open Sans',
				            ipad: 'Open Sans',
				            ipod: 'Open Sans',
				            android:'OpenSans-Regular',
				            mobileweb: 'Open Sans'
						})
					}
				});
				dataview.add(lblKey2);
			}
			
			if (fn.gets(p[sKeys[2]]) != "") { 
				var lblKey3 = Ti.UI.createLabel({
					text : fn.gets(p[sKeys[2]]),
					color : "#000000",
					width : "100%",
					height : Ti.UI.SIZE,
					touchEnabled : false,
					
					font : {
						fontSize : "16dp",
						fontFamily: fn.os({
							ios:'Open Sans',
							iphone:'Open Sans',
				            ipad: 'Open Sans',
				            ipod: 'Open Sans',
				            android:'OpenSans-Regular',
			            	mobileweb: 'Open Sans'
						})
					}
				});
				
				
				dataview.add(lblKey3);
			}
			
			if (!fn.isEmpty(fn.gets(p[sKeys[3]]))) {
				var lblKey4 = Ti.UI.createLabel({
					text : fn.gets(p.sKeys[3]),
					color : "#000000",
					width : "100%",
					height : Ti.UI.SIZE,
					touchEnabled : false,
					
					font : {
						fontSize : "16dp",
						fontFamily: fn.os({
							ios:'Open Sans',
							iphone:'Open Sans',
				            ipad: 'Open Sans',
				            ipod: 'Open Sans',
				            android:'OpenSans-Regular',
			            	mobileweb: 'Open Sans'
						})
					}
				});
				
				dataview.add(lblKey4);
			}
			
			mView.add(dataview);
			row.add(mView);
			mDataProvider.push(row);
		}
		
		$.tblView.setData(mDataProvider);
		fn.closeSplash();
	}
	
	function cancel() {
		blur();
		$.winSearch.close();
		
		$.fkeyword.value = "";
		toggleClear("");
	}
	
	function selectRecord(e) {
		blur();
		$.winSearch.close();
		
		$.fkeyword.value = "";
		$.btnClear.visible = false;
		
		$.mSelectedItem = mDataProvider[e.index];
		
		if ($.selectRecord != null)
			$.selectRecord($.mSelectedItem);
			
		clearList();	
	}
	
	
	function search() {
		fn.splashMessage("Please wait, processing request...");
		blur();		
		
		if (cbSearch != null) {
			$.winSearch.mFilter.fkeyword = $.fkeyword.value;
			cbSearch($.winSearch.mFilter, populate);
		}
	}

	function onChange(e) {
		toggleClear(fn.gets(e.value));
	}
	
	function toggleClear(v) {
		if (v.length == 0) {
			$.btnClear.visible = false;
			return;
		}
		
		if ($.btnClear.visible) return; //no need to toggle
		$.btnClear.visible = true; 
	}
	
	function clear() {
		$.fkeyword.value = "";
		$.btnClear.visible = false;
		blur();
	}
	
	function blur() {
		if (fn.isAndroid())
			Ti.UI.Android.hideSoftKeyboard();
		else		
	    	$.fkeyword.blur();
	}
	
	function clearList() {
		mDataProvider = [];
		setData([]);
	}
	
	function reset() {
		$.winSearch.close();
		$.fkeyword.value = "";
		toggleClear("");
		
		$.mSelectedItem = {};
		
		if ($.selectRecord != null)
			$.selectRecord($.mSelectedItem);
			
		clearList();	
	}
	
	
	// Public functions
	//
	$.init = init;
	$.populate = populate;
	$.open = open;
	
	$.onSelectRecord = function(cb) {
		$.selectRecord = cb;
	};
