sap.ui.jsview("zhr_br_time_freq.TAB3.Sobreaviso", {

	/**
	 * Specifies the Controller belonging to this View. In the case that it is not implemented, or
	 * that "null" is returned, this View does not have a Controller.
	 * 
	 * @memberOf zhr_br_time_freq.TAB3.Sobreaviso
	 */
	getControllerName : function() {
		return "zhr_br_time_freq.TAB3.Sobreaviso";
	},

	/**
	 * Is initially called once after the Controller has been instantiated. It is the place where the
	 * UI is constructed. Since the Controller is given to this method, its event handlers can be
	 * attached right away.
	 * 
	 * @memberOf zhr_br_time_freq.TAB3.Sobreaviso
	 */
	createContent : function(oController) {

		// Tabela
		var oTable = new sap.m.Table(this.createId("idSobreaviso"), {
//			mode : sap.m.ListMode.SingleSelectLeft,
			select : function(oEvent) {
				oTable = sap.ui.getCore().byId('idSobr').byId('idSobreaviso');
				oTable.getSelectedItem().getCells()[5].setEnabled(true);
				var oGestor = sap.ui.getCore().byId('idGestor').getText();
				if (oGestor == 'X') {
					oTable.getSelectedItem().getCells()[4].setEnabled(true);
				}
				;
				oItems = oTable.getItems();
				jQuery.each(oItems, function(index) {
					if (oItems[index].isSelected() == true
							&& oTable.getModel().getData().results[index].Sobre == 'X') {
						oItems[index].getCells()[4].setEnabled(true);
					}
					;
				});
				
				// Se Matricula da atualização é a mesma do Login, verifica bloqueio de dias
				if ( sap.ui.getCore().byId('idmain').byId('idPernr').getText() == sap.ui.getCore().byId('idLogin').getText() ) {
					var oSel = oTable.getSelectedItem().getBindingContext().getObject();
					if ( oSel.Read == 'X' ){
						oTable.getSelectedItem().getCells()[5].setEnabled(false);
						jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.show("Dia bloqueado para Lançamento",sap.m.MessageBox.Icon.WARNING,"Aviso");
					}
				}
				
			},
			selectionChange : function(oEvent) {
				oTable = sap.ui.getCore().byId('idSobr').byId('idSobreaviso');
				oItems = oTable.getItems();
				jQuery.each(oItems, function(index) {
					oItems[index].getCells()[4].setEnabled(false);
					oItems[index].getCells()[5].setEnabled(false);
				});
			},
		});

		// ToolBar
		var oToolBar = new sap.m.Toolbar();

		// Bot�es - Salvar
		var oSalvar = new sap.m.Button(this.createId("idSalvar"), {
			text : "Salvar",
			icon : "sap-icon://save",
			iconFirst : false,
			press : function(oEvent) {
				var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
				var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
				var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
				var oData = new sap.ui.model.odata.ODataModel(vURL, true);
				var oCreate = {};
				oCreate.Pernr = oPernr.getText();
				oCreate.Mmaaaa = oPeriodo.getSelectedKey();
				oData.create("/EmployedSet", oCreate, null, null, null);
				sap.ui.controller("zhr_br_time_freq.TAB3.Sobreaviso").get_SobreAviso_Data(oCreate.Pernr,
						oCreate.Mmaaaa);
				sap.m.MessageToast.show('Dados enviados para processamento');
				sap.ui.controller("zhr_br_time_freq.main").get_Employed_Information(
						sap.ui.getCore().byId('idmain').byId('idPernr'),
						sap.ui.getCore().byId('idmain').byId('idPeriodo'));
			}
		});

		// Bot�es - Cancelar
		var oCancelar = new sap.m.Button(this.createId("idCancelar"), {
			text : "Cancelar",
			icon : "sap-icon://sys-cancel-2",
			iconFirst : false
		})
		
		var oEspelho = new sap.m.Button({
			text : "Espelho de Ponto",
			icon : "sap-icon://create",
			iconFirst : false,
			press: [sap.ui.getCore().byId("idmain").getController().get_espelho]
		});

		// Adiciona Bot�es a Toobar
		oToolBar.addContent(oSalvar);
		// oToolBar.addContent(oCancelar);
		oToolBar.addContent(new sap.m.ToolbarSpacer());
		
		// Bot�es - Espelho
		oToolBar.addContent(oEspelho);

		// Adiciona a Toobar a Tabela
		oTable.setHeaderToolbar(oToolBar);

		// Colunas - Data
		oTable.addColumn(new sap.m.Column({
			header : new sap.m.Label({
				text : "Data"
			}),
		}));

		// Colunas - Dia da Semana
		oTable.addColumn(new sap.m.Column({
			header : new sap.m.Label({
				text : "Dia Semana"
			}),
		}));

		// Colunas - Jornada
		oTable.addColumn(new sap.m.Column({
			header : new sap.m.Label({
				text : "Jornada"
			}),
		}));

		// Colunas - Horario Teorico
		oTable.addColumn(new sap.m.Column({
			header : new sap.m.Label({
				text : "Horário Teórico"
			}),
		}));

		// Colunas - Sobreaviso
		oTable.addColumn(new sap.m.Column({
			header : new sap.m.Label({
				text : "Sobreaviso"
			}),
		}));

		// Colunas - Acionamento
		oTable.addColumn(new sap.m.Column({
			header : new sap.m.Label({
				text : "Acionamento"
			}),
		}));

		var oRowBase = new sap.m.ColumnListItem(this.createId("idRowBase"));

		oRowBase.addCell(new sap.m.Label(
				{
					text : {
						path : "Datum",
						formatter : function(value) {
							return value.substring(8, 10) + '/' + value.substring(5, 7) + '/'
									+ value.substring(0, 4);
						}
					},
				}));

		oRowBase.addCell(new sap.m.Text({
			text : '{Langt}',
		}));

		oRowBase.addCell(new sap.m.Text({
			text : '{Tprog}',
		}));

		oRowBase.addCell(new sap.m.Text({
			text : {
				parts : [ {
					path : "Sobeg",
					type : new sap.ui.model.type.String()
				}, {
					path : "Soend",
					type : new sap.ui.model.type.String()
				}
				],

				formatter : function(fSobeg, fSoend) {
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
					}
					;
				}
			}
		}));

		oRowBase.addCell(new sap.m.Button({
			id : "Sobre",
			text : {
				path : "Sobre",
				formatter : function(value) {
					if (value == 'X') {
						var oGestor = sap.ui.getCore().byId('idGestor').getText();
						var oGestorSobre = sap.ui.getCore().byId('idGestorSobre').getText();
						if (oGestor == 'X' && oGestorSobre == 'X') {
							return "Modificar";
						} else {
							return "Consultar";
						}
						;
					} else {
						return "Incluir";
					}
					;
				},
			},
			visible : {
				path : "Sobre",
				formatter : function(value) {
					if (value == 'X') {
						return true;
					} else {
						var oGestor = sap.ui.getCore().byId('idGestor').getText();
						var oGestorSobre = sap.ui.getCore().byId('idGestorSobre').getText();
						if (oGestor == 'X' && oGestorSobre == 'X') {
							return true;
						} else {
							return false;
						}
						;
					}
					;
				}
			},
			type : sap.m.ButtonType.Transparent,
			icon : "sap-icon://sys-add",
			enabled : false,
			press : function(oEvent) {
				oController.show_SobreAviso_Day_Data(oEvent, 'Sobre');
			},
		}));

		oRowBase.addCell(new sap.m.Button({
			id : "Acion",
			text : {
				path : "Acion",
				formatter : function(value) {
					if (value == 'X') {
						return "Modificar";
					} else {
						return "Incluir";
					}
					;
				}
			},
			visible : {
				path : "Sobre",
				formatter : function(value) {
					if (value == 'X') {
						return true;
					} else {
						return false;
					}
					;
				}
			},
			type : sap.m.ButtonType.Transparent,
			icon : "sap-icon://sys-add",
			enabled : false,
			press : function(oEvent) {
				oController.show_SobreAviso_Day_Data(oEvent, 'Acion');
			},
		}));

		return oTable;

	}

});