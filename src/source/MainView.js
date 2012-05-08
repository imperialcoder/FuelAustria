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
        {kind: "Scroller", flex: 1, components: [
            { kind: "Pane", flex: 1, onSelectView: "viewSelected", components: [
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
        this.$.optionPane.load();

        this.$.pane.selectViewByName("optionPane");
    },

    districtSearchClick: function(sender){
        this.$.pane.selectViewByName('districtSelection');
    },

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