/**
 * ComboBox
 * RBA 2014-01-14
 * 
 */
	
	var fn = require('tilib/core/CUtils');

	//copy arguments passed in the widget via xml and tss params
	var _args = arguments[0] || {};
	
	//set property values based on args
	var formItemLabel = _args["label"] || "";
	var mDataProvider = _args["dataProvider"] || [];
	var mSelectedValue = _args["selectedValue"] || "";
	var mSelectedIndex = _args["selectedIndex"] || -1;
	
	var mSelectedItem = null;
	var listView;
	var winList = null;
	var top =  _args["top"] || -1;
	
	var deviceWidth = fn.getDeviceHeight();
	var mHeight = fn.getbHeight() + 50; //+50 (no control bar)
	
	var mType = "combobox"; //set custom component type
	
	var animateSelect = Ti.UI.createAnimation({
		curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration : 100,
		backgroundColor : "#D7DADB",
		autoreverse : true
	});
	
	$.cbChange = null;
	

	//passed other config to view
	for (var key in _args) {
		if (_args.hasOwnProperty(key)) {
			$.mView[key] = _args[key];	
		}
	}
	
	//init
	$.formItemLabel.text = formItemLabel;
	$.mView.top = top;

	createList();
	setEnabled(true);
	
	
		
	//
	// Functions
	//
	function createList() {
		listView = Ti.UI.createTableView({
			backgroundColor : "#FFFFFF",
			color : "#000000",
			width : "95%",
			height : Ti.UI.FILL,
			minRowHeight : 40,
			//right : 0,
			separatorColor: "#BEBEBE"
		});
		
		listView.setData(getData());
		
		//Event listener
		var evt = listView.addEventListener('click', function(e) {
			updateRow(mSelectedIndex, false); //previous
			
			mSelectedIndex = e.index;
			mSelectedItem = e.rowData;
			
			setSelectedValue(e.rowData.data);
			sets(e.rowData.data);
			
			if ($.cbChange != null) $.cbChange(e.rowData.data, e.index);
			
			winList.close();
		});
	}
	
	
	function openList() {
		if (winList == null) { 
			winList = Ti.UI.createWindow({
				width : "100%",
				height : "100%",
				navBarHidden : true,
				layout : "composite",
				opacity : 1
			});
			
            var trans = Ti.UI.createView({
				width : "100%",
				height : "100%",
				backgroundColor : "#000000",
				opacity : 0.6
			});
			
			var mView = Ti.UI.createView({
				width : "80%",
				height : "80%",
				layout : "vertical",
				backgroundColor : "#FFFFFF",
				opacity : 1
			});
			
			
			var nav = Ti.UI.createView({
				backgroundColor : "#2B3F4E",
				width : "100%",
				height : 50,
				layout : "composite"
			});
			
			
			var title = Ti.UI.createLabel({
				text : formItemLabel,
				color : "#FFFFFF",
				height : nav.height,
				width : "100%",
				top : 0,
				textAlign : "center",
				
				font : {
					fontSize : "18dp",
					fontWeight : "bold",
					
					fontFamily: fn.os({
						iphone:'Open Sans',
			            ipad: 'Open Sans',
			            ipod: 'Open Sans',
			            android:'OpenSans-Bold',
			            mobileweb: 'Open Sans'
					})
				}
			});
			
			var btnCancel = Ti.UI.createLabel({
				text : "Cancel",
				color: "#FFFFFF",
				width : 60,
				right : 10,
				textAlign : "right",
				
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
			
			btnCancel.addEventListener('touchstart', cancel);
	
			nav.add(title);
			nav.add(btnCancel);
			
			winList.add(trans);
			winList.add(mView);
			
			mView.add(nav);
			mView.add(listView);
			
			if (fn.isAndroid())
				winList.addEventListener('androidback', cancel);
				
			if (fn.isMobileWeb())
				winList.setZIndex(3);	
		}
		
		$.mView.animate(animateSelect , function(){	
			winList.open();		
		});	
	}
	
	function cancel() {
		winList.close();
	}
		
	
	function getData() {
		var data = [];
		
		var len = mDataProvider.length;
		for (var i = 0; i < len; i++) {
			var item = {
				//custom properties
				label : mDataProvider[i]["label"],
				data : mDataProvider[i]["data"],
				
				//properties
				title : mDataProvider[i]["label"],
				className : "listViewClass",
				color: "#000000"
			};
			
			if (fn.isIOS())
				item["selectedBackgroundColor"] = '#B40026';
			else
				item["backgroundSelectedColor"] = '#B40026';

			data.push(item);
		}	
		mDataProvider = data;
		return data;
	}
	
	
	function setSelectedValue(s) {
		mSelectedValue = fn.gets(s);
		
		sets(s);
	}
	
	function getSelectedValue() {
		return mSelectedValue;
	}
	
	function findIndex(value, field) {
		field = field || "data";
		
		var list = mDataProvider;
		var len = list.length;
		for (var i = 0; i < len; i++) {
			if (list[i][field] == value)
				return i;
		}
		return -1;
	}
	
	function sets(value, field) {
		if (mSelectedIndex >= 0) updateRow(mSelectedIndex, false);
		
		value = fn.gets(value);
		field = field || "data";
		
		mSelectedIndex = findIndex(value,field);
		mSelectedValue = value;
		mSelectedItem = mDataProvider[mSelectedIndex];
		
		if (mDataProvider.length <= 0 || mDataProvider.length <= mSelectedIndex) return;
		if (mSelectedIndex < 0) setSelectedIndex(0);
		updateRow(mSelectedIndex, true);
		$.lblValue.setText(mDataProvider[mSelectedIndex]["label"]);
	}
	
	function updateRow(index, b) {
		if (index >= 0 && mDataProvider != null) {
			
			var mLen = mDataProvider.length;
			for (var i = 0; i < mLen; i++) {
				if (i == index) {
					var data = mDataProvider[i];
					data.hasCheck = fn.getb(b);
					listView.updateRow(i, data);	
					break;	
				}
			}
		}
	}
	
	function gets(index) {
		index = index || "data";
		if (mSelectedItem == null) return "";
		return mSelectedItem[index];
	}
	
	function getName() {
		if (mSelectedItem == null) return "";
		return mSelectedItem["label"];	
	}
	
	function setDataProvider(o) {
		mDataProvider = o;
		listView.setData(getData());
	}
	
	function setSelectedIndex(index) {
		updateRow(mSelectedIndex, false); 
		
		mSelectedIndex = fn.getn(index);
		
		updateRow(mSelectedIndex, true); 
		
		if (mDataProvider.length <= 0 || mDataProvider.length <= mSelectedIndex) return;
		
		var selected = mDataProvider[mSelectedIndex];
		mSelectedItem = selected;
		mSelectedValue = selected["data"];
		$.lblValue.setText(selected["label"]);
	}
	
	function getSelectedIndex() {
		return mSelectedIndex;
	}
	
	function setVisible(b) {
		b = fn.getb(b);
		$.mView.visible = b;
		$.mView.height = b ? Ti.UI.SIZE : 0;
		$.mView.top = b ? (_args["top"] || -1) : 0;
		$.mView.bottom = b ? (_args["bottom"] || 0) : 0;
		
		if (b)
			$.mView.show();
		else
			$.mView.hide();
	}
	
	function setEnabled(b) {
		if (fn.getb(b)) {
			$.vSelect.addEventListener('touchstart', openList);
		} else {
			$.vSelect.removeEventListener('touchstart', openList);
		}
	}
	
	function setFormItemLabel(text) {
		$.formItemLabel.text = text;
	}
	
	
	//
	// set public methods here
	//
	$.setSelectedValue = setSelectedValue;
	$.getSelectedValue = getSelectedValue;
	$.findIndex = findIndex;
	$.sets = sets;
	$.gets = gets;
	$.getName = getName;
	$.setDataProvider = setDataProvider;
	$.setSelectedIndex = setSelectedIndex;
	$.getSelectedIndex = getSelectedIndex;
	$.setVisible = setVisible;
	$.setEnabled = setEnabled;
	$.setFormItemLabel = setFormItemLabel;
	
	
	$.getType = function() {
		return mType;
	};
	
	exports.cleanUp = function() {
		$.vSelect.removeEventListener('touchstart', openList);
		
		fn.removeChildren($.mView);
		
		fn = null;
		_args = null;
		formItemLabel = null;
		mDataProvider = null;
		mSelectedValue = null;
		mSelectedIndex = null;
		mSelectedItem = null;
		listView = null;
		winList = null;
		top =  null;
		deviceWidth = null;
		mHeight = null;
		mType = null;
		animateSelect = null;
		$.cbChange = null;
	};
	
	