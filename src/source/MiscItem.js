enyo.kind({
    kind: "Control",
    name: "MiscItem",
	className: 'detailItem',
    published: {
        serviceText: ''
    },

    components: [
		{layoutKind: "VFlexLayout", components:[
			{layoutKind: "HFlexLayout", name: "service", components:[
				{ kind: "Image", name: "serviceTextImage", src: "images/icon_check-16.png", className: 'imageSep' },
				{ tag: "span", name: "serviceText" }
			]}
		]}
    ],

	create: function() {
		this.inherited(arguments);
		this.serviceTextChanged();
	},
	serviceTextChanged: function(){
		if(!this.getServiceText()) {
			this.$.serviceText.setContent($L("This station provided no data."));
		} else {
			this.$.serviceText.setContent(this.getServiceText());
		}
		this.$.serviceTextImage.setShowing(this.getServiceText());
	}
});
