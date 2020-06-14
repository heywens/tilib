/**
 * Navigation Group
 * RA 2014-02-04
 *  
 */	
	
	var fn = require('tilib/core/CUtils');
	var slideWidth = 150;
	var pWidth = fn.getDeviceWidth();
	var pHeight = fn.getDeviceHeight();
	var init = null;
	var mSelectedIndex = 0;
	var menuClickCb = null;
	var tmpIndex = 0;
	
	var animateSelect = Ti.UI.createAnimation({
		curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration : 100,
		backgroundColor : "#B40026",
		autoreverse : true
	});
	
	if (fn.isIOS()) { 
		$.menuView.top = fn.getStatusBarHeight();
		$.contentView.top = fn.getStatusBarHeight();
		$.mFooter.selectedBackgroundColor = "#B40026";
		$.mFooter.top = (100 - (((40 + fn.getStatusBarHeight()) / pHeight) * 100)) + "%";
	}	
	
	
	//copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};
	
	//navigation properties
	var title = _args["title"] || "";
	var leftIco = _args["leftIco"] || "";
	var rightImage = _args["rightIco"] || "";
	var isMenu = false;
	var prevWindow = [];
	var prevWinTitle = [];
	var prevLeftButton = [];
	var prevBackButtonTitle = [];
	var prevRightButton = [];
	var prevIsMenu = [];
	var prevSetLeftNavClick = [];
	var prevSetRightNavClick = [];
	var navGuard = 0;
	
	toggleLeftNavButton(leftIco);
	toggleRightNavButton(rightImage);
	
	$.winTitle.setText(title);
	
	
	//Menu properties
	var menuWidth = _args["menuWidth"] || 250;
	var animateDuration = _args["animateDuration"] || 200;
	
	var animateMenu = Ti.UI.createAnimation({
		left : 0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration : animateDuration
	});
	
	
	$.menuTable.width = menuWidth;
	$.menuView.width = menuWidth;
	$.vTop.height =  (100 - fn.round2(((40 + fn.getStatusBarHeight()) / pHeight) * 100)) + "%";
	
	
	//Menu event properties
	var touchStartX = 0;
	var touchRightStarted = false;
	var touchLeftStarted = false;
	var buttonPressed = false;
	var hasSlided = false;
	var direction = "reset";
	var isMenuOpen = false;
	
	
	//event listeners
	var leftEvt = $.leftButtonView.addEventListener("touchstart", leftnavClick);
	var backEvt = $.backButtonTitleView.addEventListener("touchstart", backButtonClick);
	var rightEvt = $.rightButtonView.addEventListener("touchstart", rightnavClick);
	var menuEvt = $.menuTable.addEventListener("click", menuclick);
	
	var swipeEvt = $.menuView.addEventListener('swipe',swipeMenu);
	var navSwipeEvt = $.nav.addEventListener('swipe',swipeMenu);
	
	if (fn.isAndroid())
		var backEvt = $.mainWindow.addEventListener('androidback', handleAndroidBack);
		
	var footerEvt = $.mFooter.addEventListener('touchstart', logout);	
	
	setMenuIco("=");
	
	
	var memPool = Ti.UI.createWindow({width:1, height:1});
	memPool.open();
	memPool.hide();
	memPool.close();
		
	//
	// Functions
	//
	function toggleLeftNavButton(iconText) {
		var hasIcoText;

		if (iconText) hasIcoText = true;
		else hasIcoText = false;

		$.icoLeftButton.text = hasIcoText ? iconText : ""; 
		$.icoLeftButton.visible = hasIcoText;
		
		$.leftButtonView.visible = hasIcoText;
		$.leftButtonView.width = hasIcoText ? 50 : 0;
		$.leftButtonView.height = hasIcoText ? 50 : 0;
		
		$.backButtonTitleView.visible = !hasIcoText;
		$.backButtonTitleView.width = hasIcoText ? 0 : "25%";
	}
	
	function toggleRightNavButton(iconText) {
		var hasIcoText = fn.gets(iconText) != "";
		
		$.icoRightButton.text = hasIcoText ? iconText : ""; 
		$.icoRightButton.visible = hasIcoText;
		
		if (hasIcoText) { 
			var isIconFont = hasIcoText.length == 1;
			
			$.icoRightButton.width = isIconFont ? 40 : Ti.UI.SIZE;
			
			if (isIconFont) {
				$.icoRightButton.font = {
					fontSize : "30dp",
					fontFamily: "HqTi"
				};
			} else { 
				$.icoRightButton.font = {
					fontSize : "16dp",
					fontFamily: fn.os({
						iphone:'Open Sans',
			            ipad: 'Open Sans',
			            ipod: 'Open Sans',
			            android:'OpenSans-Regular',
			            mobileweb: 'Open Sans'
					}) 
				};
			}
		}
		
		$.rightButtonView.visible = hasIcoText;
		$.rightButtonView.width = hasIcoText ? Ti.UI.SIZE : 0;
		$.rightButtonView.height = hasIcoText ? 50 : 0;
	}
	
	function setBackButton(title) {
		title = title || '';
		
		$.icoLeftButton.text = "";
		$.icoLeftButton.visible = false; 
		$.leftButtonView.visible = false;
		$.leftButtonView.width = 0;
		$.leftButtonView.height = 0;
		
		$.backButtonTitleView.visible = true;
		$.backButtonTitleView.width = "25%";
		$.backButtonTitleView.left = 0;
		
		$.backButtonTitle.text = title;
		/**
		if (fn.isMobileWeb() || fn.isIOS()) {
			var dWidth = fn.getDeviceWidth();
			var vWidth = (dWidth * .25) - $.backButtonTitle.left;
			var lWidth = (Math.floor(vWidth/9)) - 1;

			var STitle = title.substring(0,lWidth);
			
			if (title.length > STitle.length + 3) 
				$.backButtonTitle.text = fn.trimStartEnd(STitle) + '...';
			else 
				$.backButtonTitle.text = title;
		} else {
			$.backButtonTitle.text = title;
		}
		*/
		
		isMenu = false;
	}
	
	function toggleSlideMenu() {
		isMenuOpen = false;
		
		toggleSlide({
			hasSlided : hasSlided,
			direction : direction
		});
	}
	
	
	function toggleSlide(e) {
		animateMenu.left = (e.direction == "left") ? menuWidth : 0;
		$.contentView.animate(animateMenu);
	}
	
	function leftnavClick(e) {
		if (isMenu) {
			if (isMenuOpen) {
				toggleSlide({direction:"right"});	
				isMenuOpen = false;
				
			} else {
				toggleSlide({direction:"left"});
				isMenuOpen = true;
			}
		}
		
		if ($.leftNavClick != null)
			$.leftNavClick(e);
			
	}
	
	function swipeMenu(e) {
		if (isMenu) {
			if (isMenuOpen && e.direction == 'right') {
				toggleSlide({direction:"right"});	
				isMenuOpen = false;	
			} 
			
			if (!isMenuOpen && e.direction == 'left') {
				toggleSlide({direction:"left"});
				isMenuOpen = true;
			}
		}
		
	}
	
	function backButtonClick() {
		if (navGuard > 0) {			
			var clen = $.mainView.children.length; 
			if (clen <= 0) return;
			
			//remove open page
			var pwindow = $.mainView.children[clen-1];
			
			//open the last window closed
			if (prevWindow[navGuard] != null) {
				prevWindow[navGuard].visible = true;
				prevWindow[navGuard].right = $.mainView.size.width * 2;
				prevWindow[navGuard].left = -$.mainView.size.width;
				prevWindow[navGuard].top = 0;
				prevWindow[navGuard].show();
				transition(pwindow ,prevWindow[navGuard], "back");
			}
			
			$.mainView.setWidth("100%");
			$.mainView.height = Ti.UI.FILL;
		}
	}
	
	
	function rightnavClick(e) {
		if ($.rightNavClick != null) { 
			$.rightNavClick(e);
		}
	}
	

	function openView(e) {
		var cbAdd = function() {
			reset();
			
			var ctrl = Alloy.createController(e["url"]);
			
			if (ctrl != null) {
				setWindowTitle(e["wTitle"]);
				setRightIco(ctrl.getRightIco());
				
				$.setRightNavClick(ctrl.getRightNavCb());
				ctrl.winMain.navGroup = $;
				
				ctrl.winMain.addEventListener("postlayout", postLayout);
				$.mainView.add(ctrl.winMain);
				
				ctrl.init();
				ctrl = null;	
			}
		};
		
		fn.splashMessage("Please wait, processing request...");
		if ($.mainView.children.length > 0) {
			//$.mainView.children[0].cleanUp();
			cleanUp($.mainView.children[0]);
			fn.removeChildren($.mainView, cbAdd);
			 
		} else
			cbAdd();
	}
	
	function cleanUp(obj, cb) {
		if (obj != null) { 
			memPool.open();
			memPool.hide();
			memPool.setZIndex(-1);
			memPool.add(obj);
			memPool.close();
		}
		
		obj = null;
		if (cb != null) cb();
	}
	
	function postLayout(e) {
		setTimeout(function() {
			fn.closeSplash();
		},100);
	}
	
	
	function openWindow(url, args) {
		var ctrl = Alloy.createController(url);
		if (ctrl == null) return;
		
		var args = args || {};
		var parentTitle = "";
		var childNum = $.mainView.children.length;
		
		navGuard++;
		
		if ($.mainView.children.length > 0) {
			var parentWindow = $.mainView.children[childNum-1];
			
			if (parentWindow != null) {
				parentTitle = "Back"; //$.winTitle.text || '';
				prevWindow[navGuard] = parentWindow;
				prevWinTitle[navGuard] = $.winTitle.text || '';
				prevLeftButton[navGuard] = $.icoLeftButton.text || '';
				prevBackButtonTitle[navGuard] = $.backButtonTitle.text || '';
				prevRightButton[navGuard] = $.icoRightButton.text  || '';
				prevSetLeftNavClick[navGuard] = $.leftNavClick;
				prevSetRightNavClick[navGuard] = $.rightNavClick;
				
				if (prevBackButtonTitle[navGuard] != '') prevIsMenu[navGuard] = false;
				else prevIsMenu[navGuard] = true;
			}
		}
		
		setBackButton(parentTitle);
		setWindowTitle(ctrl.getTitle());
		setRightIco(ctrl.getRightIco());
				
		$.setRightNavClick(ctrl.getRightNavCb());

		ctrl.winMain.navGroup = $;
		ctrl.winMain.left = $.mainView.width;
		ctrl.winMain.top = 0;
		
		if (args != null) {
			for (var key in args) {
				if (args.hasOwnProperty(key)) {
					ctrl.winMain[key] = args[key];	
				}
			}
		}
		
		$.mainView.add(ctrl.winMain);		
		$.mainView.setWidth("100%");
		$.mainView.height = Ti.UI.FILL;
		
		transition(parentWindow, ctrl.winMain, "new");
		
		ctrl.init();
		ctrl = null;
	}
	
	function setMenuIco(iconText) {
		isMenu = true;
		toggleLeftNavButton(iconText);	
	}
	
	function setLeftIco(iconText) {
		isMenu = false;
		toggleLeftNavButton(iconText);	
	}
	
	function setRightIco(iconText) {
		toggleRightNavButton(iconText);	
	}
	
	function setWindowTitle(title) {
		$.winTitle.setText(title);
	}
	
	function setMenu(menuItems) {
		var mDataProvider = [];
		var len = menuItems.length;
		for (var i = 0; i < len; i++) {
			var p = menuItems[i];
			
			var row = Ti.UI.createTableViewRow({
				backgroundColor: "#333333",
				className: "mList",
				height: 50
			});
			
			//custom properties
			row.action = fn.gets(p["action"]);
			row.wTitle = fn.gets(p["wTitle"]);
			row.url = fn.gets(p["url"]);
			
			if (fn.isIOS())
				row.selectedBackgroundColor = "#B40026";
			else
				row.backgroundSelectedColor = "#B40026";
			
			var leftIco = Ti.UI.createLabel({
				text : fn.gets(p["leftIco"]),
				left : 5,
				touchEnabled : false,
				color : "#fff",
				height : 40,
				
				font : {
					fontSize : "25dp",
					fontFamily: 'HqTi'
				}
			});
			
			var lbl = Ti.UI.createLabel({
				text : fn.gets(p["title"]),
				left : 45,
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE,
				color : "#FFFFFF",
				touchEnabled: false,
				
				font : {
					fontSize : "18dp",
					fontFamily: fn.os({
						iphone:'Open Sans',
			            ipad: 'Open Sans',
			            ipod: 'Open Sans',
			            android:'OpenSans-Regular',
			            mobileweb: 'Open Sans'
					})
				}
			});
			
			row.add(leftIco);
			row.add(lbl);
			
			mDataProvider.push(row);
			
			leftIco = null;
			lbl = null;
			row = null;
		}
		
		$.menuTable.setData(mDataProvider);	
	}
	
	function menuclick(e) {
		fn.closeSplash();
		var cb = function() {
			toggleSlideMenu();
			
			var idx = fn.getn(e.index);
			if (mSelectedIndex != idx) {
				if (e.row == null) {
					fn.closeSplash();
					return;
				}
				
				if (!fn.isEmpty(e.row["url"])) {
					if (menuClickCb != null) menuClickCb(e.row, function() {
						mSelectedIndex = idx;
					});	
				}
			}
		};
		
		if (fn.isMobileWeb()) {
			e.row.backgroundColor = "#B40026";

			setTimeout(function() {
				e.row.backgroundColor = "#333333";
			}, 50);
		}
		
		cb();
	}
	
	function setHeader(h) {
		$.lblHeader1.text = fn.gets(h["header1"]);
		$.lblHeader2.text = fn.gets(h["header2"]);
	}
	
	function transition(pview, view, type) {
		
		if (type=="new") {
			if (!fn.isMobileWeb()) {
				var aniNew = Ti.UI.createAnimation({
					left : 0,
					top : 0,
					curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
					duration : 200
				});
				view.animate(aniNew, function() {
					view.left = 0;
					view.top = 0;
				});
				
				var aniNew2 = Ti.UI.createAnimation({
					right : $.mainView.size.width,
					top : 0,
					curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
					duration : 200
				});
				
				pview.animate(aniNew2, function() {
					pview.visible = false;
					pview.hide();
				});
			} else {
				view.left = 0;
				view.top = 0;
				pview.visible = false;
				pview.hide();
			}
		}
		
		else if (type=="back") {
			
			if (!fn.isMobileWeb()) {
				var aniNew = Ti.UI.createAnimation({
					right : 0,
					top : 0,
					curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
					duration : 250
				});
				view.animate(aniNew, function() {
					view.left = 0;
					view.top = 0;
					setPrevWinSettings();
				});		
				
				var aniNew2 = Ti.UI.createAnimation({
					left : $.mainView.size.width,
					top : 0,
					curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
					duration : 250
				});
				
				pview.animate(aniNew2, function() {
					$.mainView.remove(pview);
					pview = null;
				});	
			} else {
				view.left = 0;
				view.top = 0;
				$.mainView.remove(pview);
				pview = null;
				setPrevWinSettings();
			}
				
		}
	}
	
	function setPrevWinSettings() {
		setWindowTitle(prevWinTitle[navGuard]);
	
		if (prevIsMenu[navGuard]) {
			setMenuIco(prevLeftButton[navGuard]);
			$.backButtonTitle.text = prevBackButtonTitle[navGuard];	
			isMenu = true;
		} else {
			setLeftIco(prevLeftButton[navGuard]);
			setBackButton(prevBackButtonTitle[navGuard]);
			isMenu = false;
		}
					 
		setRightIco(prevRightButton[navGuard]);
					 
		$.setLeftNavClick(prevSetLeftNavClick[navGuard]);
		$.setRightNavClick(prevSetRightNavClick[navGuard]);
					 
		navGuard--;
	}
	
	function handleAndroidBack() {
		if (isMenu) {
			memPool.close();
			if ($.logoutCb != null) $.logoutCb();
		} else
			backButtonClick();	
	}
	
	function logout() {
		if ($.logoutCb != null) {
			memPool.close();
			reset();
			setWindowTitle("");
			
			if ($.mainView.children.length > 0)
				fn.removeChildren($.mainView, $.logoutCb);
			else
				$.logoutCb();
		}

		toggleSlideMenu();	
	}
	
	function reset() {
		prevWindow = [];
		prevWinTitle = [];
		prevLeftButton = [];
		prevBackButtonTitle = [];
		prevRightButton = [];
		prevIsMenu = [];
		prevSetLeftNavClick = [];
		prevSetRightNavClick = [];
		navGuard = 0;
	}
	
	//
	//Public functions
	//
	$.openView = openView;					// for main view (where menu is visible)
	$.openWindow = openWindow;			// for child windows of main view (with back button)
	$.setMenuIco = setMenuIco;
	$.setLeftIco = setLeftIco;
	$.setRightIco = setRightIco;
	$.setMenu = setMenu;
	$.setHeader = setHeader;
	$.back = backButtonClick;
	$.setTitle = setWindowTitle;
	
	
	$.setLeftNavClick = function(cb) {
		$.leftNavClick = cb;
	};
	
	$.setRightNavClick = function(cb) {
		$.rightNavClick = cb;
	};
	
	$.setLogoutCb = function(cb) {
		$.logoutCb = cb;
	};
	
	$.isMenu = function() {
		return isMenu;
	};
	
	$.setInit = function(cb) {
		init = cb;
	};
	
	$.setMenuClickCb = function(cb) {
		menuClickCb = cb;
	};
	
	exports.cleanUp = function() {
		$.leftButtonView.removeEventListener("touchstart", leftnavClick);
		$.backButtonTitleView.removeEventListener("touchstart", backButtonClick);
		$.rightButtonView.removeEventListener("touchstart", rightnavClick);
		$.menuTable.removeEventListener("click", menuclick);
		$.menuView.removeEventListener('swipe',swipeMenu);
		$.nav.removeEventListener('swipe',swipeMenu);	
		$.mFooter.removeEventListener('touchstart', logout);	
		
		fn.removeChildren($.mainWindow);
		
		fn = null;
		slideWidth = null;
		pWidth = null;
		pHeight = null;
		init = null;
		mSelectedIndex = null;
		menuClickCb = null;
		animateSelect = null;
		_args = null;
		title = null;
		leftIco = null;
		rightImage = null;
		isMenu = null;
		prevWindow = null;
		prevWinTitle = null;
		prevLeftButton = null;
		prevBackButtonTitle = null;
		prevRightButton = null;
		prevIsMenu = null;
		prevSetLeftNavClick = null;
		prevSetRightNavClick = null;
		navGuard = null;
		menuWidth = null;
		animateDuration = null;
		animateMenu = null;
		touchStartX = null;
		touchRightStarted = null;
		touchLeftStarted = null;
		buttonPressed = null;
		hasSlided = null;
		direction = null;
		isMenuOpen = null;
		leftEvt = null;
		backEvt = null;
		rightEvt = null;
		menuEvt = null;
		swipeEvt = null;
		navSwipeEvt = null;
		footerEvt = null;
		memPool = null;
	};
	
