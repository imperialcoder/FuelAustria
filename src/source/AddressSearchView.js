enyo.kind({
    name: "AddressSearchView",
    kind: enyo.VFlexBox,
    className: "enyo-bg",
    events: {
        onStationSelected: "",
        onFuelTypeSearch: "",
        onClosedCheck: "",
        onBackButton: ""
    },
    published: {
        data: []
    },
    components: [
        {kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center", components: [
            {kind: "SpinnerLarge"}
        ]},
        {name: "getAddressStations", kind: "WebService",
            url: "http://service.imperialcoder.com/FuelAustria/Address/",
            method: 'GET',
            onSuccess: "gotStations",
            onFailure: "gotStationsFailure"
        },
        {name: "plzLookup", kind: "WebService",
            url: "http://service.imperialcoder.com/FuelAustria/PlzLookup/",
            method: 'GET',
            onSuccess: "gotStations",
            onFailure: "gotStationsFailure"
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
                    {kind: "Input", name:"plzInput", hint: $L("Enter your ZIP"), oninput: "inputChange", autoKeyModifier: "num-lock"},
                    {kind: "ActivityButton", caption: "Suche starten", name: 'searchButton',  onclick: "onAddressSearchClick"},
                    {kind: "RowGroup", caption: $L("Stations"), components: [
                        {kind: "VirtualRepeater", onSetupRow: 'getItem', name: 'priceList', components: [
                            {kind: "Item", name:'listItem', tapHighlight: true, layoutKind: "HFlexLayout", onclick: "stationSelected",  components: [
                                {name: "gasStationName", flex: 4},
                                {name: "price", flex: 2},
                                {kind: "Image", flex: 1, name:"open", width:18, height:18}
                            ]}
                        ]}
                    ]}
                ]}
            ]
        }
    ],
    gotStations: function(sender, response, request){
        if(!response.success){
            //TODO: error msg
            enyo.error(JSON.stringify(response));
            this.showScrim(false);
        } else {
            //load data;
            this.$.priceList.render();
            this.showScrim(false);
        }
    },
    gotStationsFailure: function(sender, response, request){
        enyo.error(enyo.json.stringify(response));
        this.showScrim(false);
        //TODO:
    },

    inputChange: function(sender, event, value){
        try{

        } catch(e) {
            enyo.log(e);
        }
    },

    onAddressSearchClick: function(inSender, inTwo, inThree) {
        this.showScrim(true);
        var data = {};
        data.address = this.$.plzInput.getValue();

        var url = 'http://service.imperialcoder.com/FuelAustria/Address/?';
        url += enyo.objectToQuery(data);

        if(this.$.getAddressStations.getUrl() != url){
            this.$.getAddressStations.setUrl(url);
        }
        this.$.getAddressStations.call();
    },

    getItem: function(sender, index) {
        var record = this.getData()[index];
        if (record) {
            this.$.gasStationName.setContent(index + 1 + '. ' + record.gasStationName);
            this.$.price.setContent('€ ' +  record.spritPrice[0].amount);
            this.$.open.setSrc(this.translateBoolean(record.open));
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
    }
});