enyo.kind({
    name: "MainStationListView",
    kind: enyo.VFlexBox,
    className: "enyo-bg",
    events: {
        onAddStation: "",
        onEditStation: "",
        onRefresh: ""
    },
    published: {
        activeStation: undefined
    },
    components: [
        {
            kind: "Scroller",
            flex: 1,
            components: [{
                kind: "VFlexBox",
                className: "box-center",
                components: [
                    {
                        kind: "RowGroup",
                        name: "stationList",
                        caption: $L("Stations"),
                        components: [
                            {
                                kind: "Item",
                                tapHighlight: false,
                                components: [{
                                    kind: "HFlexBox",
                                    components: [
                                        {
                                            content: $L("Loading stations...")
                                        }]
                                }
                                ]
                            }]
                    }]
            }]
        },
        {
            kind: "Toolbar",
            name: "toolbarmain",
            pack: "center",
            components: [
                {kind: "Spacer"},
                {
                    kind: "ToolButton",
                    //caption: "New",
                    name: 'newItem',
                    icon: "images/icons/toolbar-icon-new.png",
                    className: "enyo-light-menu-button",
                    onclick: "handleNewItemClick"
                },
                {
                    kind: "ToolButton",
                    //caption: "Refresh",
                    name: 'refreshList',
                    icon: "images/icons/toolbar-icon-sync.png",
                    className: "enyo-light-menu-button",
                    onclick: "refresh"
                }
                ,{kind: "Spacer"}
            ]
        },
        {
            name: "dialogError",
            kind: "ErrorDialog"
        }

    ],

    populateList: function(filterText) {
        enyo.log("populateList: ");
        var filter = filterText;

        app.dbApi.getData(filter, {
            onSuccess: enyo.bind(this, this.handleListItemsResponse),
            onFailure: enyo.bind(this, this.populateListFailure)
        });
    },
    populateListFailure: function() {
        this.log("");

        this.showError("Unable to load fuel stations.");
    },
    handleListItemsResponse: function(request, response, xhr) {
        //enyo.log("StationListView: onSuccess: ");
        this.destroyStationList();

        if (response.results) {

            var activeStation = this.getActiveStation();
            //this.log("-------------------activeStation", activeStation)

            for (var i = 0; i < response.results.length; i++) {
                var station = new Station(response.results[i]);

                station.connecting = activeStation ? (activeStation.id == station.id) : false;
                station.connected = false;

                for (mp in this.existingMounts) {
                    //this.log("existing system mount point: ",this.existingMounts[mp])

                    var stationmountpoint = this.getFixedMountPointPath(station.mountpoint).toLowerCase();

                    if (this.existingMounts[mp].toLowerCase() == stationmountpoint) {
                        station.connected = true;
                    }
                }
                this.addStationItemToList(station);
            }
        }

        this.appendAddStation();

        this.renderStationList();

    },

    create: function() {
        this.inherited(arguments);
        this.refresh();
    },
    showError: function(errorMsg) {
        this.$.dialogError.openAtCenter($L("Connection Error"), errorMsg, "");
    },

    handleSwipeDeleteStationItem: function(inSender, inIndex) {
        this.log("Called: ", inSender.data);
    },

    blockInput: function() {
        enyo.scrim.show();
    },
    unblockInput: function() {
        enyo.scrim.hide();
    },

    addStationItemToList: function(station) {
        this.$.stationList.createComponent({
            kind: "StationItem",
            data: station,
            onConfirm: "handleSwipeDeleteStationItem",
            onTapStationItem: "handleTapStationItem",
            onTapStationDetails: "handleTapStationDetails",
            owner: this
        });
    },

    destroyStationList: function() {
        this.$.stationList.destroyControls();
    },

    renderStationList: function() {
        this.$.stationList.render();
    },

    handleTapStationItem: function(inSender, stationItem) {

        this.log("Called: ", stationItem);

        //this.connectDisconnectStation(stationItem);
    },

    handleTapStationDetails: function(inSender, stationItem) {
        this.log("stationItem: ", stationItem);
        //this.doEditStation(stationItem);
    },

    handleNewItemClick: function(inSender, stationItem) {
        this.doEditStation();
    },
    refresh: function() {
        this.log("refesh called:");
        //this.$.drivelist.call();
    },

    handleDonateClick: function(inSender) {
        var url = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=H52LZT4RHA278";
        this.log();

        this.$.openApp.call(
            {
                "target": url
            }
        )
    }

});