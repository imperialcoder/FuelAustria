enyo.kind({
    kind: "Control",
    name: "OfferAreaItem",
	className: 'detailItem',
    published: {
        address: '',
		city: '',
		price: ''
    },

    components: [
		{layoutKind: "HFlexLayout", components:[
			{layoutKind: "VFlexLayout", flex:1, components:[
				{ tag: "span", name: "address" },
				{ tag: "span", name: "city" }
			]},
			{ tag: "span", name: "price" }
		]}
    ],

	create: function() {
		this.inherited(arguments);
		this.addressChanged();
		this.cityChanged();
		this.priceChanged();
	},
	addressChanged: function(){
		this.$.address.setContent(this.address);
	},
	cityChanged: function(){
		this.$.city.setContent(this.city);
	},
	priceChanged: function(){
		this.$.price.setContent(this.price ? ('€ ' + this.price) : '-');
	},
	setData: function(address, city, price){
		this.setAddress(address);
		this.setCity(city);
		this.setPrice(price);
	}
});
