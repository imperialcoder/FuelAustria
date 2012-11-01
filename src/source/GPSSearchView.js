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
			className: "enyo-header-dark",
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
                    content: "Fuel Austria",
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
        //this.dataChanged();
		this.gpsDataChanged();
    },
    gotStations: function(sender, response, request){
        if(!response.success){
            enyo.error(JSON.stringify(response));
            this.showScrim(false);
			this.handleError(response, $L('Error'));
        } else {
            //load data;
            this.setData(response.data);
            this.$.priceList.render();
            this.showScrim(false);
        }
    },
    gotStationsFailure: function(sender, response, request){
        enyo.error(enyo.json.stringify(response));
        this.showScrim(false);
		this.handleError(response, $L('Error'));
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
            this.$.listItem.setDistance('km ' + record.distance);
            return true;
        }
    },
    stationSelected: function(sender, mouseEvent, index){
        var station = this.getData()[index];
        this.doStationSelected(station);
    },
    
	gpsDataChanged: function(){
		if(this.gpsData.config){
			this.showScrim(true);

			var config = this.gpsData.config;
			var gpsData = this.gpsData.gpsData;

			var data = {};
			data.fuel = config.fuelType;
			data.closedStations = config.closedStations ? 'checked' : '';
			data.longi = gpsData.longitude;
			data.lati = gpsData.latitude;

			var url = 'http://service.imperialcoder.com/FuelAustria/GpsStations/?';
			url += enyo.objectToQuery(data);

			if(this.$.getPositionStations.getUrl() != url){
				this.$.getPositionStations.setUrl(url);
			}
			this.$.getPositionStations.call();
		}
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
            errorText = response.errorCode === 5 ? $L('Gps not enabled!') : response.errorCode === 8 ? $L('No allowed to check position data, please restart and give proper permission!') : '';
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
