enyo.kind({
    kind: "Control",
    name: "PaymentItem",
	className: 'detailItem',
    published: {
        bar: false,
		kredit: false,
		club: false,
		clubCard: '',
		maestro: false,
		companionship: false,
		payMethod: '',
		access: ''
    },

    components: [
		{layoutKind: "VFlexLayout", components:[
			{layoutKind: "HFlexLayout", name: "bar", components:[
				{ kind: "Image", src: "images/icon_check-16.png", className: 'imageSep' },
				{ tag: "span", content: $L("Cash") }
			]},
			{layoutKind: "HFlexLayout", name: "kredit", components:[
				{ kind: "Image", name: 'kreditImage', src: "images/icon_check-16.png", className: 'imageSep' },
				{ tag: "span", content: $L("Credit card") }
			]},
			{layoutKind: "HFlexLayout", name: "club", components:[
				{ kind: "Image", name: 'clubImage', src: "images/icon_check-16.png", className: 'imageSep' },
				{ tag: "span", name:'clubCard' }
			]},
			{layoutKind: "HFlexLayout", name: "maestro", components:[
				{ kind: "Image", name: 'maestroImage', src: "images/icon_check-16.png", className: 'imageSep' },
				{ tag: "span", content: $L("Maestro") }
			]},
			{layoutKind: "HFlexLayout", name: "companionship", components:[
				{ kind: "Image", name: 'companionshipImage', src: "images/icon_check-16.png", className: 'imageSep' },
				{ tag: "span", content: $L("Companionship") }
			]},
			{layoutKind: "HFlexLayout", name: "payMethod", components:[
				{ kind: "Image", name: 'payMethodImage', src: "images/icon_check-16.png", className: 'imageSep' },
				{ tag: "span", name: 'payMethodText' }
			]},
			{layoutKind: "HFlexLayout", name: "access", components:[
				{ kind: "Image", name: 'accessImage', src: "images/icon_check-16.png", className: 'imageSep' },
				{ tag: "span", name:'accessText' }
			]}
		]}
    ],

	create: function() {
		this.inherited(arguments);
		this.barChanged();
		this.kreditChanged();
		this.clubChanged();
		this.maestroChanged();
		this.companionshipChanged();
		this.payMethodChanged();
		this.accessChanged();
	},
	barChanged: function(){
		this.$.bar.setShowing(this.getBar());
	},
	kreditChanged: function(){
		this.$.kredit.setShowing(this.getKredit());
	},
	clubChanged: function(){
		this.$.club.setShowing(this.getClub());
		this.$.clubCard.setContent(this.getClubCard());
	},
	maestroChanged: function(){
		this.$.maestro.setShowing(this.getMaestro());
	},
	companionshipChanged: function(){
		this.$.companionship.setShowing(this.getCompanionship());
	},
	payMethodChanged: function(){
		this.$.payMethod.setShowing(this.getPayMethod());
		this.$.payMethodText.setContent(this.getPayMethod());
	},
	accessChanged: function(){
		this.$.access.setShowing(this.getAccess());
		this.$.accessText.setContent(this.getAccess());
	},
	setData: function(bar, kredit, club, clubCard, maestro, companionship, payMethod, access){
		this.setBar(bar);
		this.setKredit(kredit);
		this.setClub(club);
		this.setClubCard(clubCard);
		this.setMaestro(maestro);
		this.setCompanionship(companionship);
		this.setPayMethod(payMethod);
		this.setAccess(access);
	}
});
