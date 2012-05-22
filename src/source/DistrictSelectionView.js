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
        data: []
    },
    components: [
        {kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center", components: [
            {kind: "SpinnerLarge"}
        ]},
        {name: "getAllStations", kind: "WebService",
            url: "http://imperialcoder.no.de/FuelAustria/AllStations/",
            method: 'GET',
            onSuccess: "gotData",
            onFailure: "gotDataFailure"},
        {name: "getStationsForDistrict", kind: "WebService",
            url: "http://imperialcoder.no.de/FuelAustria/DistrictStations/",
            method: 'GET',
            onSuccess: "gotData",
            onFailure: "gotDataFailure"},
        {name: "getBaseData", kind: "WebService",
            url: "http://imperialcoder.no.de/FuelAustria/BaseData/",
            method: 'GET',
            onSuccess: "gotBezirke",
            onFailure: "gotBezirkeFailure"
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
        {kind: "ListSelector", label:'Bundesland', name:'federalStateSelector', popupAlign:'left', contentPack:'middle', onChange: "federalStateChanged", items: [], components: [
            {kind: enyo.Spinner, name: "stateSpinner"}]},
        {kind: "ListSelector", label:'Bezirk', name:'districtSelector', popupAlign:'left', contentPack:'middle', onChange: "districtChanged", items: [], components: [
            {kind: enyo.Spinner, name: "districtSpinner"}]},
        {kind: "ActivityButton", caption: "Suche starten", name: 'searchButton',  onclick: "onBezirksAuswahlSucheClick"},
        {kind: "Scroller", flex:1, components: [
            {kind: "VFlexBox", className: "box-center", components: [
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
        ]}
    ],
    create: function() {
        this.inherited(arguments);
        this.dataChanged();
        this.$.stateSpinner.show();
        this.$.getBaseData.call();
    },
    gotData: function(sender, response, request) {
        if(!response.success){
            //TODO: error msg
            enyo.error(enyo.json.stringify(response));
        } else {
            this.setData(response.data);
        }
        this.$.priceList.render();

        this.showScrim(false);
    },
    gotDataFailure: function(sender, response, request) {
        var errorCode = response.errorCode;

        enyo.error(enyo.json.stringify(response));
        this.showScrim(false);
        //TODO: error msg
    },
    gotBezirke: function(sender, response, request){
        if(!response.success){
            //TODO: error msg
            enyo.error(JSON.stringify(response));
            this.$.stateSpinner.hide();
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
        }
    },
    gotBezirkeFailure: function(sender, response, request){
        enyo.error('bezirke error');
        enyo.error(enyo.json.stringify(response));
        this.$.stateSpinner.hide();
        //TODO: show error msg
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
            var items = [{caption: 'Alle', value:0}];
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
            var url = 'http://imperialcoder.no.de/FuelAustria/AllStations/?';
            url += enyo.objectToQuery(data);

            this.$.getAllStations.setUrl(url);
            this.$.getAllStations.call();
        } else {
            var url = 'http://imperialcoder.no.de/FuelAustria/DistrictStations/?';
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
    }
});