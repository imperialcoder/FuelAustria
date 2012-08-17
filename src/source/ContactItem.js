enyo.kind({
    kind: "Control",
    name: "ContactItem",
	className: 'detailItem',
    published: {
        mail: '',
		telephone: '',
		fax: '',
		url: ''
    },

	components: [
		{layoutKind: "VFlexLayout", components:[
			{layoutKind: "HFlexLayout", components:[
				{ kind: "Image", name: 'mailImage', src: "images/mail.png", className: 'imageSep' },
				{ tag: "span", name: "mail" }
			]},
			{layoutKind: "HFlexLayout", components:[
				{ kind: "Image", name: 'telephoneImage', src: "images/telephone.png", className: 'imageSep' },
				{ tag: "span", name: "telephone" }
			]},
			{layoutKind: "HFlexLayout", components:[
				{ kind: "Image", name: 'faxImage', src: "images/fax.png", className: 'imageSep' },
				{ tag: "span", name: "fax" }
			]},
			{layoutKind: "HFlexLayout", components:[
				{ kind: "Image", name: 'urlImage', src: "images/url.png", className: 'imageSep' },
				{ tag: "span", name: "url" }
			]}
		]}
	],

	create: function() {
		this.inherited(arguments);
		this.mailChanged();
		this.telephoneChanged();
		this.faxChanged();
		this.urlChanged();
	},
	mailChanged: function(){
		this.$.mail.setContent(this.mail);
		this.$.mailImage.setShowing(this.mail);
	},
	telephoneChanged: function(){
		this.$.telephone.setContent(this.telephone);
		this.$.telephoneImage.setShowing(this.telephone);
	},
	faxChanged: function(){
		this.$.fax.setContent(this.fax);
		this.$.faxImage.setShowing(this.fax);
	},
	urlChanged: function(){
		this.$.url.setContent(this.url);
		this.$.urlImage.setShowing(this.url);
	},
	setData: function(mail, telephone, fax, url){
		this.setMail(mail);
		this.setTelephone(telephone);
		this.setFax(fax);
		this.setUrl(url) ;
	}
});
