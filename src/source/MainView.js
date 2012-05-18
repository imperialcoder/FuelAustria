enyo.kind({
	name: "FuelAustria",
    kind: enyo.VFlexBox,
    className: "enyo-bg",
    transitionKind: "enyo.transitions.LeftRightFlyin",
    components: [
        {kind: "ApplicationEvents", onBack: "backGesture"},
        {kind: "AppMenu", components: [
            {caption: "About", onclick: "openAbout"}
        ]},
        { kind: "Pane", flex: 1, onSelectView: "viewSelected", components: [
            {
                name: "connectionPane",
                kind: "ConnectionView",
                flex: 1,
                onConnectionEstablished: "connectionEstablished"
            },
            {
                name: "optionPane",
                kind: "OptionView",
                flex: 1,
                lazy: true,
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
                onFuelTypeSearch: 'fuelTypeSearch',
                onClosedCheck: 'closedCheck',
                onBackButton: 'backButtonHandler'
            },
            {
                kind: 'AddressSearchView',
                flex: 1,
                name: "addressSearch",
                lazy: true,
                onStationSelected: 'stationSelected',
                onFuelTypeSearch: 'fuelTypeSearch',
                onClosedCheck: 'closedCheck',
                onBackButton: 'backButtonHandler'
            },
            {
                kind: 'DistrictSelectionView',
                flex: 1,
                name: "districtSelection",
                lazy: true,
                onStationSelected: 'stationSelected',
                onFuelTypeSearch: 'fuelTypeSearch',
                onClosedCheck: 'closedCheck',
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
    },

    currentPositionClick: function(sender, gpsData){
        this.$.pane.selectViewByName('gpsSearch');
        this.$.gpsSearch.load(gpsData);
    },

    addressSearchClick: function(sender, params){
        this.$.pane.selectViewByName('addressSearch');
    },

    stationSelected: function(sender, station) {//TODO station
        this.$.pane.selectViewByName('stationDetail');
        this.$.stationDetail.setStationValues(station);
    },

    //helper from now on
    fuelTypeSearch: function(){
        return this.$.optionPane.getFuelType();
    },
    closedCheck: function(){
        return this.$.optionPane.getClosedCheck();
    },

    backGesture: function(inSender, inEvent) {
        inEvent.stopPropagation();
        inEvent.preventDefault();
        if(this.$.pane.getViewIndex()> 1) {
            this.$.pane.back();
        }
        return -1;
    },
    backButtonHandler: function(sender) {
        if(this.$.pane.getViewIndex()> 1) {
            this.$.pane.back();
        }
    },

    viewSelected: function(inSender, inView, inPreviousView) {
        //TODO
    }
});