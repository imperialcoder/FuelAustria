enyo.kind({
    name: "OptionView",
    kind: enyo.VFlexBox,
    className: "enyo-bg",
    events: {
        onDistrictSearchClick: "",
        onCurrentPositionClick: "",
        onAddressSearchClick: ""
    },
    components: [
        {kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center", components: [
            {kind: "SpinnerLarge"}
        ]},
        {
            kind: "PageHeader",
            name: "header",
            pack: "center",
            components: [
                {
                    kind: "Control",
                    name: "title",
                    content: $L("Fuel Austria"),
                    className: "enyo-text-header page-title"
                }]
        },
        {
            name      : "getPositionFix",
            kind      : "PalmService",
            service   : "palm://com.palm.location/",
            method    : "getCurrentPosition",
            onSuccess : "getPosSuccess",
            onFailure : "getPosFailure",
            subscribe : false
        },
        {
            kind: "Scroller",
            flex: 1,
            components: [{
                kind: "VFlexBox",
                className: "box-center",
                components: [
                    {kind: "IconButton", caption: "In der Nähe", icon: "images/pin.png", onclick: "onPositionBtnClick"},
                    {kind: "IconButton", caption: "Adresse", icon: "images/map.png", onclick: 'onAdressSucheClick'},
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
                ]}
            ]
        }
    ],
    rendered: function() {
        this.inherited(arguments);
        this.load();
    },
    load: function(){
        //TODO: load from settings
        this.$.fuelGroup.setValue('DIE');
    },
    getFuelType: function() {
        return this.$.fuelGroup.getValue();
    },
    getClosedCheck: function() {
        return this.$.includeClosedCheck.checked;
    },
    onBezirksSucheClick: function(sender) {
        this.doDistrictSearchClick();
    },
    onAdressSucheClick: function(sender) {
        this.doAddressSearchClick();
    },
    //-- GPS --//
    onPositionBtnClick: function(inSender, inTwo, inThree) {
        this.$.getPositionFix.resubscribe = true;
        this.$.getPositionFix.call();
        this.showScrim(true);
    },
    getPosSuccess : function(inSender, inResponse) {
        this.$.getPositionFix.resubscribe = false;
        this.showScrim(false);
        this.doCurrentPositionClick(inResponse);
    },
    getPosFailure : function(inSender, inResponse) {
        enyo.error("getCurrentPosition failure, results=" + enyo.json.stringify(inResponse));
        this.showScrim(false);
    },
    //-- GPS --//

    showScrim: function(inShowing) {
        this.$.scrim.setShowing(inShowing);
        this.$.spinnerLarge.setShowing(inShowing);
    }
});
