enyo.kind({
	name: "FuelAustria",
    kind: enyo.VFlexBox,
    className: "enyo-bg",
    components: [
        {kind: "ApplicationEvents", onBack: "backGesture", onLoad: "loadValues", onUnload: "saveValues"},
		{kind: "AppMenu", components: [
			{caption: $L("About"), onclick: "openAbout"}
		]} ,
        {kind: "Popup", allowHtml:true, /*components: [
                { kind: "Scroller", flex: 1 }
            ],*/
            content: 
            "<b>"+enyo.fetchAppInfo().title+" v"+enyo.fetchAppInfo().version+ "</b><br>"+
            "<br>&copy "+enyo.fetchAppInfo().vendor+"<br><a href='" + enyo.fetchAppInfo().vendorurl + "'>" + enyo.fetchAppInfo().vendorurl + "</a>"+
            "<br><br>" + $L('Applicaton to show cheapest gas stations in Austria.') + "<br><br>"+
            $L('Data provided by e-Control Austria') + " <a href='http:\/\/www.spritpreisrechner.at'>spritpreisrechner.at</a>",
            onClose:"boxClicked"
        },
        { kind: "Pane", flex: 1, onSelectView: "viewSelected", components: [
            // {
            //     name: "connectionPane",
            //     kind: "ConnectionView",
            //     flex: 1,
            //     onConnectionEstablished: "connectionEstablished"
            // },
            {
                name: "optionPane",
                kind: "OptionView",
                flex: 1,
                onDistrictSearchClick: "districtSearchClick",
                onCurrentPositionClick: "currentPositionClick",
                onAddressSearchClick: 'addressSearchClick'
            },
            {
                kind: 'GpsSearchView',
                flex: 1,
                name: "gpsSearch",
                lazy: true,
                onStationSelected: 'stationSelected',
                onFuelTypeSearch: 'getFuelType',
                onClosedCheck: 'getClosedStations',
                onBackButton: 'backButtonHandler'
            },
            {
                kind: 'AddressSearchView',
                flex: 1,
                name: "addressSearch",
                lazy: true,
                onStationSelected: 'stationSelected',
                onFuelTypeSearch: 'getFuelType',
                onClosedCheck: 'getClosedStations',
                onBackButton: 'backButtonHandler'
            },
            {
                kind: 'DistrictSelectionView',
                flex: 1,
                name: "districtSelection",
                lazy: true,
                onStationSelected: 'stationSelected',
                onFuelTypeSearch: 'getFuelType',
                onClosedCheck: 'getClosedStations',
                onBackButton: 'backButtonHandler'
            },
            {
                kind: 'StationDetailView',
                flex: 1,
                name: "stationDetail",
                lazy: true,
                onBackButton: 'backButtonHandler'
            }
        ]}
    ],

    connectionEstablished: function() {
        this.$.pane.selectViewByName('optionPane');
    },

    districtSearchClick: function(sender){
        this.$.pane.selectViewByName('districtSelection');
		this.$.districtSelection.load();
    },

    currentPositionClick: function(sender, config){
        this.$.pane.selectViewByName('gpsSearch');
        this.$.gpsSearch.setGpsData(config);
    },

    addressSearchClick: function(sender, params){
        this.$.pane.selectViewByName('addressSearch');
    },

    stationSelected: function(sender, station) {
        this.$.pane.selectViewByName('stationDetail');
        this.$.stationDetail.setStationValues(station);
    },

    //helper functions
    getFuelType: function(){
        return this.$.optionPane.getFuelType();
    },

    getClosedStations: function(){
        return this.$.optionPane.getClosedStations();
    },

    backGesture: function(inSender, inEvent) {
        inEvent.stopPropagation();
        inEvent.preventDefault();
        if(this.$.pane.getViewIndex()> 0) {
            this.$.pane.back();
        }
        return -1;
    },
    backButtonHandler: function(sender) {
        if(this.$.pane.getViewIndex()> 1) {
            this.$.pane.back();
        }
    },
    openAbout: function() {
        enyo.scrim.show();
        this.$.popup.openAtCenter();
    },
    boxClicked: function(){
        enyo.scrim.hide();
    },

    viewSelected: function(inSender, inView, inPreviousView) {
        //todo
    },
	loadValues: function() {
		var config = localStorage.getItem("fuelAustriaSettings") || enyo.json.stringify({
			fuelType: 'DIE',
			includeClosed: true
		});
		config = enyo.json.parse(config);
		this.$.optionPane.setFuelType(config.fuelType);
		this.$.optionPane.setClosedStations(config.includeClosed);
	},
	saveValues: function () {
		var config =  enyo.json.stringify({
			fuelType: this.getFuelType(),
			includeClosed: this.getClosedStations()
		});
		localStorage.setItem("fuelAustriaSettings", config);
	}
});