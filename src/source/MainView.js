﻿enyo.kind({
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

    stationSelected: function(sender, station) {//TODO station
        this.$.pane.selectViewByName('stationDetail');
        this.$.stationDetail.setStation(station);
        this.$.stationDetail.setStationValues();
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