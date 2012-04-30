enyo.kind({
    kind: "SwipeableItem",
    name: "StationItem",
    style: "padding-top: 0px; padding-bottom: 4px;",
    tapHighlight: true,

    events: {
        onTapStationItem: "",
        onTapStationDetails: ""
    },

    published: {
        data: {}
    },

    components: [
        { kind: "HFlexBox", align: "center", onclick: "handleTapOnStationName", components: [
            { kind: "VFlexBox", flex: 1, components: [
                { name: "stationName" }
            ]},
            { name: "spinner", kind: "Spinner", style: "margin-right: 1px;" },,
            { name: "stationDetails", className: "info-icon", onclick: "handleTapOnStationDetailsIcon", onmousedown: "applySelectedStyle", onmouseup: "removeSelectedStyle", onmouseout: "removeSelectedStyle" }
        ]}
    ],

    create: function() {
        this.inherited(arguments);

        // set confirm caption to 'Delete'
        this.setConfirmCaption($L("Delete"));

        // show profile name
        this.$.stationName.setClassName("enyo-text-ellipsis");
        this.$.stationName.setContent(this.data.name);

        //this.log("++++++++++++++++++++++++ " + this.data.name + ": connecting: ", this.data.connecting)
//        if(this.data.connecting == true){
//            this.$.spinner.show();
//        }else{
//            this.$.spinner.hide();
//        }

        // show/hide connected checkmark
        this.$.checkmark.setClassName("checkmark " + this.data.open);

    },

    handleTapOnStationName: function() {
        enyo.log("Tapped on StationName, stationItem: ", this.data);
        this.doTapStationItem(this.data);
    },

    handleTapOnStationDetailsIcon: function() {
        enyo.log("Tapped on Station Details Icon, stationItem: ", this.data);
        this.doTapStationDetails(this.data);
        return true;
    },

    applySelectedStyle: function() {
        this.$.stationDetails.addClass("selected");
    },

    removeSelectedStyle: function() {
        this.$.stationDetails.removeClass("selected");
    }
});
