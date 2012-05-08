enyo.kind({
	name: "FuelAustria",
    kind: enyo.VFlexBox,
    className: "enyo-bg",
    transitionKind: "enyo.transitions.LeftRightFlyin",
    components: [
        {kind: "ApplicationEvents", onBack: "backGesture"},
        {
            name : "getConnMgrStatus",
            kind : "PalmService",
            service : "palm://com.palm.connectionmanager/",
            method : "getStatus",
            onSuccess : "statusFinished",
            onFailure : "statusFail",
            onResponse : "gotResponse",
            subscribe : false
        },
        {kind: "AppMenu", components: [
            {caption: "About", onclick: "openAbout"}
        ]},
        {kind: "Scroller", flex: 1, components: [
            { kind: "Pane", flex: 1, onSelectView: "viewSelected", components: [
                //TODO: add new pane with retry for network connection
                {
                    name: "optionPane",
                    kind: "OptionView",
                    flex: 1,
                    onDistrictSearchClick: "districtSearchClick",
                    onCurrentPositionClick: "currentPositionClick",
                    onAddressSearchClick: 'addressSearchClick'
                },
                {
                    kind: 'DistrictSelectionView',
                    flex: 1,
                    name: "districtSelection",
                    lazy: true,
                    onSearchClick: 'districtSearchSuccess',
                    onFuelTypeSearch: 'fuelTypeSearch',
                    onClosedCheck: 'closedCheck',
                    onBackButton: 'backButtonHandler'
                }
            ]}
        ]}
    ],
    rendered: function() {
        this.load();
    },
    load: function(){
        this.$.optionPane.load();// don't forget to change the setting of the type if getting rid of this method call
        //this.$.getConnMgrStatus.call();
    },

    districtSearchClick: function(sender){
        this.$.pane.selectViewByName('districtSelection');
    },

//    statusFinished : function(inSender, inResponse) {
//        var connected = inResponse.isInternetConnectionAvailable;
//        this.$.confirmPrompt.setMessage(enyo.json.stringify(inResponse.wifi));
//        this.$.confirmPrompt.open();
//    },
//    statusFail : function(inSender, inResponse) {
//        this.$.confirmPrompt.setCaption(enyo.json.stringify(inResponse.wifi));
//        this.$confirmPrompt.open();
//        enyo.log("getStatus failure, results=" + enyo.json.stringify(inResponse));
//    },

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
        if(this.$.pane.getViewIndex()!==0) {
            this.$.pane.back();
        }
        return -1;
    },
    backButtonHandler: function(sender) {
        if(this.$.pane.getViewIndex()!==0) {
            this.$.pane.back();
        }
    },

    viewSelected: function(inSender, inView, inPreviousView) {
        //TODO
    }
});