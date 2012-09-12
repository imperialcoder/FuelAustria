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
            kind: "PageHeader",
            name: "header",
			className: 'enyo-header-dark',
            pack: "center",
            components: [
//                {
//                    kind: "ToolButton",
//                    name: 'back',
//                    icon: "images/arrow-left.png",
//                    className: "enyo-light-menu-button",
//                    onclick: 'backButtonClicked'
//                },
//                {kind: "Spacer" },
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
                    {kind: "DividerDrawer", name: "addressDrawer", caption: $L("Address"), open:true, components: [
						{ kind:"AddressPriceItem", name:"addressPrice" }
                    ]},
                    {kind: "DividerDrawer", name:"opneningHoursContainer", caption: $L("OpeningHours"), open:false, components: []},
                    {kind: "DividerDrawer", caption: $L("Contact"), open:false, components: [
                        {kind:"ContactItem", name:"contact"}
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
                        {kind:"Image", name:"mapImage"}
                    ]}
                ]}
            ]
        }
    ],
    setStationValues: function(station){
        this.setStation(station);

        //address
        this.$.addressDrawer.setCaption(station.gasStationName || '-');
		this.$.addressPrice.setData(station.address, station.city, station.spritPrice[0].amount);
        //openinghours
		enyo.forEach(this.$.opneningHoursContainer.getControls(), function(control){
			control.destroy();
		}, this);
        enyo.forEach([1,2,3,4,5,6,7,8], function(order){
            this.getOpeningHoursByOrder(order);
        }, this);
        this.$.opneningHoursContainer.render();
        //contact
		this.$.contact.setData(station.mail, station.telephone, station.fax, station.url);

		//map
		var deviceInfo = enyo.fetchDeviceInfo();
		deviceInfo = deviceInfo || { screenHeight: 640, screenWidth: 640 };
		if(deviceInfo.platformVersionMajor && deviceInfo.platformVersionMajor < 3){
			if(deviceInfo.screenWidth > 320){
				deviceInfo.screenWidth = 320;
			}
			var orientation = enyo.getWindowOrientation();
			enyo.error(orientation);
			if(orientation && (orientation === 'right' || orientation === 'left')){
				var width = deviceInfo.screenWidth;
				deviceInfo.screenWidth = deviceInfo.screenHeight;
				deviceInfo.screenHeight = width;
			}
		}

		var mapSrc = 'http://maps.google.com/maps/api/staticmap?center=LAT,LONG&zoom=14&size=WIDTHxHEIGHT&maptype=roadmap&markers=color:red|label:|LAT,LONG|size:tiny&sensor=false';
		mapSrc = mapSrc.replace(/LAT/g, station.latitude).replace(/LONG/g, station.longitude).replace(/WIDTH/g, deviceInfo.screenWidth).replace(/HEIGHT/g, deviceInfo.screenHeight);
		this.$.mapImage.setSrc(mapSrc);
    },
    getOpeningHoursByOrder: function(order){
        var openingHours = this.getStation().openingHours;
        if(openingHours){
            enyo.forEach(openingHours, function(openingHour){
                if(openingHour.day.order === order){
                    var hours = openingHour.beginn + ' - ' + openingHour.end;
					this.createComponent({
						kind: 'OpeningItem',
						name: order,
						container: this.$.opneningHoursContainer,
						day: openingHour.day.dayLabel,
						time: hours
					});
                    return false;
                }
            }, this);
        }
    },
    backButtonClicked: function(sender, mouseEvent) {
        this.doBackButton();
    }
});