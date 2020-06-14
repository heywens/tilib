/**
 * RBA 2014-03-18
 * BaseList with Paging
 * 
 */

	var fn = require('tilib/core/CUtils');
	var _args = arguments[0] || {};
	
	var sKeys = [];
	var enabled = true;
	$.selectRecord = null;
	
	
	//passed other config to view
	for (var key in _args) {
		if (_args.hasOwnProperty(key)) {
			$.dgList[key] = _args[key];	
		}
	}
	
	
	// Event listener
	$.dgList.addEventListener('click', select);
	
	
	
	
	//
	// Functions
	//
	function init(params) {
		params = params || {};
		
		var keyNames = params["keyNames"] || "";
		if (!fn.isEmpty(keyNames))
			sKeys = keyNames.split(",");
			
		$.selectRecord = params["selectRecord"];
		if (!fn.isEmpty(params["enabled"]))
			enabled = fn.getb(params["enabled"]);		
	}
	
	function select(e) {
		if (e.row == null) return;
		
		var mHasDetail = fn.gets(e.row.hasDetail);
		var bHasDetail = fn.isEmpty(mHasDetail) ? true : fn.getb(mHasDetail);
		if (!enabled || !bHasDetail) return;
		
		var cb = function() {
			if ($.selectRecord != null) $.selectRecord(e.row);
		};
		
		if (!fn.isMobileWeb()) {
			cb();
		} else {
			fn.selectTableRow(e.row, cb);
		}
	}
	
	
	function disableSelection() {
		$.dgList.removeEventListener('click', select);	
	}
	

	function setData(data) {		
		var mDataProvider = [];
		var skeyLen = sKeys.length;
		
		if (skeyLen < 0) return;
		
		var len = data.length;
		for (var i = 0; i < len; i++) {
			var p = data[i];
			
			var mHasDetail = fn.gets(p["hasDetail"]);
			var bHasDetail = fn.isEmpty(mHasDetail) ? true : fn.getb(mHasDetail);
			
			var row = Ti.UI.createTableViewRow({
				backgroundColor: "#FFFFFF",
				className: "mList",
				height: Ti.UI.SIZE,
				width : "100%"
			});
			
			row.mData = p;
			
			if (fn.isIOS())
				row.selectedBackgroundColor = "#B40026";
			else
				row.backgroundSelectedColor = "#B40026";	
				
			
			if (fn.gets(p.fsum) == "2") continue; //skip displaying line breaks
			
			//table view row contents
			var dataview = Ti.UI.createView({
				layout : "vertical",
				height : Ti.UI.SIZE,
				width : "45%",
				left : 15,
				top : 10,
				bottom : 10
			});
			
			var rightView = Ti.UI.createView({
				layout : "composite",
				height : Ti.UI.SIZE,
				width : "55%",
				right : 15
			});
			
			var lblKey1 = Ti.UI.createLabel({
				text : fn.gets(p[sKeys[0]]),
				color : "#000000",
				textAlign : "left",
				left : 0,
				touchEnabled: false,
				
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
			dataview.add(lblKey1);
			
			if (skeyLen >= 3 && !fn.isEmpty(fn.gets(p[sKeys[2]]))) { 
				var lblKey3 = Ti.UI.createLabel({
					text : fn.gets(p[sKeys[2]]),
					color : "#000000",
					textAlign : "left",
					left : 0,
					touchEnabled : false,
					
					font : {
						fontSize : "16dp",
						fontFamily: fn.os({
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

			
			if (skeyLen >= 4 && !fn.isEmpty(fn.gets(p[sKeys[3]]))) { 
				var lblKey4 = Ti.UI.createLabel({
					text : fn.gets(p[sKeys[3]]),
					color : "#000000",
					textAlign : "left",
					left : 0,
					touchEnabled : false,
					
					font : {
						fontSize : "16dp",
						fontFamily: fn.os({
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
			
			if (skeyLen >= 2 && !fn.isEmpty(fn.gets(p[sKeys[1]]))) {
				var lblKey2 = Ti.UI.createLabel({
					text : fn.gets(p[sKeys[1]]),
					color : "#000000",
					textAlign : "right",
					right : (enabled ? 29 : 0),
					width : "100%",
					touchEnabled : false,
					
					font : {
						fontSize : "16dp",
						fontWeight : "bold",
						fontFamily: fn.os({
							iphone:'Open Sans',
				            ipad: 'Open Sans',
				            ipod: 'Open Sans',
				            android:'OpenSans-Bold',
			            	mobileweb: 'Open Sans'
						}),
					}
				});
				rightView.add(lblKey2);
			}
			
			if (enabled && bHasDetail) {
				var imgChildIndicator = Ti.UI.createLabel({
					text : "/",
					width : 24,
					height : 22,
					right : 0,
					color : "#363637",
					
					font : {
						fontFamily : "HqTi",
						fontSize : "20dp"
					}
				});	
				
				rightView.add(imgChildIndicator);
			}
			
			row.add(dataview);
			row.add(rightView);
			mDataProvider.push(row);
		}
		
		$.dgList.setData(mDataProvider);
	}
	
	function disable(b) {
		enabled = !(fn.getb(b));
	}
	
	
	//
	// Public functions
	//
	exports.init = init;
	exports.setData = setData;
	exports.disableSelection = disableSelection;
	exports.disable = disable;
	
	exports.cleanUp = function() {
		$.dgList.removeEventListener('click', select);
		$.dgList = null;
		
		fn = null;
		_args = null;
		sKeys = null;
		enabled = null;
		$.selectRecord = null;
	};
	
