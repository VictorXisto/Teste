sap.ui.controller("zhr_br_time_freq.TAB4.AprovHE", {
  /**
  * Called when a controller is instantiated and its View controls (if available) are already created.
  * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
  * @memberOf zhr_br_time_freq.TAB4.AprovHE
  */
    // ================================================================================
    // Evento Inicializa��o  
    // ================================================================================
    onInit: function() {

      //Inicializa Model Tabela
      var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
      var oData = new sap.ui.model.odata.ODataModel(vURL);
      oData.setCountSupported(false);
      var oTable = sap.ui.getCore().byId("oTable");
      oTable.setModel(oData);

    },

    // ================================================================================
    // Leitura HE's Aprovadas
    // ================================================================================
    get_Approval_Data : function(oPernr, oPeriodo) {

      var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
      var oData = new sap.ui.model.odata.ODataModel(vURL);
      oData.setCountSupported(false);

      oData.read("/PeriodsSet('" + oPeriodo.getSelectedKey() + "')", null, null, false, function(
          oDataSuccess) {

        var oTable = sap.ui.getCore().byId("oTable");
        var oTemplate = sap.ui.getCore().byId("oColumnTable");
        var filter = [ new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()),
                       new sap.ui.model.Filter('Data', sap.ui.model.FilterOperator.BT, oDataSuccess.Begda, oDataSuccess.Endda)];
        oTable.bindAggregation("items", '/ApprovalOvertimeSet', oTemplate, null, filter);

      });

      //Opções View
      var oLogin = sap.ui.getCore().byId('idLogin');
      if ( oLogin.getText() == oPernr.getText() ){
        var oModel = new sap.ui.model.json.JSONModel();
        var oConfTable = {};
        oConfTable.Insert = false;
        oModel.setData(oConfTable);
        sap.ui.getCore().setModel(oModel, 'IDGestConfTable');
      }else{
        var oModel = new sap.ui.model.json.JSONModel();
        var oConfTable = {};
        if (sap.ui.getCore().byId('idLocked').getText() == 'X') {
          oConfTable.Insert = false;
        } else {
          oConfTable.Insert = true;
        }
        oModel.setData(oConfTable);
        sap.ui.getCore().setModel(oModel, 'IDGestConfTable');
      }

    },

  /**
  * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
  * (NOT before the first rendering! onInit() is used for that one!).
  * @memberOf zhr_br_time_freq.TAB4.AprovHE
  */
//    onBeforeRendering: function() {
  //
//    },

  /**
  * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
  * This hook is the same one that SAPUI5 controls get after being rendered.
  * @memberOf zhr_br_time_freq.TAB4.AprovHE
  */
//    onAfterRendering: function() {
  //
//    },

  /**
  * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
  * @memberOf zhr_br_time_freq.TAB4.AprovHE
  */
//    onExit: function() {
  //
//    }

    // ================================================================================
    // Novo Registro Aprova��es  
    // ================================================================================
    AddApproval : function(){

      var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
      var oData = new sap.ui.model.odata.ODataModel(vURL);
      var oEntry = {};
      oEntry.Pernr  = sap.ui.getCore().byId('idmain').byId('idPernr').getText();
      oEntry.Data   = sap.ui.getCore().byId('idDate').getValue();
      oEntry.Begtime  = sap.ui.getCore().byId('idBegTime').getValue();
      oEntry.Endtime  = sap.ui.getCore().byId('idEndTime').getValue();

      //Marcação Dia Anterior
      if ( sap.ui.getCore().byId('idVtken').getSelected() == true ){
        oEntry.Vtken    = 'X';
      }

      oData.setCountSupported(false);

      oData.create("/ApprovalOvertimeSet", oEntry, null,
          function(oSuccess){
            jQuery.sap.require("sap.m.MessageBox");
              sap.m.MessageBox.show("Horas Extras Autorizadas",sap.m.MessageBox.Icon.SUCCESS);
              var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
              oData.read("/PeriodsSet('" + oPeriodo.getSelectedKey() + "')", null, null, false, function(
                  oDataSuccess) {
                var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
                var oTable = sap.ui.getCore().byId("oTable");
                // Atualiza Time
                var oCreate = {};
                oCreate.Pernr = oPernr.getText();
                oCreate.Mmaaaa = oPeriodo.getSelectedKey();
                oData.create("/EmployedSet", oCreate, null, null, null );
                // Atualiza Tela
                var oTemplate = sap.ui.getCore().byId("oColumnTable");
                var filter = [ new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()),
                               new sap.ui.model.Filter('Data', sap.ui.model.FilterOperator.BT, oDataSuccess.Begda, oDataSuccess.Endda)];
                oTable.bindAggregation("items", "/ApprovalOvertimeSet", oTemplate, null, filter);
                //Fecha Dialogo
                sap.ui.getCore().byId('IDConfInsert').close(oData);
                sap.ui.getCore().byId('IDDialogInsert').close(oData);

                // Atualiza Banco de Horas
                var oTable = sap.ui.getCore().byId("ListBancoHoras");
                var oTemplate = sap.ui.getCore().byId("ColumnListBancoHoras");
                var filter = [
                    new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()),
                    new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, oDataSuccess.Begda),
                    new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, oDataSuccess.Endda)
                ];
                oTable.bindAggregation("items", '/BancoHorasSet', oTemplate, null, filter);

              })

      },  
            function(error){  
                     var message = $(error.response.body).find('message').first().text();
                     jQuery.sap.require("sap.m.MessageBox");
                sap.m.MessageBox.show(message,sap.m.MessageBox.Icon.ERROR,"Mensagem de Erro");
              sap.ui.getCore().byId('IDConfInsert').close(oData);
            }
      );

    },


      // ================================================================================
    // Edia��o Arova��es
    // ================================================================================
    EditApproval : function(oParent){

      var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
      var oData = new sap.ui.model.odata.ODataModel(vURL);
        var sPernr   = oParent.getBindingContext().getProperty("Pernr");
        var sData    = oParent.getBindingContext().getProperty("Data");
        var sBegtime = oParent.getBindingContext().getProperty("Begtime");
        var sEndtime = oParent.getBindingContext().getProperty("Endtime");
        var sRealizada = oParent.getBindingContext().getProperty("Realizadas");
      var skey  = "/ApprovalOvertimeSet(Pernr='"        + sPernr + 
                       "',Data=datetime'" + sData  + 
                       "',Begtime=time'"  + sBegtime + 
                       "',Endtime=time'"  + sEndtime + 
                       "',Realizadas='"   + sRealizada + "')";

      var oEntry = {};
      oEntry.Pernr  = sap.ui.getCore().byId('idmain').byId('idPernr').getText();
      oEntry.Data   = sap.ui.getCore().byId('idDate').getValue();
      oEntry.Begtime  = sap.ui.getCore().byId('idBegTime').getValue();
      oEntry.Endtime  = sap.ui.getCore().byId('idEndTime').getValue();

      //Marcação Dia Anterior
      if ( sap.ui.getCore().byId('idVtken').getSelected() == true ){
        oEntry.Vtken    = 'X';
      }

      oData.setCountSupported(false);
      oData.update(skey, oEntry, null, 
          function(oSuccess){ //Sucesso  
            var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
              oData.read("/PeriodsSet('" + oPeriodo.getSelectedKey() + "')", null, null, false, function(
                  oDataSuccess) {
              var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
                // Atualiza Time
                var oCreate = {};
                oCreate.Pernr = oPernr.getText();
                oCreate.Mmaaaa = oPeriodo.getSelectedKey();
                oData.create("/EmployedSet", oCreate, null, null, null );
                // Atualiza Tela
              var oTable = sap.ui.getCore().byId("oTable");
              var oTemplate = sap.ui.getCore().byId("oColumnTable");
              jQuery.sap.require("sap.m.MessageBox");
              sap.m.MessageBox.show("Autorização Alterada",sap.m.MessageBox.Icon.SUCCESS);  
              //Atualiza��o List de Programa��o
              var filter = [ new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()),
                             new sap.ui.model.Filter('Data', sap.ui.model.FilterOperator.BT, oDataSuccess.Begda, oDataSuccess.Endda)];
              oTable.bindAggregation("items", '/ApprovalOvertimeSet', oTemplate, null, filter);
                //Fecha Dialogo
                sap.ui.getCore().byId('IDConfEdit').close(oData);
                sap.ui.getCore().byId('IDDialogEdit').close(oData);
                // Atualiza Banco de Horas
                var oTable = sap.ui.getCore().byId("ListBancoHoras");
                var oTemplate = sap.ui.getCore().byId("ColumnListBancoHoras");
                var filter = [
                    new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()),
                    new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, oDataSuccess.Begda),
                    new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, oDataSuccess.Endda)
                ];
                oTable.bindAggregation("items", '/BancoHorasSet', oTemplate, null, filter);
              })
          },
            function(error){  
            var sMessage = $(error.response.body).find('message').first().text();
                jQuery.sap.require("sap.m.MessageBox");
              sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.ERROR, "Mensagem de Erro");
          });

    },

      // ================================================================================
    // Apaga Aprova��o
    // ================================================================================
    DeleteApproval : function(oParent){

      var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
      var oData = new sap.ui.model.odata.ODataModel(vURL);
        var sPernr     = oParent.getBindingContext().getProperty("Pernr");
        var sData      = oParent.getBindingContext().getProperty("Data");
        var sBegtime   = oParent.getBindingContext().getProperty("Begtime");
        var sEndtime   = oParent.getBindingContext().getProperty("Endtime");
        var sRealizada = oParent.getBindingContext().getProperty("Realizadas");
      var skey  = "/ApprovalOvertimeSet(Pernr='"        + sPernr +
                       "',Data=datetime'" + sData  +
                       "',Begtime=time'"  + sBegtime +
                       "',Endtime=time'"  + sEndtime +
                       "',Realizadas='"   + sRealizada + "')";

      oData.setCountSupported(false);
      oData.remove(skey, null, 
        function(oSuccess){ //Sucesso  
          var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
            oData.read("/PeriodsSet('" + oPeriodo.getSelectedKey() + "')", null, null, false, function(
                oDataSuccess) {
            var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
              // Atualiza Time
              var oCreate = {};
              oCreate.Pernr = oPernr.getText();
              oCreate.Mmaaaa = oPeriodo.getSelectedKey();
              oData.create("/EmployedSet", oCreate, null, null, null );
              // Atualiza Tela
            var oTable = sap.ui.getCore().byId("oTable");
            var oTemplate = sap.ui.getCore().byId("oColumnTable");
            jQuery.sap.require("sap.m.MessageBox");
            sap.m.MessageBox.show("Autorização Excluida",sap.m.MessageBox.Icon.SUCCESS);  
            //Atualiza��o List de Programa��o
            var filter = [ new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()),
                           new sap.ui.model.Filter('Data', sap.ui.model.FilterOperator.BT, oDataSuccess.Begda, oDataSuccess.Endda)];
            oTable.bindAggregation("items", '/ApprovalOvertimeSet', oTemplate, null, filter);
            sap.ui.getCore().byId("IDConfDelete").close();
              // Atualiza Banco de Horas
              var oTable = sap.ui.getCore().byId("ListBancoHoras");
              var oTemplate = sap.ui.getCore().byId("ColumnListBancoHoras");
              var filter = [
                  new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()),
                  new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, oDataSuccess.Begda),
                  new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, oDataSuccess.Endda)
              ];
              oTable.bindAggregation("items", '/BancoHorasSet', oTemplate, null, filter);
            })
        },
          function(error){  
          var sMessage = $(error.response.body).find('message').first().text();
              jQuery.sap.require("sap.m.MessageBox");
            sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.ERROR, "Mensagem de Erro");
        });

    },

      // ================================================================================
    // Dialogo de Confirma��o - Exclus�o  
    // ================================================================================
    eConfDelete : function(oEvent){

       var oParent = oEvent.getSource().getParent();

       var oDialogConfDelete = new sap.m.Dialog('IDConfDelete',{
          title : 'Confirmação',
          content : [ new sap.m.Text({text : "Deseja excluir autorização?"})],
                      // Bot�o Confirmar
          buttons : [ new sap.m.Button({ text : "Confirmar",
                           type : sap.m.ButtonType.Accept,
                           press: function() { 
                              sap.ui.getCore().byId("idApro").getController().DeleteApproval(oParent);
                           }
                  }),
                    // Bot�o Cancelar
                  new sap.m.Button({ text : "Cancelar",
                           type : sap.m.ButtonType.Default,
                           press: function() { oDialogConfDelete.close(); 
                           }                           
                  })
                ],
          afterClose: function() {
              oDialogConfDelete.destroy();
          }
       })
        
       oDialogConfDelete.open();

    },

      // ================================================================================
    // Dialogo de Confirma��o - Inclus�o  
    // ================================================================================
    eConfInsert : function(){

        var sData    = sap.ui.getCore().byId('idDate').getValue();    
        var sBegtime = sap.ui.getCore().byId('idBegTime').getValue();    
        var sEndtime = sap.ui.getCore().byId('idEndTime').getValue();

        if ( sData == '' || sBegtime == '' || sEndtime == '' ){
            jQuery.sap.require("sap.m.MessageBox");
          sap.m.MessageBox.show('Preencher Todos os Campos', sap.m.MessageBox.Icon.ERROR, "Mensagem de Erro");
        }else{

         var oDialogConfInsert = new sap.m.Dialog('IDConfInsert',{
            title : 'Confirmação',
            content : [ new sap.m.Text({text : "Deseja incluir autorização?"})],
                        // Bot�o Confirmar
            buttons : [ new sap.m.Button({ text : "Confirmar",
                           type : sap.m.ButtonType.Accept,
                           press: function() { 
                             sap.ui.getCore().byId("idApro").getController().AddApproval();
                           }
                    }),
                      // Bot�o Cancelar
                    new sap.m.Button({ text : "Cancelar",
                               type : sap.m.ButtonType.Default,
                               press: function() { oDialogConfInsert.close(); }              
                  })
            ],
            afterClose: function() {
              oDialogConfInsert.destroy();
            }
         })

         oDialogConfInsert.open();

        }           

    },

      // ================================================================================
    // Dialogo de Confirma��o - Edi��o  
    // ================================================================================
    eConfEdit : function(oParent){

      var sData    = oParent.getBindingContext().getProperty("Data");
      var sBegtime = oParent.getBindingContext().getProperty("Begtime");
      var sEndtime = oParent.getBindingContext().getProperty("Endtime");

        if ( sData == '' || sBegtime == '' || sEndtime == '' ){
            jQuery.sap.require("sap.m.MessageBox");
          sap.m.MessageBox.show('Preencher Todos os Campos', sap.m.MessageBox.Icon.ERROR, "Mensagem de Erro");
        }else{

          var oDialogConfEdit = new sap.m.Dialog('IDConfEdit',{
            title : 'Confirmação',
            content : [ new sap.m.Text({text : "Deseja modificar autorização?"})],
                        // Bot�o Confirmar
            buttons : [ new sap.m.Button({ text : "Confirmar",
                             type : sap.m.ButtonType.Accept,
                             press: function() { 
                               sap.ui.getCore().byId("idApro").getController().EditApproval(oParent);
                             }
                  }),
                      // Bot�o Cancelar
                    new sap.m.Button({ text : "Cancelar",
                               type : sap.m.ButtonType.Default,
                               press: function() { oDialogConfEdit.close(); }              
                    })
            ],
            afterClose: function() {
              oDialogConfEdit.destroy();
            }
          })
        
       oDialogConfEdit.open();
       
        }

    },

      // ================================================================================
    // Dialogo de Inclus�o  
    // ================================================================================
    eDialogInsert : function(oEvent){

       oDialogInsert = new sap.m.Dialog('IDDialogInsert',{
                title : 'Autorização Horas Extras',
                showHeader : true,
                type : sap.m.DialogType.Standard,
                contentWidth : '300px',
                contentHeight: '250px',
        //      content : [ new sap.m.ObjectHeader({
        //                title : 'Autorização Horas Extras',
        //                responsive: true,
        //                intro: sap.ui.getCore().byId('idmain').byId('idNome').getText(),
        //      })],
                buttons : [ new sap.m.Button({ text : "Inserir",
                                 type : sap.m.ButtonType.Accept,
                                 press: function() { sap.ui.getCore().byId("idApro").getController().eConfInsert(); 
                                 }
                      }),
                      new sap.m.Button({ text : "Cancelar",
                                 type : sap.m.ButtonType.Default,
                                 press: function() { oDialogInsert.close(); }
                      })
                ],
                afterClose: function() {
                  oDialogInsert.destroy();
                }
      })

      var oLayout = new sap.ui.commons.layout.MatrixLayout({
          width  : "100%",
          height : "40px",
          columns : 7,
          widths : ["40%","25%","10%","25%"], 
      } )
      oLayout.createRow(new sap.m.Label({text:"Data"}),
                        new sap.m.DateTimeInput('idDate',{displayFormat : 'dd/MM/yyyy',
                                                          valueFormat : "yyyy-MM-dd'T00:00:00'"}));
      oLayout.createRow(
                  new sap.m.CheckBox('idVtken',{  text : 'Dia Anterior',  }));
      oLayout.createRow(
                new sap.m.Label({text:"Período Hora Extra"}),
                new sap.m.DateTimeInput('idBegTime',{displayFormat : 'HH:mm', type : "Time", valueFormat : "PTHH'H'mm'M'ss'S'"}),
                new sap.m.Label({text:"até"}),
                new sap.m.DateTimeInput('idEndTime',{displayFormat : 'HH:mm', type : "Time", valueFormat : "PTHH'H'mm'M'ss'S'"})),
      oDialogInsert.addContent(oLayout);
      oDialogInsert.open();

    },

    // ================================================================================
    // Dialogo de Edi��o  
    // ================================================================================
    eDialogEdit : function(oEvent){

       var oParent = oEvent.getSource().getParent();

       oDialogEdit = new sap.m.Dialog('IDDialogEdit',{
                title : 'Autorização Horas Extras',
                showHeader : true,
                type : sap.m.DialogType.Standard,
                contentWidth : '300px',
                contentHeight: '250px',
//            content : [ new sap.m.ObjectHeader({
//                      title : 'Autorização Horas Extras',
//                      responsive: true,
//                      intro: sap.ui.getCore().byId('idmain').byId('idNome').getText(),
//            })],
                buttons : [ new sap.m.Button({ text : "Modificar",
                                 type : sap.m.ButtonType.Accept,
                                 press: function() { sap.ui.getCore().byId("idApro").getController().eConfEdit(oParent); 
                                 }
                      }),
                      new sap.m.Button({ text : "Cancelar",
                                 type : sap.m.ButtonType.Default,
                                 press: function() { oDialogEdit.close(); }
                      })
                ],
                afterClose: function() {
                  oDialogEdit.destroy();
                }
      })


      var oLayout = new sap.ui.commons.layout.MatrixLayout({
          width  : "100%",
          height : "40px",
          columns : 7,
          widths : ["40%","25%","10%","25%"], 
      } )
      oLayout.createRow(new sap.m.Label({text:"Data"}),
                        new sap.m.DateTimeInput('idDate',{displayFormat : 'dd/MM/yyyy',
                                                          valueFormat : "yyyy-MM-dd'T00:00:00'"}));
      oLayout.createRow(
                  new sap.m.CheckBox('idVtken',{  text : 'Dia Anterior',  }));

      oLayout.createRow(
                new sap.m.Label({text:"Período Hora Extra"}),
                new sap.m.DateTimeInput('idBegTime',{displayFormat : 'HH:mm', type : "Time", valueFormat : "PTHH'H'mm'M'ss'S'"}),
                new sap.m.Label({text:"até"}),
                new sap.m.DateTimeInput('idEndTime',{displayFormat : 'HH:mm', type : "Time", valueFormat : "PTHH'H'mm'M'ss'S'"})),
      oDialogInsert.addContent(oLayout);
      oDialogInsert.open();

//      Dia Anterior
          if ( oParent.getBindingContext().getProperty("AutorizadasVtken") == 'X' ){
        sap.ui.getCore().byId('idVtken').setSelected(true);
          }else{
          sap.ui.getCore().byId('idVtken').setSelected(false);
      }


    }

  });