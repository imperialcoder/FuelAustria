enyo.kind({
    name: "ErrorDialog",
    kind: "Popup",
	//layoutKind: "VFlexLayout",
	lazy: false,
	caption: '',
	contentHeight: "100%",
	width: "80%",
	height: "80%",
	published: {
        message: "",
        acceptButtonCaption: "Retry"
    },
    events: {
        onButtonClick: ""
    },

    components: [
		{
            kind: "Scroller",
            flex: 1,
            components: [
                {kind: "VFlexBox", align: "center", pack: "center", components: [
                    {kind: "HtmlContent", name: "message"},
                    { name: "acceptButton", kind: "Button", className: "enyo-button-affirmative", onclick: "acceptClick", width:"50%" }
                ]}
            ]
        }
    ],

    create: function() {
        this.inherited(arguments);
        this.messageChanged();
        this.acceptButtonCaptionChanged();
    },

    openAtCenter: function(inTitle, inMessage, inAcceptButtonCaption) {
		if (inTitle) {
			this.setCaption(inTitle);
        } else {
			this.setCaption('');
		}
        if (inMessage) {
            this.setMessage(inMessage);
        } else {
			this.setMessage('');
		}
        if (inAcceptButtonCaption) {
            this.setAcceptButtonCaption(inAcceptButtonCaption);
        } else {
			this.setAcceptButtonCaption('Ok');
		}
        this.inherited(arguments);
    },

    messageChanged: function() {
        this.$.message.setContent(this.message.replace(/\n/g, '<br>'));
    },

    acceptButtonCaptionChanged: function() {
        this.$.acceptButton.setCaption(this.acceptButtonCaption);
    },

    acceptClick: function() {
        this.doButtonClick();
        this.close();
    }
});
