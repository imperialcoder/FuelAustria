enyo.kind({
    name: "ConnectionView",
    kind: enyo.VFlexBox,
    className: "enyo-bg",
    events: {
        onRetry: "",
        onConnectionEstablished: ""
    },
    published: {
        message: ''
    },
    components: [
        {kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center", components: [
            {kind: "SpinnerLarge"}
        ]},
        {
            name : "getConnMgrStatus",
            kind : "PalmService",
            service : "palm://com.palm.connectionmanager/",
            method : "getStatus",
            onSuccess : "connectionSuccess",
            onFailure : "connectionFailure",
            subscribe : false
        },
        { kind: "Scroller", flex: 1, components: [
            {kind: "VFlexBox", align: "center", components: [
                //TODO: Enter Page Image 
                { name: "message",  className: "enyo-paragraph", allowHtml: true, showing: false }  
            ]}
        ]},
        {kind: "VFlexBox", align: "center", pack: "center", components: [
            { name: "acceptButton", kind: "Button", caption: $L('Retry'), onclick: "retryConnectionCheck", width:"50%", showing: false }
        ]}
    ] ,

    create: function() {
        this.inherited(arguments);
        this.showScrim(true);
        this.$.getConnMgrStatus.call();
    },

    connectionSuccess : function(inSender, inResponse) {
        this.showScrim(false);
        if(inResponse.isInternetConnectionAvailable) {
            this.doConnectionEstablished();
        } else {
            enyo.error("connection check failure, result=" + enyo.json.stringify(inResponse));
            this.setMessage($L("No Internet connection!"));
        }
    },
    connectionFailure : function(inSender, inResponse) {
        this.showScrim(false);
        enyo.error("connection check failure, result=" + enyo.json.stringify(inResponse));
        this.setMessage(inResponse.errorText || $L('No Internet connection!'));
    },

    retryConnectionCheck: function(sender, event) {
        this.$.message.setShowing(false);
        this.$.acceptButton.setShowing(false);
        this.showScrim(true);
        this.$.getConnMgrStatus.call();
    },

    showScrim: function(inShowing) {
        this.$.scrim.setShowing(inShowing);
        this.$.spinnerLarge.setShowing(inShowing);
    },

    messageChanged: function() {
        this.$.message.setContent(this.getMessage());//.replace(/\n/g, '<br>'));
        this.$.message.setShowing(true);
        this.$.acceptButton.setShowing(true);
    },
});