enyo.kind({
    name: "GpsSearchView",
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
        gpsData: {}
    },
    components: [
        {kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center", components: [
            {kind: "SpinnerLarge"}
        ]},
        {name: "getPositionStations", kind: "WebService",
            url: "http://service.imperialcoder.com/FuelAustria/GpsStations/",
            method: 'GET',
            onSuccess: "gotStations",
            onFailure: "gotStationsFailure"
        },
		{
			name: "dialogError",
			kind: "ErrorDialog"
		},
        {
            kind: "PageHeader",
            name: "header",
            pack: "center",
            components: [
                {
                    kind: "ToolButton",
                    name: 'back',
                    icon: "images/arrow-left.png",
                    className: "enyo-light-menu-button",
                    onclick: 'backButtonClicked'
                },
                {kind: "Spacer" },
                {
                    kind: "Control",
                    name: "title",
                    content: $L("Fuel Austria"),
                    className: "enyo-text-header page-title"
                }
            ]
        },
        {
            kind: "Scroller",
            flex: 1,
            components: [{
                kind: "VFlexBox",
                className: "box-center",
                components: [
                    {kind: "RowGroup", caption: $L("Stations"), components: [
                        {kind: "VirtualRepeater", onSetupRow: 'getItem', name: 'priceList', components: [
                            {kind: "StationListItem", name:'listItem', tapHighlight: true, onclick: "stationSelected"}
                        ]}
                    ]}
                ]}
            ]
        }
    ],
    create: function() {
        this.inherited(arguments);
        this.dataChanged();
    },
    load: function(gpsData){
        this.setGpsData(gpsData);
        this.showScrim(true);

        var data = {};
        data.fuel = this.doFuelTypeSearch();
        data.closedStations = this.doClosedCheck();
        data.longi = gpsData.longitude;
        data.lati = gpsData.latitude;

        var url = 'http://service.imperialcoder.com/FuelAustria/GpsStations/?';
        url += enyo.objectToQuery(data);

        if(this.$.getPositionStations.getUrl() != url){
            this.$.getPositionStations.setUrl(url);
        }
        this.$.getPositionStations.call();
    },
    gotStations: function(sender, response, request){
        if(!response.success){
            enyo.error(JSON.stringify(response));
            this.showScrim(false);
			this.handleError(response, $L('ErrorGpsData'));
        } else {
            //load data;
            this.setData(response.data);
            this.$.priceList.render();
            this.showScrim(false);
        }
    },
    gotStationsFailure: function(sender, response, request){
        enyo.error(enyo.json.stringify(response));
		this.handleError(response, $L('ErrorGpsData'));
    },
    getItem: function(sender, index) {
        var record = this.getData()[index];
        if (record) {
			var amount = '';
			if(record.spritPrice[0] && record.spritPrice[0].amount){
				amount = '€ ' + record.spritPrice[0].amount;
			} else {
				//amount = $L('NotCheapest');
				amount = '-';
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
    //
    dataChanged: function(){
        this.$.data = this.data;
        this.$.gpsData = this.gpsData;
    },
    backButtonClicked: function(sender, mouseEvent) {
        this.doBackButton();
    },
    showScrim: function(inShowing) {
        this.$.scrim.setShowing(inShowing);
        this.$.spinnerLarge.setShowing(inShowing);
    },
	handleError: function(response, caption){
		enyo.error(enyo.json.stringify(response));
		var errorText = '';
		if(response.errorCode){
			enyo.error('in error code')
			errorText = response.errorCode === 5 ? $L('GpsNotEnabled') : response.errorCode === 8 ? $L('GpsNotAllowed') : '';
			enyo.error('errortext at end: ' + errorText)
		}
		if(errorText === ''){
			errorText = response.errorText || enyo.json.stringify(response);
		}
		this.showErrorDialog(caption, errorText, 'OK')
	},
	showErrorDialog: function(caption, message, buttonName){
		this.$.dialogError.openAtCenter(caption, message, buttonName);
	}
});
