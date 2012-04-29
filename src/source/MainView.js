enyo.kind({
	name: "FuelAustria",
    kind: enyo.VFlexBox,
    data: [],
    federalStates: [],
    components: [
        {name: "getBezirksData", kind: "WebService",
            url: "http://www.spritpreisrechner.at/ts/BezirkStationServlet",
            method: 'GET',
            onSuccess: "gotData",
            onFailure: "gotDataFailure"},
        {name: "getAllBezirke", kind: "WebService",
            url: "http://www.spritpreisrechner.at/ts/BezirkDataServlet",
            method: 'GET',
            onSuccess: "gotBezirke",
            onFailure: "gotBezirkeFailure"},
        {name: "slidingPane", kind: "SlidingPane", flex: 1, components: [
            {name: "left", width: "320px", kind:"SlidingView", components: [
                {kind: "Header", content:"Options"},
                {kind: "Scroller", flex: 1, components: [
                    {kind: "IconButton", caption: "In der Nähe", icon: "images/pin.png", height:65},
                    {kind: "IconButton", caption: "Adresse", icon: "images/map.png"},
                    {kind: "IconButton", caption: "Bezirkssuche", icon: "images/map.png", onclick: "onBezirksSucheClick"},
                    {kind: "RadioGroup", name: "fuelGroup", onclick: "fuelGroupClick",
                        components: [
                            {caption: "Super 95",value: "SUP"},
                            {caption: "Diesel", value: "DIE"}
                        ]
                    },
                    {kind: "HFlexBox", align: "center", tapHighlight: false, components: [
                        {kind: "CheckBox", name:"includeClosedCheck", checked: true, onChange: "checkboxClicked" },
                        {content: "&nbsp;Geschlossene anzeigen"}
                    ]}
                ]},
                {kind: "Toolbar", components: [
                    //Insert if needed
                ]}
            ]},
            {name: "right", kind:"SlidingView", flex: 1, components: [
                {kind: "Header", content:"Content"},
                {kind: "Scroller", flex: 1, components: [
                    {kind: "ListSelector", label:'Bundesland', name:'federalStateSelector', popupAlign:'left', contentPack:'middle', onChange: "federalStateChanged", items: []},
                    {kind: "ListSelector", label:'Bezirk', name:'districtSelector', popupAlign:'left', contentPack:'middle', onChange: "districtChanged", items: []},
                    {kind: "Button", caption: "Bezirkssuche",  onclick: "onBezirksAuswahlSucheClick"},
                    {kind: "VirtualRepeater", onSetupRow: 'getItem', name: 'priceList', components: [
                        {kind: "Item", name:'listItem', layoutKind: "HFlexLayout", onclick: "doListTap",  components: [
                            {name: "gasStationName", flex: 2},
                            {name: "price", flex: 1},
                            {name: "open", flex: 1},
                            {kind: "Image", width:18, height:18, src: "images/arrow-right.png"}
                        ]}
                    ]}
                ]},
                {kind: "Toolbar", components: [
                    {kind: "GrabButton"}
                ]}
            ]}
        ]}
    ],
    rendered: function() {
        this.load();
    },
    load: function(){
        this.$.fuelGroup.setValue('DIE');
    },
    fuelGroupClick: function(sender){
        console.log('fuelGroupClick');
    },
    checkboxClicked: function(sender){
        console.log('checkboxClicked');
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
    onBezirksAuswahlSucheClick: function(inSender, inTwo, inThree) {
        var state = this.$.federalStateSelector.getValue();
        var district = this.$.districtSelector.getValue();
        var fuelType = this.$.fuelGroup.getValue();
        var allDistrcicts = false;

        var districtOrState = "PB";
        if(!district){
            districtOrState = "BL";
            allDistrcicts = true;
        }

        var checked = '';
        if(this.$.includeClosedCheck.checked){
            checked = 'checked';
        }

        var data = '[' + (allDistrcicts ? state : district) + ', \"' + districtOrState + '\", \"' + fuelType +'\", \"' + checked + '\"]';

        this.$.getBezirksData.call({data: data});
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
            this.$.districtSelector.setValue(0);
        }
    },
    districtChanged: function(sender, value, oldValue) {
        enyo.log(value);
    },
    translateBoolean: function(open){
        if(open){
            return 'Offen';
        } else {
            return 'Geschlossen';
        }
    },
    doListTap: function(sender, mouseEvent, index){
        var record = this.$.listItem.record;
        enyo.log(record);
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
    }
});