enyo.kind({
    kind: "Item",
    name: "StationListItem",
    published: {
		open: false,
		gasStationName: '',
		price: ''
    },

    components: [
		{layoutKind: "HFlexLayout", className: 'generalFont', components:[
			{kind: "Image", name:"openImage", className: 'imageSep'},
			{name: "gasStationName", flex: 1},
			{name: "price", className: 'rightAlign'}
		]}
    ],

	create: function() {
		this.inherited(arguments);
		this.openChanged();
		this.gasStationNameChanged();
		this.priceChanged();
	},
	openChanged: function(){
		this.$.openImage.setSrc(this.translateBoolean(this.open));
	},
	gasStationNameChanged: function(){
		this.$.gasStationName.setContent(this.gasStationName);
	},
	priceChanged: function(){
		this.$.price.setContent(this.price);
	},
	translateBoolean: function(open){
		if(open){
			return 'images/open.png';
		} else {
			return 'images/closed.png';
		}
	}
});
