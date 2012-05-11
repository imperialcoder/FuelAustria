enyo.kind({
    name: "StationDetailView",
    kind: enyo.VFlexBox,
    className: "enyo-bg",
    events: {
        onBackButton: ""
    },
    published: {
        station: {}
    },
    components: [
        {kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center", components: [
            {kind: "SpinnerLarge"}
        ]},
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
        {
            kind: "Scroller",
            flex: 1,
            components: [{
                kind: "VFlexBox",
                className: "box-center",
                components: [
                    {kind: "DividerDrawer", name: "addressDrawer", caption: $L("Address"), open:true, components: [
                        {layoutKind: "HFlexLayout", components:[
                            {layoutKind: "VFlexLayout", flex:2, components:[
                                {kind:"Control", name:"addressContainer", content:""},
                                {kind:"Control", name:"cityContainer", content:""}
                            ]},
                            {kind:"Spacer", flex:0.5},
                            {kind:"Control", name:"priceContainer", flex:1, content:""}
                        ]}
                    ]},
                    {kind: "DividerDrawer", name:"opneningHoursContainer", caption: $L("OpeningHours"), open:false, components: []},
                    {kind: "DividerDrawer", caption: $L("Contact"), open:false, components: [
                        {content: $L("Mail"), flex:1},
                        {kind:"Control", name:"mailContainer", content:""},
                        {kind:"Spacer"},
                        {content: $L("Telephone")},
                        {kind:"Control", name:"telephoneContainer", content:""},
                        {kind:"Spacer"},
                        {content: $L("Fax")},
                        {kind:"Control", name:"faxContainer", content:""},
                        {kind:"Spacer"},
                        {content: $L("URL")},
                        {kind:"Control", name:"urlContainer", content:""}
                    ]},
                    {kind: "DividerDrawer", caption: $L("Offer"), open:false, components: [
                        {kind:"Control", name:"OfferContent", content: ""}
                    ]},
                    {kind: "DividerDrawer", caption: $L("Payment"), open:false, components: [
                        {kind:"Control", name:"paymentContent", content: ""}
                    ]},
                    {kind: "DividerDrawer", caption: $L("Misc"), open:false, components: [
                        {kind:"Control", name:"miscContent", content: ""}
                    ]},
                    {kind: "DividerDrawer", caption: $L("Map"), open:false, components: [
                        {kind:"Control", name:"mapContent", content: ""}
                    ]}
                ]}
            ]
        }
    ],
    setStationValues: function(){
        var station = this.getStation();
        if(station){
            //address
            this.$.addressDrawer.setCaption(station.gasStationName);
            this.$.addressContainer.setContent(station.address);
            this.$.cityContainer.setContent(station.city);
            this.$.priceContainer.setContent('€ ' +  station.spritPrice[0].amount);
            //openinghours
            enyo.forEach([1,2,3,4,5,6,7,8], function(order){
                this.getOpeningHoursByOrder(order);
            }, this);
            this.$.opneningHoursContainer.render();
            //contact
            this.$.mailContainer.setContent(station.mail);
            this.$.telephoneContainer.setContent(station.telephone);
            this.$.faxContainer.setContent(station.fax);
            this.$.urlContainer.setContent(station.url);
        } else {
            //TODO:
        }

    },
    getOpeningHoursByOrder: function(order){
        var openingHours = this.getStation().openingHours;
        if(openingHours){
            enyo.forEach(openingHours, function(openingHour){
                if(openingHour.day.order === order){
                    var hours = openingHour.beginn + ' - ' + openingHour.end;
                    this.$.opneningHoursContainer.createComponent({
                        kind: "Control",
                        content: openingHour.day.dayLabel,
                        owner: this
                    });
                    this.$.opneningHoursContainer.createComponent({
                        kind: "Spacer",
                        owner: this
                    });
                    this.$.opneningHoursContainer.createComponent({
                        kind: "Control",
                        content: hours,
                        owner: this
                    });
                    return false;
                }
            }, this);
        }
    },
    backButtonClicked: function(sender, mouseEvent) {
        //this.$.addressDrawer.destroyControls();
        this.doBackButton();
    }
});