﻿enyo.kind({
	name: "FuelAustria",
	kind: enyo.HFlexBox,
	components: [
		{kind:enyo.VFlexBox, width:'320px', style:"border-right: 2px solid;", components: [
			{kind: "PageHeader", components: [
				{content: "Pane 1"}
			]},
			{flex: 1, kind: "Pane", components: [
				{flex: 1, kind: "Scroller", components: [
					//Insert your components here
				]}
			]}
		]},
		{kind:enyo.VFlexBox, flex:1, components: [
			{kind: "PageHeader", components: [
				{content: "Pane 2"}
			]},
			{flex: 1, kind: "Pane", components: [
				{flex: 1, kind: "Scroller", components: [
					//Insert your components here
				]}
			]},
			{kind: "Toolbar", components: [
			]}
		]}		
	]
});