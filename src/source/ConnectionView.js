enyo.kind({
    name: "DistrictSelectionView",
    kind: enyo.VFlexBox,
    className: "enyo-bg",
    data: [],
    events: {
        onRetry: ""
    },
    components: [
        {kind: "ActivityButton", caption: "Bezirkssuche", name: 'searchButton',  onclick: "retryConnectionCheck"}
    ] ,

    retryConnectionCheck: function(sender, event) {

    }
});