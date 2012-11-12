enyo.kind({
    kind: "Control",
    name: "OfferItem",
	className: 'detailItem',
    published: {
        self: false,
		automat: false,
		service: false
    },

    components: [
		{layoutKind: "VFlexLayout", components:[
			{layoutKind: "HFlexLayout", name: "self", components:[
				{ kind: "Image", src: "images/icon_check-16.png", className: 'imageSep' },
				{ tag: "span", content: $L("Self service") }
			]},
			{layoutKind: "HFlexLayout", name: "automat", components:[
				{ kind: "Image", name: 'automatImage', src: "images/icon_check-16.png", className: 'imageSep' },
				{ tag: "span", content: $L("Automat") }
			]},
			{layoutKind: "HFlexLayout", name: "service", components:[
				{ kind: "Image", name: 'serviceImage', src: "images/icon_check-16.png", className: 'imageSep' },
				{ tag: "span", content: $L("Service") }
			]}
		]}
    ],

	create: function() {
		this.inherited(arguments);
		this.selfChanged();
		this.automatChanged();
		this.serviceChanged();
	},
	selfChanged: function(){
		this.$.self.setShowing(this.getSelf());
	},
	automatChanged: function(){
		this.$.automat.setShowing(this.getAutomat());
	},
	serviceChanged: function(){
		this.$.service.setShowing(this.getService());
	},
	setData: function(self, automat, service){
		this.setSelf(self);
		this.setAutomat(automat);
		this.setService(service);
	}
});
