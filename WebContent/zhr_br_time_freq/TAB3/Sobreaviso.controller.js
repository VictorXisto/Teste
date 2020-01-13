sap.ui.controller("zhr_br_time_freq.TAB3.Sobreaviso", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already
	 * created. Can be used to modify the View before it is displayed, to bind event handlers and do
	 * other one-time initialization.
	 * 
	 * @memberOf zhr_br_time_freq.TAB3.Sobreaviso
	 */
	onInit : function() {
		// var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
		// var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
		// this.get_SobreAviso_Data(oPernr, oPeriodo)
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is
	 * re-rendered (NOT before the first rendering! onInit() is used for that one!).
	 * 
	 * @memberOf zhr_br_time_freq.TAB3.Sobreaviso
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering
	 * manipulations of the HTML could be done here. This hook is the same one that SAPUI5 controls
	 * get after being rendered.
	 * 
	 * @memberOf zhr_br_time_freq.TAB3.Sobreaviso
	 */
	// onAfterRendering: function() {
	//
	// },
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize
	 * activities.
	 * 
	 * @memberOf zhr_br_time_freq.TAB3.Sobreaviso
	 */
	// onExit: function() {
	//
	// }
	get_SobreAviso_Data : function(oPernr, oPeriodo) {

		var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
		var oData = new sap.ui.model.odata.ODataModel(vURL);
		oData.setCountSupported(false);

		oData.read("/PeriodsSet('" + oPeriodo.getSelectedKey() + "')", null, null, false, function(
				oDataSuccess) {
			var oFilter = [
					new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()),
					new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.BT, oDataSuccess.Begda,
							oDataSuccess.Endda),
			];

			oData.read("/SobreAvisoSet", {
				filters : oFilter,
				success : function(oData) {
					var json = new sap.ui.model.json.JSONModel(oData);
					var oTable = sap.ui.getCore().byId('idSobr').byId('idSobreaviso');
					var oTemplate = sap.ui.getCore().byId('idSobr').byId('idRowBase');
					oTable.destroyItems();
					oTable.setModel(json);
					oTable.bindAggregation("items", {
						path : "/results",
						template : oTemplate
					});

					if (sap.ui.getCore().byId('idLocked').getText() == 'X') {
						oTable.setMode( sap.m.ListMode.None );
					}else{
						oTable.setMode( sap.m.ListMode.SingleSelectLeft );
					};

				}
			});

		});
	},

	show_SobreAviso_Day_Data : function(oEvent, vType) {

		var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
		var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');

		var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
		var oData = new sap.ui.model.odata.ODataModel(vURL);
		oData.setCountSupported(false);

		var oDate = sap.ui.getCore().byId('idSobr').byId('idSobreaviso').getSelectedItem()
				.getBindingContext().getProperty("Datum");

		var oSobreDay = new sap.m.Table("idSobreDay", {
			mode : sap.m.ListMode.SingleSelectLeft,
			select : function(oEvent) {
				oItem = oSobreDay.getSelectedItem();
				oItem.getCells()[2].setEnabled(true);
				oItem.getCells()[3].setEnabled(true);
			},
			selectionChange : function(oEvent) {
				oItems = oSobreDay.getItems();
				jQuery.each(oItems, function(index) {
					oItems[index].getCells()[2].setEnabled(false);
					oItems[index].getCells()[3].setEnabled(false);
				});
			},
			columns : [ new sap.m.Column({
				header : new sap.m.Label({
					text : "Hora Inicio"
				}),
				width : '45%'
			}), new sap.m.Column({
				header : new sap.m.Label({
					text : "Hora Fim"
				}),
				width : '45%'
			}), new sap.m.Column({
				header : new sap.m.Label({
					text : ""
				}),
				width : '5%'
			}), new sap.m.Column({
				header : new sap.m.Label({
					text : ""
				}),
				width : '5%'
			}),
			],
		});

		if (vType == 'Sobre') {
			var oGestor = sap.ui.getCore().byId('idGestor').getText();
			var oGestorSobre = sap.ui.getCore().byId('idGestorSobre').getText();
			if (oGestor == 'X' && oGestorSobre == 'X') {
				var vVisible = true;
			} else {
				var vVisible = false;
				oSobreDay.setMode(sap.m.ListMode.None);
			}
			;
		} else {
			var vVisible = true;
		}
		;

		var oRowSobreDay = new sap.m.ColumnListItem("idRowSobreDay", {
			cells : [
					new sap.m.DateTimeInput({
						value : {
							path : "Beguz",
							formatter : function(fValue) {
								if (fValue == "PT99H99M99S")
								{
									this.setVisible(false)
								} else
								{
									return fValue;
								};
							},
						},
						editable : false,
						type : "Time",
						valueFormat : "PTHH'H'mm'M'ss'S'",
						displayFormat : "HH:mm",
					}),
					new sap.m.DateTimeInput({
						value : {
							path : "Enduz",
							formatter : function(fValue) {
								if (fValue == "PT99H99M99S")
								{
									this.setVisible(false)
								} else
								{
									return fValue;
								};
							},
						},
						editable : false,
						type : "Time",
						valueFormat : "PTHH'H'mm'M'ss'S'",
						displayFormat : "HH:mm",
					}),
					new sap.m.Button({
						type : sap.m.ButtonType.Transparent,
						icon : sap.ui.core.IconPool.getIconURI('edit'),
						enabled : false,
						visible : vVisible,
						press : function(oEvent) {
							sap.ui.controller("zhr_br_time_freq.TAB3.Sobreaviso").SobreDay_CreateUpdate('Alt',
									vType);
						}
					}), new sap.m.Button({
						type : sap.m.ButtonType.Transparent,
						icon : sap.ui.core.IconPool.getIconURI('delete'),
						enabled : false,
						visible : vVisible,
						press : function(oEvent) {
							sap.ui.controller("zhr_br_time_freq.TAB3.Sobreaviso").SobreDay_Delete(oEvent, vType)
						}
					}),
			],
		});

		var oToolBar = new sap.m.Toolbar({
			content : [
					new sap.m.Button({
						text : "Criar",
						press : function(oEvent) {
							sap.ui.controller("zhr_br_time_freq.TAB3.Sobreaviso").SobreDay_CreateUpdate('New',
									vType);
						}
					}),
			],
			visible : vVisible,
		});

		oSobreDay.setHeaderToolbar(oToolBar);

		var oFilter = [
				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()),
				new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, oDate),
		];

		if (vType == 'Sobre') {
			oSobreDay.setModel(oData);
			oSobreDay.bindAggregation("items", '/SobreAvisoIncluSet', oRowSobreDay, null, oFilter);
			var vTitle = 'Sobreaviso';
		} else {
			oSobreDay.setModel(oData);
			oSobreDay.bindAggregation("items", '/SobreAvisoAcionSet', oRowSobreDay, null, oFilter);
			var vTitle = 'Acionamento';
		}
		;

		var oDialogSobreDay = new sap.m.Dialog({
			title : vTitle,
			contentWidth : "55%",
			content : [ oSobreDay
			],
			buttons : [ new sap.m.Button({
				text : "Voltar",
				type : sap.m.ButtonType.Accept,
				press : function() {
					sap.ui.controller("zhr_br_time_freq.TAB3.Sobreaviso").get_SobreAviso_Data(oPernr, oPeriodo);
					oDialogSobreDay.destroy();
					oRowSobreDay.destroy();
				}
			})
			],
		});
		oDialogSobreDay.open();
	},

	SobreDay_CreateUpdate : function(vType, vInfo) {

		var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
		var oData = new sap.ui.model.odata.ODataModel(vURL);
		oData.setCountSupported(false);

		var oSobreDay = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : [ '20%', '80%'
			]
		});

		var oTF = new sap.m.DateTimeInput('idNewBeguz', {
			tooltip : 'Hora Inicio',
			type : "Time",
			displayFormat : "HH:mm",
			valueFormat : "PTHH'H'mm'M'ss'S'",
		});
		var oLabel = new sap.ui.commons.Label({
			text : 'Hora Inicio',
			labelFor : oTF
		});
		oSobreDay.createRow(oLabel, oTF);

		var oTF = new sap.m.DateTimeInput('idNewEnduz', {
			tooltip : 'Hora Fim',
			type : "Time",
			displayFormat : "HH:mm",
			valueFormat : "PTHH'H'mm'M'ss'S'",
		});
		var oLabel = new sap.ui.commons.Label({
			text : 'Hora Fim',
			labelFor : oTF
		});
		oSobreDay.createRow(oLabel, oTF);

		if (vType == 'New') {
			var vTitle = 'Criar';
		} else {
			var vTitle = 'Alterar';
		}
		;

		var oDialog = new sap.m.Dialog({
			contentWidth : "20%",
			title : 'Atualizar',
			content : [ oSobreDay
			],
			buttons : [
					new sap.m.Button({
						text : "Confirmar",
						type : sap.m.ButtonType.Accept,
						press : function(oEvent) {

							oItem = sap.ui.getCore().byId('idSobr').byId('idSobreaviso').getSelectedItem()
									.getBindingContext();

							var oCreateUpdate = {};
							oCreateUpdate.Pernr = sap.ui.getCore().byId('idmain').byId('idPernr').getText();
							oCreateUpdate.Datum = oItem.getProperty("Datum");
							oCreateUpdate.Beguz = sap.ui.getCore().byId('idNewBeguz').getValue();
							oCreateUpdate.Enduz = sap.ui.getCore().byId('idNewEnduz').getValue();

							var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');

							if (vType == 'New') {

								if (vInfo == 'Sobre') {

									oData.create("/SobreAvisoIncluSet", oCreateUpdate, null, function(oSuccess) {
										sap.m.MessageToast.show("Marcação Gravada");

										var oFilter = [
												new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr
														.getText()),
												new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, oItem
														.getProperty("Datum")),
										];

										if (vInfo == 'Sobre') {
											oSobreDay.setModel(oData);
											sap.ui.getCore().byId('idSobreDay').bindAggregation("items",
													'/SobreAvisoIncluSet', sap.ui.getCore().byId('idRowSobreDay'), null,
													oFilter);
										} else {
											oSobreDay.setModel(oData);
											sap.ui.getCore().byId('idSobreDay').bindAggregation("items",
													'/SobreAvisoAcionSet', sap.ui.getCore().byId('idRowSobreDay'), null,
													oFilter);
										}
										;
										oDialog.destroy();
									}, function(oErro) {
										var sMessage = $(oErro.response.body).find('message').first().text();
										sap.m.MessageToast.show(sMessage);
									});

								} else {

									oData.create("/SobreAvisoAcionSet", oCreateUpdate, null, function(oSuccess) {
										sap.m.MessageToast.show("Marcação Gravada");

										var oFilter = [
												new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr
														.getText()),
												new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, oItem
														.getProperty("Datum")),
										];

										if (vInfo == 'Sobre') {
											oSobreDay.setModel(oData);
											sap.ui.getCore().byId('idSobreDay').bindAggregation("items",
													'/SobreAvisoIncluSet', sap.ui.getCore().byId('idRowSobreDay'), null,
													oFilter);
										} else {
											oSobreDay.setModel(oData);
											sap.ui.getCore().byId('idSobreDay').bindAggregation("items",
													'/SobreAvisoAcionSet', sap.ui.getCore().byId('idRowSobreDay'), null,
													oFilter);
										}
										;
										
										oDialog.destroy();
									}, function(oErro) {
										var sMessage = $(oErro.response.body).find('message').first().text();
										sap.m.MessageToast.show(sMessage);
									});

								}
								;

							} else {

								oItem = sap.ui.getCore().byId('idSobreDay').getSelectedItem().getBindingContext();

								oData.update(oItem.getPath(), oCreateUpdate, null, function(oSuccess) {
									sap.m.MessageToast.show('Marcação Alterada');

									oItem = sap.ui.getCore().byId('idSobr').byId('idSobreaviso').getSelectedItem()
											.getBindingContext();

									var oFilter = [
											new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr
													.getText()),
											new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, oItem
													.getProperty("Datum")),
									];

									if (vInfo == 'Sobre') {
										oSobreDay.setModel(oData);
										sap.ui.getCore().byId('idSobreDay').bindAggregation("items",
												'/SobreAvisoIncluSet', sap.ui.getCore().byId('idRowSobreDay'), null,
												oFilter);
									} else {
										oSobreDay.setModel(oData);
										sap.ui.getCore().byId('idSobreDay').bindAggregation("items",
												'/SobreAvisoAcionSet', sap.ui.getCore().byId('idRowSobreDay'), null,
												oFilter);
									}
									;

									oDialog.destroy();
								}, function(oErro) {
									var sMessage = $(oErro.response.body).find('message').first().text();
									sap.m.MessageToast.show(sMessage);
								});
							}
							;
						}
					}), new sap.m.Button({
						text : "Cancelar",
						type : sap.m.ButtonType.Default,
						press : function() {
							oDialog.destroy();
						}
					})
			],
		});
		oDialog.open()
	},

	SobreDay_Delete : function(oEvent, vInfo) {
		var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
		var oData = new sap.ui.model.odata.ODataModel(vURL);
		oData.setCountSupported(false);

		oItem = sap.ui.getCore().byId('idSobreDay').getSelectedItem().getBindingContext();

		oData.remove(oItem.getPath(), null, function(oSuccess) {
			sap.m.MessageToast.show('Marcação Removida');

			var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
			var sDate = oItem.getProperty("Datum");

			var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
			var oData = new sap.ui.model.odata.ODataModel(vURL);
			oData.setCountSupported(false);

			var oFilter = [
					new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()),
					new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, sDate),
			];

			if (vInfo == 'Sobre') {
				sap.ui.getCore().byId('idSobreDay').bindAggregation("items", '/SobreAvisoIncluSet',
						sap.ui.getCore().byId('idRowSobreDay'), null, oFilter);
			} else {
				sap.ui.getCore().byId('idSobreDay').bindAggregation("items", '/SobreAvisoAcionSet',
						sap.ui.getCore().byId('idRowSobreDay'), null, oFilter);
			}
			;

		}, function(oErro) {
			var sMessage = $(oErro.response.body).find('message').first().text();
			sap.m.MessageToast.show(sMessage);
		});
	},

});