enyo.kind({
    name: "DistrictSelectionView",
    kind: enyo.VFlexBox,
    className: "enyo-bg",
    events: {
        onStationSelected: "",
        onFuelTypeSearch: "",
        onClosedCheck: "",
        onBackButton: ""
    },
    published: {
        data: [],
		initialized: false
    },
    components: [
        {kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center", components: [
            {kind: "SpinnerLarge"}
        ]},
        {name: "getAllStations", kind: "WebService",
            url: "http://service.imperialcoder.com/FuelAustria/AllStations/",
            method: 'GET',
            onSuccess: "gotData",
            onFailure: "gotDataFailure"},
        {name: "getStationsForDistrict", kind: "WebService",
            url: "http://service.imperialcoder.com/FuelAustria/DistrictStations/",
            method: 'GET',
            onSuccess: "gotData",
            onFailure: "gotDataFailure"},
        {name: "getBaseData", kind: "WebService",
            url: "http://service.imperialcoder.com/FuelAustria/BaseData/",
            method: 'GET',
            onSuccess: "gotBezirke",
            onFailure: "gotBezirkeFailure"
        },
		{
			name: "dialogError",
			kind: "ErrorDialog"
		},
		{
            kind: "PageHeader",
            name: "header",
			className: 'enyo-header-dark',
            pack: "center",
            components: [
//                {
//                    kind: "ToolButton",
//                    name: 'back',
//                    icon: "images/arrow-left.png",
//                    className: "enyo-light-menu-button",
//                    onclick: 'backButtonClicked'
//                },
//                {kind: "Spacer" },
                {
                    kind: "Control",
                    name: "title",
                    content: $L("Fuel Austria"),
                    className: "enyo-text-header page-title"
                }
            ]
        },
        {kind: "ListSelector", label:$L('Federal state'), name:'federalStateSelector', popupAlign:'left', contentPack:'middle', onChange: "federalStateChanged", items: [], components: [
            {kind: enyo.Spinner, name: "stateSpinner"}]},
        {kind: "ListSelector", label:$L('District'), name:'districtSelector', popupAlign:'left', contentPack:'middle', onChange: "districtChanged", items: [], components: [
            {kind: enyo.Spinner, name: "districtSpinner"}]},
        {kind: "ActivityButton", caption: $L("Start search"), name: 'searchButton',  onclick: "onBezirksAuswahlSucheClick"},
		{kind: "Scroller", flex:1, components: [
			{kind: "VFlexBox", className: "box-center", components: [
				{kind: "RowGroup", caption: $L("Stations"), components: [
					{kind: "VirtualRepeater", onSetupRow: 'getItem', name: 'priceList', components: [
						// {kind: "Item", name:'listItem', tapHighlight: true, layoutKind: "HFlexLayout", className: 'generalFont', onclick: "stationSelected",  components: [
						// 	{name: "gasStationName", flex: 4},
						// 	{name: "price", flex: 2},
						// 	{kind: "Image", flex: 1, name:"open", width:18, height:18}
						// ]}
                        {kind: "StationListItem", name:'listItem', tapHighlight: true, onclick: "stationSelected"}
					]}
				]}
			]}
		]}
    ],
    create: function() {
        this.inherited(arguments);
        this.dataChanged();
    },
	load: function() {
		if(!this.getInitialized()){
			this.$.stateSpinner.show();
			this.$.getBaseData.call();
		}
	},
    gotData: function(sender, response, request) {
        if(!response.success){
			this.handleError(response, $L('Error'));
        } else {
            this.setData(response.data);
        }
        this.$.priceList.render();

        this.showScrim(false);
    },
    gotDataFailure: function(sender, response, request) {
        enyo.error(enyo.json.stringify(response));
        this.showScrim(false);
		this.handleError(response, $L('Error'));
    },
    gotBezirke: function(sender, response, request){
        if(!response.success){
            enyo.error(JSON.stringify(response));
            this.$.stateSpinner.hide();
			this.handleError(response, $L('Error'));
            return;
        } else {
            var items = [];
            enyo.forEach(response.states, function(state){
                items.push({caption: state.data.bezeichnung, value: state.id, record: state.data});
            }, this);
            this.$.federalStateSelector.setItems(items);
            this.$.federalStateSelector.setValue(items[0].value);
            this.$.federalStateSelector.itemsChanged();
            this.$.stateSpinner.hide();
            this.$.districtSpinner.show();
            this.federalStateChanged(sender, this.$.federalStateSelector.getValue());
			this.setInitialized(true);
        }
    },
    gotBezirkeFailure: function(sender, response, request){
        enyo.error('bezirke error');
        enyo.error(enyo.json.stringify(response));
        this.$.stateSpinner.hide();
		this.handleError(response, $L('Error'));
    },
    federalStateChanged: function(sender, value, oldValue) {
        if(value !== oldValue){
            var record;
            enyo.forEach(this.$.federalStateSelector.items, function(item){
                if(item.value === value){
                    record = item.record;
                    return false;
                }
            }, this);
            var items = [{caption: $L('All'), value:0}];
            enyo.forEach(record.unterregionen, function(district){
                items.push({ caption: district.bezeichnung, value: district.code});
            }, this);
            this.$.districtSelector.setItems(items);
            this.$.districtSelector.setValue(items[0].value);
            this.$.districtSelector.itemsChanged();
            this.$.districtSpinner.hide();

            //clear list
            this.districtChanged();
        }
    },
    districtChanged: function(sender, value, oldValue) {
        this.setData([]);
        this.$.priceList.render();
    },
    onBezirksAuswahlSucheClick: function(inSender, inTwo, inThree) {
        this.showScrim(true);
        var data = {};

        data.federalState = this.$.federalStateSelector.getValue();
        data.district = this.$.districtSelector.getValue();
        data.fuel = this.doFuelTypeSearch();

        data.closedStations = this.doClosedCheck();

        if(!data.district) {
            var url = 'http://service.imperialcoder.com/FuelAustria/AllStations/?';
            url += enyo.objectToQuery(data);

            this.$.getAllStations.setUrl(url);
            this.$.getAllStations.call();
        } else {
            var url = 'http://service.imperialcoder.com/FuelAustria/DistrictStations/?';
            url += enyo.objectToQuery(data);

            if(this.$.getStationsForDistrict.getUrl() != url){
                this.$.getStationsForDistrict.setUrl(url);
            }
            this.$.getStationsForDistrict.call();
        }
    },
    getItem: function(sender, index) {
        var record = this.getData()[index];
        if (record) {
            var amount = '';
            if(record.spritPrice[0] && record.spritPrice[0].amount){
                amount = '€ ' + record.spritPrice[0].amount;
            } else {
                amount = $L('not in top 5');
            }
            this.$.listItem.setGasStationName(index + 1 + '. ' + record.gasStationName);
            this.$.listItem.setPrice(amount);
            this.$.listItem.setOpen(record.open);
            return true;
        }
    },
    stationSelected: function(sender, mouseEvent, index){
        var station = this.getData()[index];
        this.doStationSelected(station);
    },
    translateBoolean: function(open){
        if(open){
            return 'images/open.png';
        } else {
            return 'images/closed.png';
        }
    },
    // Pass true to show scrim, false to hide scrim
    showScrim: function(inShowing) {
		//this.$.scrim.setShowing(inShowing);
		//this.$.spinnerLarge.setShowing(inShowing);
		var a = this.$.searchButton.getActive();
		this.$.searchButton.setActive(!a);
	},
    backButtonClicked: function(sender, mouseEvent) {
        this.districtChanged();
        this.doBackButton();
    },
    dataChanged: function(){
        this.$.data = this.data;
		this.$.initialized = this.initialized;
    },
	handleError: function(response, caption){
		enyo.error(enyo.json.stringify(response));
		var errorText = response.errorText || enyo.json.stringify(response);
		this.showErrorDialog(caption, errorText, 'OK')
	},
	showErrorDialog: function(caption, message, buttonName){
		this.$.dialogError.openAtCenter(caption, message, buttonName);
	}
});