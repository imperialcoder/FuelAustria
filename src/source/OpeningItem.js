enyo.kind({
    kind: "Control",
    name: "OpeningItem",
	className: 'detailItem',
    published: {
        day: '',
		time: ''
    },

    components: [
		{layoutKind: "HFlexLayout", components:[
			{ tag: "span", name: "day" },
			{ tag: "span", name: "time", flex:1, className: 'rightAlign' }
		]}
    ],

	create: function() {
		this.inherited(arguments);
		this.dayChanged();
		this.timeChanged();
	},
	dayChanged: function(){
		this.$.day.setContent(this.day);
	},
	timeChanged: function(){
		this.$.time.setContent(this.time);
	}
});
