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
        {name: "getBezirksData", kind: "WebService",
            url: "http://www.spritpreisrechner.at/ts/BezirkStationServlet",
            method: 'GET',
            onSuccess: "gotData",
            onFailure: "gotDataFailure"},
        {name: "getAllBezirke", kind: "WebService",
            url: "http://www.spritpreisrechner.at/ts/BezirkDataServlet",
            method: 'GET',
            onSuccess: "gotBezirke",
            onFailure: "gotBezirkeFailure"
        },
        {
            kind: "Header",
            name: "header",
            className: "enyo-header",
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
                },
                {kind: "Spacer" }
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
        this.$.getAllBezirke.call();
    },
    gotData: function(sender, response, request) {
        if(enyo.isArray(response)) {
            this.setData(response);
        } else {
            enyo.error(enyo.json.stringify(response));
        }
        this.$.priceList.render();

        this.showScrim(false);
    },
    gotDataFailure: function(sender, response, request) {
        enyo.error(enyo.json.stringify(response));
        this.showScrim(false);
        //TODO: error msg
    },
    gotBezirke: function(sender, response, request){
        if(typeof(response)==='string') {
            //TODO: display msg
        } else if(typeof(response)==='object') {
            this.federalStates = this.getFederalStates(response);
            var items = [];
            enyo.forEach(this.federalStates, function(state){
                items.push({caption: state.bezeichnung, value: state.code, record: state});
            }, this);
            this.$.federalStateSelector.setItems(items);
            this.$.federalStateSelector.setValue(items[0].value);
            this.$.federalStateSelector.itemsChanged();
            this.$.stateSpinner.hide();
            this.$.districtSpinner.show();
            this.federalStateChanged(sender, this.$.federalStateSelector.getValue());
        } else {
            //TODO: else what?
        }
    },
    gotBezirkeFailure: function(sender, response, request){
        enyo.error('bezirke error');
        enyo.error(enyo.json.stringify(response));
        this.$.stateSpinner.hide();
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

        var state = this.$.federalStateSelector.getValue();
        var district = this.$.districtSelector.getValue();
        var fuelType = this.doFuelTypeSearch();
        var allDistricts = false;

        var districtOrState = "PB";
        if(!district){
            districtOrState = "BL";
            allDistricts = true;
        }

        var checked = '';
        if(this.doClosedCheck()){
            checked = 'checked';
        }

        var data = '[' + (allDistricts ? state : district) + ', \"' + districtOrState + '\", \"' + fuelType +'\", \"' + checked + '\"]';

        this.$.getBezirksData.call({data: data});
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
        //var record = this.$.listItem.record;
        var station = this.getData()[index];
        this.doStationSelected(station);
//        enyo.windows.activate(undefined, "OptionView",
//            { station: record});
    },


    translateBoolean: function(open){
        if(open){
            return 'images/open.png';
        } else {
            return 'images/closed.png';
        }
    },

    getFederalStates: function(stateObjects){
        var states = [];
        states.push(stateObjects.Burgenland);
        states.push(stateObjects.Kärnten);
        states.push(stateObjects.Niederösterreich);
        states.push(stateObjects.Oberösterreich);
        states.push(stateObjects.Salzburg);
        states.push(stateObjects.Steiermark);
        states.push(stateObjects.Tirol);
        states.push(stateObjects.Vorarlberg);
        states.push(stateObjects.Wien);
        return states;
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