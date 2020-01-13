
var oLine = null;
sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao", {
  /**
   * Called when a controller is instantiated and its View controls (if available) are
   * already created. Can be used to modify the View before it is displayed, to bind event
   * handlers and do other one-time initialization.
   * 
   * @memberOf zhr_br_time_freq.TAB2.Marcacao
   */
  onInit: function() {
  // var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
  // var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
  // this.get_Marcacao_Data(oPernr, oPeriodo)
  },

  /**
   * Similar to onAfterRendering, but this hook is invoked before the controller's View is
   * re-rendered (NOT before the first rendering! onInit() is used for that one!).
   * 
   * @memberOf zhr_br_time_freq.TAB2.Marcacao
   */
  // onBeforeRendering: function() {
  //
  // },
  /**
   * Called when the View has been rendered (so its HTML is part of the document).
   * Post-rendering manipulations of the HTML could be done here. This hook is the same one
   * that SAPUI5 controls get after being rendered.
   * 
   * @memberOf zhr_br_time_freq.TAB2.Marcacao
   */
  // onAfterRendering: function() {
  //
  // },
  /**
   * Called when the Controller is destroyed. Use this one to free resources and finalize
   * activities.
   * 
   * @memberOf zhr_br_time_freq.TAB2.Marcacao
   */
  // onExit: function() {
  //
  // }
  get_Marcacao_Data: function(oPernr, oPeriodo) {

    var oLote = sap.ui.getCore().byId('idMarc').byId('idLote');
    var oGestor = sap.ui.getCore().byId('idGestor').getText();
    if (sap.ui.getCore().byId('idLocked').getText() == 'X') {
      oLote.setEnabled(false);
    } else if (oGestor == 'X') {
      oLote.setEnabled(true);
    } else {
      oLote.setEnabled(false);
    };

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oData.setCountSupported(false);

    oData.read("/PeriodsSet('" + oPeriodo.getSelectedKey() + "')", null, null, false, function(oDataSuccess) {
      var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()),
new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.BT, oDataSuccess.Begda, oDataSuccess.Endda), ];

      oData.read("/MarcacaoSet", {
        filters: oFilter,
        success: function(oData) {
          var json = new sap.ui.model.json.JSONModel(oData);
          var oTable = sap.ui.getCore().byId('idMarc').byId('idMarcacao');
          var oTemplate = sap.ui.getCore().byId('idMarc').byId('idRowBase');
          oTable.destroyItems();
          oTable.setModel(json);
          oTable.bindAggregation("items", {
            path: "/results",
            template: oTemplate
          });

//          if (sap.ui.getCore().byId('idLocked').getText() == 'X') {
//            oTable.setMode(sap.m.ListMode.None);
//          } else {
//            oTable.setMode(sap.m.ListMode.SingleSelectLeft);
//          };

        }
      });

    });
  },

  get_valueHelpJornada: function(oEvent, vType) {
    var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/");

    var oEntity = oEvent.getSource().getBindingContext();
    var oJornada = new sap.m.TableSelectDialog({
      title: "Selecione uma Jornada...",
      noDataText: "Nenhuma entrada encontrada",
      contentWidth : "90%",
      columns: [new sap.m.Column({
        width: "11%",
        header: new sap.m.Label({
          text: "Agrp.p/PHTD"
        })
      }), new sap.m.Column({
        width: "11%",
        header: new sap.m.Label({
          text: "PlHor.TrabDiár."
        })
      }), new sap.m.Column({
        width: "11%",
        header: new sap.m.Label({
          text: "VrPl.TrHor.diár"
        })
      }), new sap.m.Column({
        width: "12%",
        header: new sap.m.Label({
          text: "Texto PHTD"
        })
      }), new sap.m.Column({
        width: "11%",
        header: new sap.m.Label({
          text: "HrsTrab.teórs."
        })
      }), new sap.m.Column({
        width: "11%",
        header: new sap.m.Label({
          text: "Início trab."
        })
      }), new sap.m.Column({
        width: "11%",
        header: new sap.m.Label({
          text: "Fim do trabalho"
        })
      }), new sap.m.Column({
        width: "11%",
        header: new sap.m.Label({
          text: "Vál.desde"
        })
      }), new sap.m.Column({
        width: "11%",
        header: new sap.m.Label({
          text: "Válido até"
        })
      }), ],
      confirm: function(oEvent) {
        if (vType == 'Lote') {
          sap.ui.getCore().byId('idNewTprog').setValue(oEvent.getParameters().selectedItem.getBindingContext().getProperty("Tprog"));
          sap.ui.getCore().byId('idNewTprog').setDescription(oEvent.getParameters().selectedItem.getCells()[3].getText());
        } else {
          oTprog = oEvent.getParameters().selectedItem.getBindingContext().getProperty("Tprog");
          sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").update_Jornada(oEntity, oTprog);
        };
      },
      liveChange: function(oEvent) {
        if (oEvent.getParameters().value != '') {
          var oFilter = new sap.ui.model.Filter(oEvent.oSource._dialog.getContent()
[1].mBindingInfos.items.template.getCells()[1].mBindingInfos.text.parts[0].path, sap.ui.model.FilterOperator.Contains, oEvent.getParameters().value)
          oEvent.getParameter("itemsBinding").filter([oFilter])
        } else {
          oEvent.getParameter("itemsBinding").filter()
        }
      },
    });

    oJornada.setModel(oModel)
    oJornada.bindAggregation("items", {
      path: "/JornadaSet",
      template: sap.ui.getCore().byId('idRowJornada')
    })
    oJornada.open()

  },

  update_Jornada: function(oEntity, oTprog) {
    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oData.setCountSupported(false);

    var oUpdate = {};
    oUpdate.Pernr = oEntity.getProperty("Pernr");
    oUpdate.Datum = oEntity.getProperty("Datum");
    oUpdate.Langt = oEntity.getProperty("Langt");
    oUpdate.Tprog = oTprog;
    oUpdate.Sobeg = oEntity.getProperty("Sobeg");
    oUpdate.Soend = oEntity.getProperty("Soend");
    oUpdate.Mod = oEntity.getProperty("Mod");

    oData.update("/MarcacaoSet(Pernr='" + oUpdate.Pernr + "',Datum=datetime'" + oUpdate.Datum + "',Tprog='" +
 oEntity.getProperty("Tprog") + "')", oUpdate, null, function(oSuccess) {

      var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
      var oData = new sap.ui.model.odata.ODataModel(vURL);
      oData.setCountSupported(false);

      var oCreate = {};
      oCreate.Pernr = sap.ui.getCore().byId('idmain').byId('idPernr').getText();
      oCreate.Mmaaaa = sap.ui.getCore().byId('idmain').byId('idPeriodo').getSelectedKey();
      oData.create("/EmployedSet", oCreate, null, function(oSuccess) {
        sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").get_Marcacao_Data(sap.ui.getCore().byId('idmain').byId('idPernr'),
 sap.ui.getCore().byId('idmain').byId('idPeriodo'));
        sap.m.MessageToast.show("Jornada atualizada");

     sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").get_Frequency_Data(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));
     sap.ui.controller("zhr_br_time_freq.main").get_Employed_Information(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));

      }, function(oErro) {
        var sMessage = $(oErro.response.body).find('message').first().text();
        sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").get_Marcacao_Data(sap.ui.getCore().byId('idmain').byId('idPernr'),
 sap.ui.getCore().byId('idmain').byId('idPeriodo'));
        sap.m.MessageToast.show(sMessage);
      });
    }, function(oErro) {
      var sMessage = $(oErro.response.body).find('message').first().text();
      sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").get_Marcacao_Data(sap.ui.getCore().byId('idmain').byId('idPernr'),
 sap.ui.getCore().byId('idmain').byId('idPeriodo'));
      sap.m.MessageToast.show(sMessage);
    });
  },

  set_Lote_Data: function() {

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
    oData.setCountSupported(false);

    var oPHTDLote = new sap.ui.commons.layout.MatrixLayout({
      columns: 2,
      width: "100%",
      widths: ['15%', '85%']
    });

    var oTF = new sap.m.DateTimeInput('idNewBegda', {
      tooltip: 'Data de Incio',
      type: "Date",
      displayFormat: 'dd/MM/yyyy',
      valueFormat: "yyyy-MM-dd'T00:00:00'"
    });
    var oLabel = new sap.m.Label({
      text: 'Inicio',
  labelFor: oTF
    });
    oPHTDLote.createRow(oLabel, oTF);

    oTF = new sap.m.DateTimeInput('idNewEndda', {
      tooltip: 'Data Fim',
      type: "Date",
      displayFormat: 'dd/MM/yyyy',
      valueFormat: "yyyy-MM-dd'T00:00:00'"
    });
    oLabel = new sap.m.Label({
      text: 'Fim',
    labelFor: oTF
    });
    oPHTDLote.createRow(oLabel, oTF);

    oTF = new sap.m.Input('idNewTprog', {
      fieldWidth: '70px',
      valueHelpOnly: true,
      showValueHelp: true,
      valueHelpRequest: function(oEvent) {
        sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").get_valueHelpJornada(oEvent, 'Lote');
      }
    });
    oLabel = new sap.m.Label({
      text: 'Jornada',
    labelFor: oTF
    });
    oPHTDLote.createRow(oLabel, oTF);

    var oDialog = new sap.m.Dialog({
      contentWidth: "200px",
      resizable: true,
      draggable: true,
      title: 'Substituição em Lote',
      content: [oPHTDLote],
      buttons: [new sap.m.Button({
        text: "Confirmar",
        type: sap.m.ButtonType.Accept,
        press: function(oEvent) {
          var vBegda = new Date(sap.ui.getCore().byId('idNewBegda').getValue());
          var vEndda = new Date(sap.ui.getCore().byId('idNewEndda').getValue());
          var vTprog = sap.ui.getCore().byId('idNewTprog').getValue();

          var vErro = sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").getDiffDates(vBegda, vEndda);
          if (vErro == false) {

            while (vBegda < vEndda) {

              oData.read("/MarcacaoSet(Pernr='" + oPernr.getText() + "',Datum=datetime'" +
 vBegda.toISOString().substring(0, 22) + "',Tprog='" + "')", null, null, false, function(oSuccess) {

                var oUpdate = {};
                oUpdate.Pernr = oSuccess.Pernr;
                oUpdate.Datum = oSuccess.Datum;
                oUpdate.Langt = oSuccess.Langt;
                oUpdate.Tprog = vTprog;
                oUpdate.Sobeg = oSuccess.Sobeg;
                oUpdate.Soend = oSuccess.Soend;
                oUpdate.Mod = oSuccess.Mod;

                oData.update("/MarcacaoSet(Pernr='" + oUpdate.Pernr + "',Datum=datetime'" +
oUpdate.Datum + "',Tprog='" + oSuccess.Tprog + "')", oUpdate, null, function(oSuccess) {

                  var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
                  var oData = new sap.ui.model.odata.ODataModel(vURL);
                  oData.setCountSupported(false);

                  var oCreate = {};
                  oCreate.Pernr = sap.ui.getCore().byId('idmain').byId('idPernr').getText();
                  oCreate.Mmaaaa = sap.ui.getCore().byId('idmain').byId('idPeriodo').getSelectedKey();
                  oData.create("/EmployedSet", oCreate, null, function(oSuccess) {
                  // sap.m.MessageToast.show("Jornada atualizada");

     sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").get_Frequency_Data(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));
     sap.ui.controller("zhr_br_time_freq.main").get_Employed_Information(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));

                  }, function(oErro) {
                  // var sMessage =
                  // $(oErro.response.body).find('message').first().text();
                  // sap.m.MessageToast.show(sMessage);
                  });
                }, function(oErro) {
                // var sMessage =
                // $(oErro.response.body).find('message').first().text();
                // sap.m.MessageToast.show(sMessage);
                });
              }, function(oErro) {
              // var sMessage = $(oErro.response.body).find('message').first().text();
              // sap.m.MessageToast.show(sMessage);
              });

              var newDate = vBegda.setDate(vBegda.getDate() + 1);
              vBegda = new Date(newDate);
            };
            sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").get_Marcacao_Data(sap.ui.getCore().byId('idmain').byId('idPernr'),
 sap.ui.getCore().byId('idmain').byId('idPeriodo'));
            sap.m.MessageToast.show("Lote de Jornada enviado para processamento");
            oDialog.destroy();
          } else {
            sap.m.MessageToast.show("Substituição em Lote ultrapassa o limite de 30 dias");
          };
        }
      }), new sap.m.Button({
        text: "Cancelar",
        type: sap.m.ButtonType.Default,
        press: function() {
          oDialog.destroy();
        }
      })],
    })
    oDialog.open()

  },

  show_Marcacoes_Day_Data: function(oEvent) {

    var that = this;

    var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oData.setCountSupported(false);

    oLine = oEvent.getSource().oPropagatedProperties.oBindingContexts.undefined.oModel.getData().results[
      oEvent.getSource().oPropagatedProperties.oBindingContexts.undefined.sPath.split("/")[2]];

    var oMarcDay = new sap.m.Table("idMarcDay", {

      mode: {
            path: "Stokz",
            formatter: function() {
              if (sap.ui.getCore().byId('idLocked').getText() != "X") {
                return sap.m.ListMode.SingleSelectLeft;
              } else {
                return sap.m.ListMode.None;
              }
        }             },


      select: function(oEvent) {
        var oGestor = sap.ui.getCore().byId('idGestor').getText();
        oItem = oMarcDay.getSelectedItem();
    if(sap.ui.getCore().byId('idLocked').getText() == "X") {

          oItem.getCells()[4].setVisible(false);
          oItem.getCells()[5].setVisible(false);

    } else {


        if (oItem.getCells()[2].getValue() == '9999' || oItem.getCells()[2].getValue() == '') {
          oItem.getCells()[4].setEnabled(true);
          oItem.getCells()[5].setEnabled(false);
        } else {
          oItem.getCells()[4].setEnabled(true);
          oItem.getCells()[5].setEnabled(true);
        };
        if (oGestor == 'X') {
          oItem.getCells()[4].setEnabled(true);
          oItem.getCells()[5].setEnabled(true);
        };
        if (oItem.getCells()[3].getSelected() == true) {
          oItem.getCells()[4].setEnabled(false);
          oItem.getCells()[5].setEnabled(false);
        }

    }

      },
      selectionChange: function(oEvent) {
        oItems = oMarcDay.getItems();
        jQuery.each(oItems, function(index) {
          oItems[index].getCells()[4].setEnabled(false);
          oItems[index].getCells()[5].setEnabled(false);
        });
      },
      columns: [new sap.m.Column({
        header: new sap.m.Label({
          text: "Hora"
        }),
        width: '15%'
      }), new sap.m.Column({
        header: new sap.m.Label({
          text: "Atrib. Dia"
        }),
        width: '15%'
      }), new sap.m.Column({
        header: new sap.m.Label({
          text: "Motivo"
        }),
      }), new sap.m.Column({
        header: new sap.m.Label({
          text: "Estorno"
        }),
        width: '10%'
      }), new sap.m.Column({
        header: new sap.m.Label({
          text: ""
        }),
        width: '5%'
      }), new sap.m.Column({
        header: new sap.m.Label({
          text: ""
        }),
        width: '5%'
      }), ],
    });

    var oRowMarcDay = new sap.m.ColumnListItem("idRowMarcDay", {
      cells: [new sap.m.DateTimeInput({
        value: {
          path: "Ltime",
          formatter: function(fValue) {
            if (fValue == "PT99H99M99S")
            {
              this.setVisible(false)
            } else
            {
              return fValue;
            };
          },
        },
        editable: false,
        type: "Time",
        valueFormat: "PTHH'H'mm'M'ss'S'",
        displayFormat: "HH:mm",
      }), new sap.m.Label({
        text: "{Dallf}",
      }), new sap.m.Input({
        value: "{Abwgr}",
        description: "{Abwtxt}",
        valueHelpOnly: true,
        showValueHelp: true,
        fieldWidth: '70px',
        editable: false,
        valueHelpRequest: function(oEvent) {
          sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").get_valueHelpGtext(oEvent.getSource().getId());
        }
      }), new sap.m.CheckBox({
        editable: false,
        selected: {
          path: "Stokz",
          formatter: function(fValue) {
            if (fValue == 'X') {
              return true;
            } else {
              return false;
            };
          },
        },
      }), new sap.m.Button({
        type: sap.m.ButtonType.Transparent,
        icon: sap.ui.core.IconPool.getIconURI('edit'),
        tooltip: 'Editar motivo da marcação',
        enabled: false,
        visible: {
            path: "Stokz",
            formatter: function() {
              if (sap.ui.getCore().byId('idLocked').getText() != "X") {
                return true;
              } else {
                return false;
              }
        }             },
        press: function(oEvent) {
          sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").MarcDay_CreateUpdate('Alt');
        }
      }), new sap.m.Button({
        type: sap.m.ButtonType.Transparent,
        icon: sap.ui.core.IconPool.getIconURI('delete'),
        tooltip: 'Estornar marcação',
        enabled: false,
        visible: {
            path: "Stokz",
            formatter: function() {
              if (sap.ui.getCore().byId('idLocked').getText() != "X") {
                return true;
              } else {
                return false;
              }
        }             },
        press: function(oEvent) {
          sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").MarcDay_Delete(oEvent)
        }
      }), ],
    });

//  Exibir o botão criar apenas em períodos liberados
    if(sap.ui.getCore().byId('idLocked').getText() != "X") {

    var oToolBar = new sap.m.Toolbar({
      content: [new sap.m.Button({
        text: "Inserir marcação",
        tooltip: "Inserir marcação",
        press: function(oEvent) {
          sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").MarcDay_CreateUpdate('New');
        }
      }), ],
    });

    oMarcDay.setHeaderToolbar(oToolBar);

    }

    var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()),
                   new sap.ui.model.Filter('Ldate', sap.ui.model.FilterOperator.EQ, oLine.Datum) ];

    oMarcDay.setModel(oData);
    oMarcDay.bindAggregation("items", '/MarcacaoDiaSet', oRowMarcDay, null, oFilter);

    var oDialogMarcDay = new sap.m.Dialog({
      title: 'Marcação',
      contentWidth: "750px",
      resizable: true,
      draggable: true,
      content: [oMarcDay],
      buttons: [new sap.m.Button({
        text: "Fechar",
        press: function() {
          oDialogMarcDay.destroy();
          oRowMarcDay.destroy();

     sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").get_Frequency_Data(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));
     sap.ui.controller("zhr_br_time_freq.main").get_Employed_Information(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));

        }
      })],
    });
    oDialogMarcDay.open();
  },

  get_valueHelpGtext: function(oObject) {

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oData.setCountSupported(false);

    var oSelectDialog = new sap.m.SelectDialog({
      title: "Selecione uma opção...",
      noDataText: "Nenhuma entrada encontrada",
      multiSelect: false,
      rememberSelections: true,
      confirm: function(oEvent) {
        var oItem = oEvent.getParameters().selectedItem;
        var oImput = sap.ui.getCore().byId(oObject);
        oImput.setValue(oItem.getTitle());
        oImput.setDescription(oItem.getDescription());
      },
      liveChange: function(oEvent) {
        var sValue = oEvent.getParameters().value;
        var oFilter = new sap.ui.model.Filter("{Abwgr}", sap.ui.model.FilterOperator.Contains, sValue);
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
      }
    });
    var oItemTemplate = new sap.m.StandardListItem({
      title: "{Abwgr}",
      description: "{Gtext}",
      active: true
    });
    oSelectDialog.setModel(oData);
    oSelectDialog.bindAggregation('items', '/SubsystemSet', oItemTemplate, null, null);
    oSelectDialog.open();
  },

  MarcDay_CreateUpdate: function(vTipe) {

    var that = this;

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oData.setCountSupported(false);

    var oMarcDay = new sap.ui.commons.layout.MatrixLayout({
      columns: 2,
      width: "100%",
      widths: ['15%', '85%']
    });

    var oTF = new sap.m.DateTimeInput('idNewTime', {
      tooltip: 'Hora',
      type: "Time",
      displayFormat: "HH:mm",
      valueFormat: "PTHH'H'mm'M'ss'S'",
    });
    var oLabel = new sap.m.Label({
      text: 'Hora',
      labelFor: oTF
    });
    oMarcDay.createRow(oLabel, oTF);

    oTF = new sap.m.CheckBox('idNewDallf', {
      text: 'Marcação Dia Anterior',
      select: function(oEvent) {
        if (this.getSelected() == true) {
          if (sap.ui.getCore().byId('idMarcDay').getSelectedItem().getCells()[2].getValue() == '9999' ||
 sap.ui.getCore().byId('idMarcDay').getSelectedItem().getCells()[2].getValue() == '' ||
 sap.ui.getCore().byId('idMarcDay').getSelectedItem().getCells()[2].getValue() == '0006') {
            oData.read("/SubsystemSet('0002')", null, null, false, function(oSuccess) {
              sap.ui.getCore().byId('idNewAbwgr').setValue(oSuccess.Abwgr);
              sap.ui.getCore().byId('idNewAbwgr').setDescription(oSuccess.Gtext);
              sap.ui.getCore().byId('idNewAbwgr').setEditable(false);
            });
          };
        } else {
          sap.ui.getCore().byId('idNewAbwgr').setValue();
          sap.ui.getCore().byId('idNewAbwgr').setDescription();
        };
      },
    });
    oLabel = new sap.m.Label({
      labelFor: oTF
    });
    oMarcDay.createRow(oLabel, oTF);

    oTF = new sap.m.Input('idNewAbwgr', {
      valueHelpOnly: true,
      showValueHelp: true,
      fieldWidth: '70px',
      editable: true,
      valueHelpRequest: function(oEvent) {
        sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").get_valueHelpGtext(oEvent.getSource().getId());
      }
    }), oLabel = new sap.m.Label({
      text: 'Motivo',
      labelFor: oTF
    });
    oMarcDay.createRow(oLabel, oTF);

    if (vTipe == 'New') {
      var vTitle = 'Criar';
    } else {
      var vTitle = 'Alterar';
      sap.ui.getCore().byId('idNewTime').setValue(sap.ui.getCore().byId('idMarcDay').getSelectedItem().getCells()[0].getValue());
      sap.ui.getCore().byId('idNewTime').setEditable(false);
      if (sap.ui.getCore().byId('idMarcDay').getSelectedItem().getCells()[2].getValue() == '9999' ||
 sap.ui.getCore().byId('idMarcDay').getSelectedItem().getCells()[2].getValue() == '' ||
 sap.ui.getCore().byId('idMarcDay').getSelectedItem().getCells()[2].getValue() == '0006') {
        sap.ui.getCore().byId('idNewAbwgr').setEditable(false);
      };
    };

    var oDialog = new sap.m.Dialog({
      contentWidth: "20%",
      title: vTitle,
      content: [oMarcDay],
      buttons: [new sap.m.Button({
        text: "Confirmar",
        type: sap.m.ButtonType.Accept,
        press: function(oEvent) {

          if (vTipe == 'New') {

            var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ,
 sap.ui.getCore().byId('idmain').byId('idPernr').getText()), new sap.ui.model.Filter('Ldate', sap.ui.model.FilterOperator.EQ, oLine.Datum), ];

            var oCreate = {};
            oCreate.Pernr = sap.ui.getCore().byId('idmain').byId('idPernr').getText();
            oCreate.Ldate = oLine.Datum;
            oCreate.Ltime = sap.ui.getCore().byId('idNewTime').getValue();
            oCreate.Satza = 'P01'
            oCreate.Terid = '';
            oCreate.Abwgr = sap.ui.getCore().byId('idNewAbwgr').getValue();
            if (sap.ui.getCore().byId('idNewDallf').getSelected() == true) {
              oCreate.Dallf = '-';
            } else {
              oCreate.Dallf = '+';
            };
            
            oData.create("/MarcacaoDiaSet", oCreate, null, function(oSuccess) {
              sap.m.MessageToast.show("Marcação Gravada");
              sap.ui.getCore().byId('idMarcDay').bindAggregation("items", '/MarcacaoDiaSet', sap.ui.getCore().byId('idRowMarcDay'), null, oFilter);
              oDialog.destroy();
            }, function(oErro) {
              var sMessage = $(oErro.response.body).find('message').first().text();
              sap.m.MessageToast.show(sMessage);
            });

     sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").get_Frequency_Data(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));
     sap.ui.controller("zhr_br_time_freq.main").get_Employed_Information(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));


          } else {

            oItem = sap.ui.getCore().byId('idMarcDay').getSelectedItem().getBindingContext();

            var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ,
 oItem.getProperty("Pernr")), new sap.ui.model.Filter('Ldate', sap.ui.model.FilterOperator.EQ, oItem.getProperty("Ldate")), ];

            var oUpdate = {};
            oUpdate.Pernr = oItem.getProperty("Pernr");
            oUpdate.Ldate = oItem.getProperty("Ldate");
            oUpdate.Ltime = sap.ui.getCore().byId('idNewTime').getValue();
            oUpdate.Satza = oItem.getProperty("Satza");
            oUpdate.Terid = oItem.getProperty("Terid");
            oUpdate.Abwgr = sap.ui.getCore().byId('idNewAbwgr').getValue();
            if (sap.ui.getCore().byId('idNewDallf').getSelected() == true) {
              oUpdate.Dallf = '-';
            } else {
              oUpdate.Dallf = '+';
            };

            oData.update(oItem.getPath(), oUpdate, null, function(oSuccess) {
              sap.m.MessageToast.show('Marcação Alterada');
              sap.ui.getCore().byId('idMarcDay').bindAggregation("items", '/MarcacaoDiaSet', sap.ui.getCore().byId('idRowMarcDay'), null, oFilter);
              oDialog.destroy();
            }, function(oErro) {
              var sMessage = $(oErro.response.body).find('message').first().text();
              sap.m.MessageToast.show(sMessage);
            });

     sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").get_Frequency_Data(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));
     sap.ui.controller("zhr_br_time_freq.main").get_Employed_Information(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));

          };
        }
      }), new sap.m.Button({
        text: "Cancelar",
        type: sap.m.ButtonType.Default,
        press: function() {
          oDialog.destroy();

        }
      })],
    })
    oDialog.open()
  },

  MarcDay_Delete: function(oEvent) {
    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oData.setCountSupported(false);

    oItem = sap.ui.getCore().byId('idMarcDay').getSelectedItem().getBindingContext();

    //
    var oMarcDay = new sap.ui.commons.layout.MatrixLayout({
      columns: 2,
      width: "100%",
      widths: ['15%', '85%']
    });

    oTF = new sap.m.Input('idNewAbwgr', {
      valueHelpOnly: true,
      showValueHelp: true,
      fieldWidth: '70px',
      editable: true,
      valueHelpRequest: function(oEvent) {
        sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").get_valueHelpGtext(oEvent.getSource().getId());
      }
    }), oLabel = new sap.ui.commons.Label({
      text: 'Motivo',
      labelFor: oTF
    });
    oMarcDay.createRow(oLabel, oTF);

    oItem = sap.ui.getCore().byId('idMarcDay').getSelectedItem().getBindingContext();

    oData.read("/SubsystemSet('" + oItem.getProperty("Abwgr") + "')", null, null, false, function(oSuccess) {
      sap.ui.getCore().byId('idNewAbwgr').setValue(oSuccess.Abwgr);
      sap.ui.getCore().byId('idNewAbwgr').setDescription(oSuccess.Gtext);
      sap.ui.getCore().byId('idNewAbwgr').setEditable(false);
    });

    var oDialog = new sap.m.Dialog({
      contentWidth: "20%",
      title: "Deletar",
      content: [oMarcDay],
      buttons: [new sap.m.Button({
        text: "Confirmar",
        type: sap.m.ButtonType.Accept,
        press: function(oEvent) {

          var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oItem.getProperty("Pernr")),
 new sap.ui.model.Filter('Ldate', sap.ui.model.FilterOperator.EQ, oItem.getProperty("Ldate")), ];

          var oUpdate = {};
          oUpdate.Stokz = 'X'; // Informado Apenas por Erro de Chave, Não utilizado
          oUpdate.Pernr = oItem.getProperty("Pernr");
          oUpdate.Ldate = oItem.getProperty("Ldate");
          oUpdate.Ltime = oItem.getProperty("Ltime");
          oUpdate.Satza = oItem.getProperty("Satza");
          oUpdate.Terid = oItem.getProperty("Terid");
          oUpdate.Abwgr = sap.ui.getCore().byId('idNewAbwgr').getValue();
          oUpdate.Dallf = oItem.getProperty("Dallf");

          oData.update(oItem.getPath(), oUpdate, null, function(oSuccess) {

            sap.m.MessageToast.show('Marcação Removida');

     sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").get_Frequency_Data(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));
     sap.ui.controller("zhr_br_time_freq.main").get_Employed_Information(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));

            sap.ui.getCore().byId('idMarcDay').bindAggregation("items", '/MarcacaoDiaSet', sap.ui.getCore().byId('idRowMarcDay'), null, oFilter);

            oDialog.destroy();
          }, function(oErro) {
            var sMessage = $(oErro.response.body).find('message').first().text();
            sap.m.MessageToast.show(sMessage);
          });
        }
      }), new sap.m.Button({
        text: "Cancelar",
        type: sap.m.ButtonType.Default,
        press: function() {
          oDialog.destroy();
        }
      })],
    })
    oDialog.open()
    //
  },

  getDiffDates: function(date_1, date_2) {

    // convert to UTC
    var date2_UTC = new Date(Date.UTC(date_2.getUTCFullYear(), date_2.getUTCMonth(), date_2.getUTCDate()));
    var date1_UTC = new Date(Date.UTC(date_1.getUTCFullYear(), date_1.getUTCMonth(), date_1.getUTCDate()));

    // --------------------------------------------------------------
    var days = date2_UTC.getDate() - date1_UTC.getDate();
    if (days < 0) {

      date2_UTC.setMonth(date2_UTC.getMonth() - 1);
      days += DaysInMonth(date2_UTC);
    }
    // --------------------------------------------------------------
    var months = date2_UTC.getMonth() - date1_UTC.getMonth();
    if (months < 0) {
      date2_UTC.setFullYear(date2_UTC.getFullYear() - 1);
      months += 12;
    }
    // --------------------------------------------------------------
    var years = date2_UTC.getFullYear() - date1_UTC.getFullYear();

    if (years >= 1) {
      return true;
    }
    if (months >= 1) {
      return true;
    }
    if (days > 30) {
      return true;
    }
    return false;

  },

  DaysInMonth: function(date2_UTC) {
    var monthStart = new Date(date2_UTC.getFullYear(), date2_UTC.getMonth(), 1);
    var monthEnd = new Date(date2_UTC.getFullYear(), date2_UTC.getMonth() + 1, 1);
    var monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
    return monthLength;
  },

});