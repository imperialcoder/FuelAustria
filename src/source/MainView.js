enyo.kind({
	name: "FuelAustria",
    kind: enyo.VFlexBox,
    className: "enyo-bg",
    transitionKind: "enyo.transitions.LeftRightFlyin",
    components: [
        {
            kind: "PageHeader",
            name: "header",
            className: "enyo-toolbar-light",
            pack: "center",
            components: [{
                kind: "Image",
                src: "icon.png",
                height: "64px",
                style: "margin-right: 10px"
            },
            {
                kind: "Control",
                name: "title",
                content: $L("Fuel Austria"),
                className: "enyo-text-header page-title"
            }]
        },
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
                    kind: "MainStationListView",
                    flex: 1,
                    name: "list",
                    lazy: true,
                    onAddStation: "newItemClick",
                    onEditStation: "newItemClick"
                },
                {
                    kind: 'DistrictSelectionView',
                    flex: 1,
                    name: "districtSelection",
                    lazy: true,
                    onSearchClick: 'districtSearchSuccess',
                    onBackClick: 'districtBackClick',
                    onFuelTypeSearch: 'fuelTypeSearch',
                    onClosedCheck: 'closedCheck'
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

    newItemClick: function(inSender) {
        console.log("newItemClick: ");
        //this.$.dialogProfile.setActiveProfile();
        this.$.pane.selectViewByName("list");
        //this.$.dialogProfile.beginEdit();
    },

    districtSearchClick: function(sender){
        enyo.log('districtSearch click');
        this.$.pane.selectViewByName('districtSelection');
    },

    districtBackClick: function(sender) {
        this.$.pane.back();//selectViewByName('optionPane');
    },

    fuelTypeSearch: function(){
        return this.$.optionPane.getFuelType();
    },
    closedCheck: function(){
        return this.$.optionPane.getClosedCheck();
    },


    gotData: function(sender, response, request) {
        if(enyo.isArray(response)) {
           this.data = response;
        }
        this.$.priceList.render();
    },
    gotDataFailure: function(sender, response, request) {
        enyo.log('failure');
    },
    gotBezirke: function(sender, response, request){
        this.federalStates = this.getFederalStates(response);
        var items = [];
        enyo.forEach(this.federalStates, function(state){
            items.push({caption: state.bezeichnung, value: state.code, record: state});
        }, this);
        this.$.federalStateSelector.setItems(items);
    },
    gotBezirkeFailure: function(sender, response, request){
        enyo.log('bezirke error');
    },
    onBezirksSucheClick: function(inSender, inTwo, inThree) {
        this.$.getAllBezirke.call();
    },
    getItem: function(sender, index) {
        var record = this.data[index];
        if (record) {
            this.$.listItem.record = record;
            this.$.gasStationName.setContent(index + 1 + '. ' + record.gasStationName);
            this.$.price.setContent(record.spritPrice[0].amount);
            this.$.open.setContent(this.translateBoolean(record.open));
            return true;
        }
    },

    translateBoolean: function(open){
        if(open){
            return 'Offen';
        } else {
            return 'Geschlossen';
        }
    },
    districtSearchSuccess: function(response) {
        enyo.log('districtsearchsuccess');
    },
    doListTap: function(sender, mouseEvent, index){
        var record = this.$.listItem.record;
        enyo.log(record);
    },

    viewSelected: function(inSender, inView, inPreviousView) {
        var title = "";
        switch (inView.name) {
            case "dialogProfile":
                title = $L("Edit Drive");
                break;
            case "list":
                title = $L("Network Drives");
                break;
        }
        this.$.title.setContent(title);
    }
});