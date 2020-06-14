	//copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};
	var fn = require('tilib/core/CUtils');
	
	var mSelectedIndex = -1;
	var mPages = [];
	var mAddedIndex = [];
	var mTabItems = [];
	var tabFunc = [];
	var tabView = [];
	var tabCtrl = [];
	var tabChangeCb = null;
	
	var mHeaderHeight = 0;
	
	updateLayout();
	
	function setTab(tabItems) {		
		mTabItems = tabItems;
		
		var tabLen = tabItems.length;
		var tabwidth = 100 / tabLen;
		var tabInd = [];
		var tabIndLabel = [];
		var tabIndLabelv = [];
		var tabIndLeftImage = [];
		var tabIndLeftImagev = [];
		
		for (var i = 0; i < tabLen; i++) {
			
			var withImage = true;
			var withTitle = true;
			
			if (!tabItems[i]['leftIco']) withImage = false;
			if (!tabItems[i]['title']) 	 withTitle = false;
			
			var mWidth = (tabwidth + '%');
			if (fn.isIOS() && (i == (tabLen - 1))) { 
				mWidth = Ti.UI.FILL;
			}
			
			tabInd[i] = Ti.UI.createView({
				id : "tab" + i,
				backgroundColor : "#363637",
				width : mWidth,
				height : Ti.UI.FILL,
				borderColor : "#000000",
				borderWidth : 0.5,
				layout : "composite"
			});
			
			if (fn.isMobileWeb())
				tabInd[i].borderWidth = 1;	
			
			
			//add image to tabs
			if (withImage) {
				tabIndLeftImage[i] = Ti.UI.createLabel({
					id : "ico" + i,
					text : tabItems[i]['leftIco'],
					width : Ti.UI.SIZE,
					height : Ti.UI.SIZE,
					color : "#fff",
					
					font : {
						fontFamily : "HqTi",
						fontSize : "30dp"
					}
				});
				
				if (withTitle) tabIndLeftImage[i].top = 5;
				tabInd[i].add(tabIndLeftImage[i]);
			}
			
			//add text to tabs
			if (withTitle)  {
				tabIndLabel[i] = Ti.UI.createLabel({
					id : "tit" + i,
					text : tabItems[i]['title'],
					left : 0,
					color : "#FFFFFF",
					width : "100%",
					textAlign : "center",
					height : Ti.UI.SIZE,
					
					font: {
						fontSize : withImage ? "12dp" : "14dp"
					}
				});
				
				if (withImage) tabIndLabel[i].bottom = 0,
				tabInd[i].add(tabIndLabel[i]);
			}
			
			
			
			
			tabInd[i].addEventListener('touchstart', function(e) {
				clickTab(this.id.substring(3));
			});
			
			$.tabMenu.add(tabInd[i]);
		}
	}
	
	function setPage(tabPages, idx) {
		idx = idx || 0;
		tabFunc = tabPages;
		
		var j = tabPages.length;
		for (var i = 0; i < j; i++) {
			tabView[i] = null;
		}
		
		refresh();
		clickTab(idx);
	}
	

	function clickTab(tabIndex, param) {
		param 	= param || null;
		
		if (tabView[tabIndex] == null) {
			var tabTemp = tabFunc[tabIndex]();
			
			if (tabTemp instanceof Array) {
				tabView[tabIndex] = tabTemp[0];
				tabCtrl[tabIndex] = tabTemp[1];
			} else {
				tabView[tabIndex] = tabTemp;
			}
			
			$.tabBody.add(tabView[tabIndex]);
			mAddedIndex[tabIndex] = $.tabBody.children.length - 1;
		} 
		
		$.tabBody.children[mAddedIndex[tabIndex]].visible = true;
		$.tabBody.children[mAddedIndex[tabIndex]].show();
		$.tabMenu.children[tabIndex].backgroundColor = "#000000";
		
		if (mSelectedIndex >= 0 && mSelectedIndex != tabIndex) {
			$.tabBody.children[mAddedIndex[mSelectedIndex]].visible = false;
			$.tabBody.children[mAddedIndex[mSelectedIndex]].hide();
			$.tabMenu.children[mSelectedIndex].backgroundColor = "#363637";	
		}
		
		mSelectedIndex = tabIndex;
		updateLayout();
		
		if (param != null) clickTabFunc(tabIndex, param);
		if (tabChangeCb != null) tabChangeCb(tabIndex);
	}
	
	function getViewIndex(idx) {
		/*
		for (var i = 0; i < $.tabBody.children.length; i++) {
			if (mPages[idx].mAddedIndex == i) return i;
		}
		return -1;
		*/
	}
	
	function init(params) {
		params = params || {};
		
		if (params["tabs"] != null) 
			setTab(params["tabs"]);
			
		mHeaderHeight = fn.getn(params["headerHeight"]) || 0;	
	}
	
	
	function setActiveTab(idx) {
		clickTab(fn.getn(idx));
	}
	
	function redraw() {
		mSelectedIndex = -1;
		mAddedIndex = [];
	}
	
	function refresh() {
		fn.removeAllChildren($.tabBody);
		
		var len = mTabItems.length;
		for (var i = 0; i < len; i++) {
			$.tabMenu.children[i].backgroundColor = "#363637";
		}
		
		redraw();
	}
	
	function updateLayout() {
		var mDeviceHeight = fn.getDeviceHeight();
		var bHeight = mDeviceHeight - fn.getStatusBarHeight() - mHeaderHeight - 110; //50 (nav height) + 60 (tab bar height)
		$.tabBody.top = 0;
		
		if (fn.isIOS()) {
			$.tabBar.top = bHeight;
			$.tabBody.height = bHeight;			
			$.tabBody.bottom = 0;
		} 
		
		if (fn.isMobileWeb()) {
			$.tabBody.height = 100 * ((fn.getbHeight() + 35) / fn.getDeviceHeight()) + "%";
		} 
		
		if (fn.isAndroid()) {
			$.tabBody.height = 100 * ((fn.getbHeight() - mHeaderHeight + 40) / fn.getDeviceHeight()) + "%";
		}
		
		
		setTimeout(function() {
			fn.closeSplash();
		}, 800);
	}
	
	function clickTabFunc(tabID, param) {
		tabCtrl[tabID].clickTabCB(param);
	}

	//
	//Public functions
	//
	$.setTab = setTab;
	$.setPage = setPage;
	$.init = init;
	$.setActiveTab = setActiveTab;
	$.redraw = redraw;
	$.clickTab = clickTab;
	$.clickTabFunc = clickTabFunc;

	exports.cleanUp = function() {
		
	};
	
	exports.getSelectedIndex = function() {
		return mSelectedIndex;
	};
	
	exports.setTabChangeCb = function(cb) {
		tabChangeCb = cb;
	};
