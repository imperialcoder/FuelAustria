enyo.kind({
    kind: "Item",
    name: "StationListItem",
    published: {
		open: false,
		gasStationName: '',
		price: '',
		distance: ''
    },

    components: [
		{layoutKind: "HFlexLayout", className: 'generalFont', components:[
			{kind: "Image", name:"openImage", className: 'imageSep'},
			{name: "gasStationName", flex: 1},
			{layoutKind: "VFlexLayout", className: 'generalFont', components:[
				{name: "price", className: 'rightAlign'},
				{name: "distance", className: 'distance'},
			]}
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
		this.$.gasStationName.setContent(this.getGasStationName());
	},
	priceChanged: function(){
		this.$.price.setContent(this.getPrice());
	},
	distanceChanged: function(){
		this.$.distance.setContent(this.getDistance());
	},
	translateBoolean: function(open){
		if(open){
			return 'images/open.png';
		} else {
			return 'images/closed.png';
		}
	}
});
