sap.ui.jsview("zhr_br_time_freq.TAB2.Marcacao", {

	/**
	 * Specifies the Controller belonging to this View. In the case that it is not implemented, or
	 * that "null" is returned, this View does not have a Controller.
	 * 
	 * @memberOf zhr_br_time_freq.TAB2.Marcacao
	 */
	getControllerName: function() {
		return "zhr_br_time_freq.TAB2.Marcacao";
	},

	/**
	 * Is initially called once after the Controller has been instantiated. It is the place where the
	 * UI is constructed. Since the Controller is given to this method, its event handlers can be
	 * attached right away.
	 * 
	 * @memberOf zhr_br_time_freq.TAB2.Marcacao
	 */
	createContent: function(oController) {

		// //////////////////////////////////////////////////////////
		// Tabela
		var oTable = new sap.m.Table(this.createId("idMarcacao"), {
			//			mode : sap.m.ListMode.SingleSelectLeft,
			select: function(oEvent) {
//				oTable = sap.ui.getCore().byId('idMarc').byId('idMarcacao');
//				oItem = oTable.getSelectedItem();
//				oCell = oItem.getCells()[4];
//				oCell.setEnabled(true);
//				var oGestor = sap.ui.getCore().byId('idGestor').getText();
//				var oGestorSubst = sap.ui.getCore().byId('idGestorSubst').getText();
//				if (oGestor == 'X' && oGestorSubst == 'X') {
//					oCell = oItem.getCells()[2];
//					oCell.setEnabled(true);
//				};

				// Se Matricula da atualização é a mesma do Login, verifica bloqueio de dias
//				if (sap.ui.getCore().byId('idmain').byId('idPernr').getText() == sap.ui.getCore().byId('idLogin').getText()) {
//					var oSel = oItem.getBindingContext().getObject();
//					if (oSel.Read == 'X') {
//						oCell.setEnabled(false);
//						jQuery.sap.require("sap.m.MessageBox");
//						sap.m.MessageBox.show("Dia bloqueado para Lançamento", sap.m.MessageBox.Icon.WARNING, "Aviso");
//					}
//				}
			},
			selectionChange: function(oEvent) {
				debugger
				oTable = sap.ui.getCore().byId('idMarc').byId('idMarcacao');
				oItems = oTable.getItems();
				jQuery.each(oItems, function(index) {
					oCell = oItems[index].getCells()[4];
					oCell.setEnabled(false);
					oCell = oItems[index].getCells()[2];
					oCell.setEnabled(false);
				});
			},
		});

		// ToolBar
		var oToolBar = new sap.m.Toolbar();

		// Bot�es - Salvar
//		var oSalvar = new sap.m.Button(this.createId("idSalvar"), {
//			text: "Salvar",
//			icon: "sap-icon://save",
//			iconFirst: false,
//			press: function(oEvent) {
//				var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
//				var oData = new sap.ui.model.odata.ODataModel(vURL, true);
//				var oCreate = {};
//				oCreate.Pernr = sap.ui.getCore().byId('idmain').byId('idPernr').getText();
//				oCreate.Mmaaaa = sap.ui.getCore().byId('idmain').byId('idPeriodo').getSelectedKey();
//				oData.create("/EmployedSet", oCreate, null, null, null);
//				sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").get_Marcacao_Data(sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));
//				sap.ui.controller("zhr_br_time_freq.main").get_Employed_Information(sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));
//				sap.m.MessageToast.show('Dados enviados para processamento');
//			}
//		});

		// Bot�es - Sub em Lote
		var oEspelho = new sap.m.Button({
			text: "Espelho de Ponto",
			icon: "sap-icon://create",
			iconFirst: false,
			press: [sap.ui.getCore().byId("idmain").getController().get_espelho]
		});

		// Bot�es - Sub em Lote
		var oLote = new sap.m.Button(this.createId("idLote"), {
			text: "Substituição em Lote",
			press: function(oEvent) {
				sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").set_Lote_Data()
			}
		});

		// Adiciona Bot�es a Toobar
//		oToolBar.addContent(oSalvar);
//		oToolBar.addContent(new sap.m.ToolbarSpacer());
		oToolBar.addContent(oLote);
		oToolBar.addContent(new sap.m.ToolbarSpacer());

		// Bot�es - Espelho
		oToolBar.addContent(oEspelho);

		// Adiciona a Toobar a Tabela
		oTable.setHeaderToolbar(oToolBar);

		// Colunas - Data
		oTable.addColumn(new sap.m.Column({
			header: new sap.m.Label({
				text: "Data"
			}),
		}));

		// Colunas - Dia da Semana
		oTable.addColumn(new sap.m.Column({
			header: new sap.m.Label({
				text: "Dia Semana"
			}),
		}));

		// Colunas - Jornada
		oTable.addColumn(new sap.m.Column({
			header: new sap.m.Label({
				text: "Jornada"
			}),
		}));

		// Colunas - Horario Teorico
		oTable.addColumn(new sap.m.Column({
			header: new sap.m.Label({
				text: "Horário Teórico"
			}),
		}));

		// Colunas - Sobreaviso
		oTable.addColumn(new sap.m.Column({
			header: new sap.m.Label({
				text: "Marcação"
			}),
		}));

		var oRowBase = new sap.m.ColumnListItem(this.createId("idRowBase"));

		oRowBase.addCell(new sap.m.Label({
			text: {
				path: "Datum",
				formatter: function(value) {
					return value.substring(8, 10) + '/' + value.substring(5, 7) + '/' + value.substring(0, 4);
				}
			},
		}));

		oRowBase.addCell(new sap.m.Text({
			text: '{Langt}',
		}));

		oRowBase.addCell(new sap.m.Button({
			text: '{Tprog}',
			type: sap.m.ButtonType.Transparent,
			enabled: false,
			press: function(oEvent) {
				oController.get_valueHelpJornada(oEvent);
			},
		}));

		oRowBase.addCell(new sap.m.Text({
			text: {
				parts: [{
					path: "Sobeg",
				}, {
					path: "Soend",
				}],
				formatter: function(fSobeg, fSoend) {
					var vSobeg = (fSobeg.substring(2, 4) + ':' + fSobeg.substring(5, 7));
					if (vSobeg == "99:99") {
						vSobeg = '';
					}
					var vSoend = (fSoend.substring(2, 4) + ':' + fSoend.substring(5, 7));
					if (vSoend == "99:99") {
						vSoend = '';
					}
					if (vSobeg == '' || vSoend == '') {
						return '';
					} else {
						return vSobeg + ' - ' + vSoend;
					};
				}
			}
		}));
		oRowBase.addCell(new sap.m.Button({
//			text: "",
			type: sap.m.ButtonType.Transparent,
			icon: "sap-icon://edit",
			enabled: true,
			press: function(oEvent) {
				debugger
				oController.show_Marcacoes_Day_Data(oEvent);
			},
		}));

		// //////////////////////////////////////////////////////////

		var oRowJornada = new sap.m.ColumnListItem("idRowJornada", {
			cells: [new sap.m.Label({
				text: "{Motpr}",
			}), new sap.m.Label({
				text: "{Tprog}",
			}), new sap.m.Input({
				value: "{Awart}",
				description: "{Abwtxt}",
				editable: {
					path: "Mod",
					formatter: function(fValue) {
						if (fValue == 'X') {
							return true;
						} else {
							return false;
						};
					},
				},
				fieldWidth: '70px',
				valueHelpOnly: true,
				showValueHelp: true,
				valueHelpRequest: function(oEvent) {
					oController.get_valueHelpAbwtxt(oEvent.getSource().getId());
				}
			}), new sap.m.Text({
				text: {
					parts: [{
						path: "Sobeg",
					}, {
						path: "Soend",
					}],
					formatter: function(fSobeg, fSoend) {
						var vSobeg = (fSobeg.substring(2, 4) + ':' + fSobeg.substring(5, 7));
						if (vSobeg == "99:99") {
							vSobeg = '';
						}
						var vSoend = (fSoend.substring(2, 4) + ':' + fSoend.substring(5, 7));
						if (vSoend == "99:99") {
							vSoend = '';
						}
						if (vSobeg == '' || vSoend == '') {
							return '';
						} else {
							return vSobeg + ' - ' + vSoend;
						};
					}
				}
			}), new sap.m.Label({
				text: "{Sollz}",
			}), new sap.m.DateTimeInput({
				value: {
					path: "Sobeg",
					formatter: function(fValue) {
						if (fValue == "PT99H99M99S") {
							this.setVisible(false)
						} else {
							return fValue;
						};
					},
				},
				editable: false,
				type: "Time",
				valueFormat: "PTHH'H'mm'M'ss'S'",
				displayFormat: 'HH:mm'
			}), new sap.m.DateTimeInput({
				value: {
					path: "Soend",
					formatter: function(fValue) {
						if (fValue == "PT99H99M99S") {
							this.setVisible(false)
						} else {
							return fValue;
						};
					},
				},
				editable: false,
				type: "Time",
				valueFormat: "PTHH'H'mm'M'ss'S'",
				displayFormat: 'HH:mm'
			}), new sap.m.DateTimeInput({
				value: "{Begda}",
				editable: false,
				type: "Date",
				displayFormat: 'dd/MM/yyyy',
				valueFormat: "yyyy-MM-dd'T00:00:00'"
			}), new sap.m.DateTimeInput({
				value: "{Endda}",
				editable: false,
				type: "Date",
				displayFormat: 'dd/MM/yyyy',
				valueFormat: "yyyy-MM-dd'T00:00:00'"
			}), ],
		});

		return oTable;

	}

});