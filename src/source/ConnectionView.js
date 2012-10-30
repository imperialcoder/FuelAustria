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
        {
            kind: "Scroller",
            flex: 1,
            components: [
                {kind: "VFlexBox", align: "center", pack: "center", components: [
                    { kind: "HtmlContent", name: "message" },
                    //TODO: Enter Page Image
                    { name: "acceptButton", kind: "Button", caption: 'Retry', className: "enyo-button-affirmative", onclick: "retryConnectionCheck", width:"50%" }
                ]}
            ]
        }
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
            this.setMessage("No Internet connection!");

        }
    },
    connectionFailure : function(inSender, inResponse) {
        this.showScrim(false);
        enyo.error("connection check failure, result=" + enyo.json.stringify(inResponse));
        this.setMessage(inResponse.errorText);
    },

    retryConnectionCheck: function(sender, event) {
        this.showScrim(true);
        this.$.getConnMgrStatus.call();
    },

    showScrim: function(inShowing) {
        this.$.scrim.setShowing(inShowing);
        this.$.spinnerLarge.setShowing(inShowing);
    },

    messageChanged: function() {
        this.$.message.setContent(this.message.replace(/\n/g, '<br>'));
    },
});