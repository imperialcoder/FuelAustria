enyo.kind({
    name: "OptionView",
    kind: enyo.VFlexBox,
    className: "enyo-bg",
    events: {
        onDistrictSearchClick: "",
        onCurrentPositionClick: "",
        onAddressSearchClick: ""
    },
    components: [
        {kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center", components: [
            {kind: "SpinnerLarge"}
        ]},
        {
            kind: "PageHeader",
            name: "header",
            pack: "center",
            components: [
                {
                    kind: "Control",
                    name: "title",
                    content: $L("Fuel Austria"),
                    className: "enyo-text-header page-title"
                }]
        },
        {
            name      : "getPositionFix",
            kind      : "PalmService",
            service   : "palm://com.palm.location/",
            method    : "getCurrentPosition",
            onSuccess : "getPosSuccess",
            onFailure : "getPosFailure",
            subscribe : false
        },
		{
			name: "dialogError",
			kind: "ErrorDialog"
		},
        {
            kind: "Scroller",
            flex: 1,
            components: [{
                kind: "VFlexBox",
                className: "box-center",
                components: [
                    {kind: "ActivityButton", name:'gpsButton', caption: "In der Nähe", icon: "images/pin.png", onclick: "onPositionBtnClick"},
                    {kind: "IconButton", caption: "Adresse", icon: "images/map.png", onclick: 'onAdressSucheClick'},
                    {kind: "IconButton", caption: "Bezirkssuche", icon: "images/map.png", onclick: "onBezirksSucheClick"},
                    {kind: "RadioGroup", name: "fuelGroup", onclick: "fuelGroupClick",
                        components: [
                            {caption: "Super 95",value: "SUP"},
                            {caption: "Diesel", value: "DIE"}
                        ]
                    },
                    {kind: "HFlexBox", align: "center", tapHighlight: false, components: [
                        {kind: "CheckBox", name:"includeClosedCheck", checked: true, onChange: "checkboxClicked" },
                        {content: "&nbsp;Geschlossene anzeigen"}
                    ]}
                ]}
            ]
        }
    ],
    rendered: function() {
        this.inherited(arguments);
        this.load();
    },
    load: function(){
        //TODO: load from settings
        this.$.fuelGroup.setValue('DIE');
    },
    getFuelType: function() {
        return this.$.fuelGroup.getValue();
    },
    getClosedCheck: function() {
        return this.$.includeClosedCheck.checked;
    },
    onBezirksSucheClick: function(sender) {
        this.doDistrictSearchClick();
    },
    onAdressSucheClick: function(sender) {
        this.doAddressSearchClick();
    },
    //-- GPS --//
    onPositionBtnClick: function(inSender, inTwo, inThree) {
        this.$.getPositionFix.resubscribe = true;
        this.$.getPositionFix.call();
        this.showScrim(true);
    },
    getPosSuccess : function(inSender, inResponse) {
        this.$.getPositionFix.resubscribe = false;
        this.showScrim(false);
        this.doCurrentPositionClick(inResponse);
    },
    getPosFailure : function(inSender, inResponse) {
        enyo.error("getCurrentPosition failure, results=" + enyo.json.stringify(inResponse));
        this.showScrim(false);
		this.handleError(inResponse, $L('ErrorGpsData'));
    },
	handleError: function(response, caption){
		enyo.error(enyo.json.stringify(response));
		var errorText = '';
		if(response.errorCode){
			enyo.error('in error code')
			errorText = response.errorCode === 5 ? $L('GpsNotEnabled') : response.errorCode === 8 ? $L('GpsNotAllowed') : '';
			enyo.error('errortext at end: ' + errorText)
		}
		if(errorText === ''){
			errorText = response.errorText || enyo.json.stringify(response);
		}
		this.showErrorDialog(caption, errorText, 'OK')
	},
	showErrorDialog: function(caption, message, buttonName){
		this.$.dialogError.openAtCenter(caption, message, buttonName);
	},
    //-- GPS --//
    showScrim: function(inShowing) {
        //this.$.scrim.setShowing(inShowing);
		//this.$.spinnerLarge.setShowing(inShowing);
		var a = this.$.gpsButton.getActive();
		this.$.gpsButton.setActive(!a);
    }
});
