enyo.kind({
    name: "ConnectionView",
    kind: enyo.VFlexBox,
    className: "enyo-bg",
    events: {
        onRetry: "",
        onConnectionEstablished: ""
    },
    components: [
        {kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center", components: [
            {kind: "SpinnerLarge"}
        ]}, //TODO: Enter Page Image
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
            name: "dialogError",
            kind: "ErrorDialog",
            onButtonClick: "retryConnectionCheck"
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
            this.$.dialogError.openAtCenter($L("Connection Error"), "No Internet connection!", "Retry");
        }
    },
    connectionFailure : function(inSender, inResponse) {
        this.showScrim(false);
        enyo.error("connection check failure, result=" + enyo.json.stringify(inResponse));
        this.$.dialogError.openAtCenter($L("Connection Error"), inResponse.errorText, "");
    },

    retryConnectionCheck: function(sender, event) {
        this.showScrim(true);
        this.$.getConnMgrStatus.call();
    },

    showScrim: function(inShowing) {
        this.$.scrim.setShowing(inShowing);
        this.$.spinnerLarge.setShowing(inShowing);
    }
});