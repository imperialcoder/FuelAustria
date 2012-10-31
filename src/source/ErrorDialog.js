enyo.kind({
    name: "ErrorDialog",
    kind: "Popup",
    lazy: false,
    scrim: true,
    contentHeight: "100%",
    width: "80%",
    height: "80%",
    published: {
        title: "",
        message: "",
        acceptButtonCaption: "OK"
    },
    
    components: [
        {kind: "Scroller", style: "height: 90%;", components: [
            {kind: "VFlexBox", components: [
                { name: "title", width:"100%", style:"text-align: center; padding-bottom: 6px;" },
                { name: "message",  className: "enyo-paragraph", allowHtml: true }  
            ]}
        ]},
        {kind: "VFlexBox", align: "center", pack: "center", components: [
            { name: "acceptButton", kind: "Button", onclick: "acceptClick", width:"50%" }
        ]}
    ],

    create: function() {
        this.inherited(arguments);
        this.titleChanged();
        this.messageChanged();
        this.acceptButtonCaptionChanged();
    },

    openAtCenter: function(inTitle, inMessage, inAcceptButtonCaption) {
        if (inTitle) {
            this.setTitle(inTitle);
        } else {
            this.setTitle();
        }
        if (inMessage) {
            this.setMessage(inMessage);
        } else {
            this.setMessage($L("No description available"));
        }
        if (inAcceptButtonCaption) {
            this.setAcceptButtonCaption(inAcceptButtonCaption);
        } else {
            this.setAcceptButtonCaption('OK');
        }
        this.inherited(arguments);
    },

    titleChanged: function() {
        this.$.title.setContent(this.title);
        this.$.title.setShowing(this.title);
    },

    messageChanged: function() {
        this.$.message.setContent(this.getMessage());//.replace(/\n/g, '<br>'));
    },

    acceptButtonCaptionChanged: function() {
        this.$.acceptButton.setCaption(this.getAcceptButtonCaption());
    },

    acceptClick: function() {
        this.close();
    }
});
