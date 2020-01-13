sap.ui.controller("zhr_br_time_freq.DIVERG.Divergencia", {

  /**
   * Called when a controller is instantiated and its View
   * controls (if available) are already created. Can be used
   * to modify the View before it is displayed, to bind event
   * handlers and do other one-time initialization.
   * 
   * @memberOf zhr_br_time_freq.DIVERG.Divergencia
   */

  onInit: function() {


      this.oChangeLines = [];



      var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
      var oData = new sap.ui.model.odata.ODataModel(vURL);
      oData.setCountSupported(false);

      oData.read("/AbsenceTypeSet", {
          filters: null,
          success: function(oData) {  
            
            var json = new sap.ui.model.json.JSONModel(oData);
          sap.ui.getCore().setModel(json, 'Awart');        

          }
        });

  },
  /**
   * Similar to onAfterRendering, but this hook is invoked
   * before the controller's View is re-rendered (NOT before
   * the first rendering! onInit() is used for that one!).
   * 
   * @memberOf zhr_br_time_freq.DIVERG.Divergencia
   */
  // onBeforeRendering: function() {
  //
  // },
  /**
   * Called when the View has been rendered (so its HTML is
   * part of the document). Post-rendering manipulations of
   * the HTML could be done here. This hook is the same one
   * that SAPUI5 controls get after being rendered.
   * 
   * @memberOf zhr_br_time_freDIVERG.Divergenciaia
   */
  // onAfterRendering: function() {
  //
  // },
  /**
   * Called when the Controller is destroyed. Use this one to
   * free resources and finalize activities.
   * 
   * @memberOf zhr_br_time_freq.DIVERG.Divergencia
   */
  // onExit: function() {
  //
  // }
  get_Divergence_Data: function(oPernr, oPeriodo) {

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oData.setCountSupported(false);

    oData.read("/PeriodsSet('" + oPeriodo.getSelectedKey() + "')", null, null, false, function(oDataSuccess) {
      var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()),
      new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.BT, oDataSuccess.Begda, oDataSuccess.Endda), ];

      oData.read("/DivergenceSet", {
        filters: oFilter,
        success: function(oData) {
          var json = new sap.ui.model.json.JSONModel(oData);
          var oTable = sap.ui.getCore().byId('idDive').byId('idDivergencia');
          var oTemplate = sap.ui.getCore().byId('idDive').byId('idRowBase');
          oTable.destroyItems();
          oTable.setModel(json);
          oTable.bindAggregation("items", {
            path: "/results",
            template: oTemplate
          });

          // Verifica
          // se é
          // Gestor
          var oGestor = sap.ui.getCore().byId('idGestor').getText();
          // Adiciona
          // Eventos
          // Status
          var oItem = oTable.getItems();
          var oLogin = sap.ui.getCore().byId('idLogin');
          jQuery.each(oItem, function(index) {
            
            var oline = oItem[index]; // Linha
//            oline.mAggregations.cells[7].setVisible(true);
            // Tabela
            var oSel = oline.getBindingContext().getObject(); // Valores
            // da
            // Linha
            if (oSel.TpStatus == '01' && (oLogin.getText() != oPernr.getText()) && (sap.ui.getCore().byId('idLocked').getText() == '')) {
              var oStatus = oline.getCells()[0]; // Objeto
              // Upload
              oStatus.attachPress(function(oEvent) {
                sap.ui.getCore().byId("idDive").getController().Aprov_HE(oEvent);
              });
            }
          });
        }

      });

    });
  },
  
  setVisibleAttach: function(p_file, p_crm, p_awart){
                  
          for(var i=0; i<sap.ui.getCore().getModel('Awart').getData().results.length; i++){
            if(sap.ui.getCore().getModel('Awart').getData().results[i].Awart == p_awart &&
                sap.ui.getCore().getModel('Awart').getData().results[i].Med == "true" ){
              return true;
            }
          }
          if(p_file == "" && p_awart == "") {
           return false; 
          }
    
  },

  get_valueHelpAbwtxt: function(oObject, oEvent) {

  var that = this;
    
  var oChange = [];     

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oData.setCountSupported(false);

    var oItemTemplate = new sap.m.StandardListItem({
      title: "{Awart}",
      description: "{Atext}",
      active: true
    });

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

        var oTable = sap.ui.getCore().byId('idDive').byId('idDivergencia');        
        var split  = oObject.split('-')[4];
        var index = parseInt(split);

        // Se tiver Med=true deixa anexo visivel
        if (oEvent.mParameters.selectedItem.getBindingContext().getProperty().Med == "true"){
          oTable.mAggregations.items[index].mAggregations.cells[7].setVisible(true);
        }        
        
        // GUARDA LINHA ALTERADA
        that.oChangeLines.push(index);
        
        if(oImput.getValue() == '') {

          if(sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[8].sId).getValueState() == 'Error' ||
              sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[9].sId).getValueState() == 'Error' ){
            sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[8].sId).setValueState('None').setValueStateText('');
            sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[9].sId).setValueState('None').setValueStateText('');
          }
        if(sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[8].sId).getValue() != ''){
          sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[8].sId).setValue('');
        }
        if(sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[9].sId).getValue() != ''){
          sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[9].sId).setValue('');
        }
        if(sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[10].sId).getSelected() != false){
          sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[10].sId).setSelected(false);
        }
        } else {

            if( (sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[8].sId).getValue() == "" ||
                sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[9].sId).getValue() == "" )  &&
               sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[10].sId).getSelected() == false  ) {
              if(sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[8].sId).getValue() == ""){
                  sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[8].sId).setValueState('Error').setValueStateText('Informar horário de início e fim ou período integral');
              }
              if( sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[9].sId).getValue() == ""){
                  sap.ui.getCore().byId(oTable.mAggregations.items[index].mAggregations.cells[9].sId).setValueState('Error').setValueStateText('Informar horário de início e fim ou período integral');
              }

              }
        }

        
      },
      liveChange: function(oEvt) {
        // Filtro
        var aFilters = [];
        var sQuery = oEvt.getParameters().value;
        if (sQuery && sQuery.length > 0) {
          var filter = new sap.ui.model.Filter("Atext", sap.ui.model.FilterOperator.Contains, sQuery);
          aFilters.push(filter);
        }
        // Filtro
        oEvt.getSource().getBinding("items").filter(aFilters);
      }
    });
    var oItemTemplate = new sap.m.StandardListItem({
      title: "{Awart}",
      description: "{Atext}",
      active: true
    });

        var json = new sap.ui.model.json.JSONModel(sap.ui.getCore().getModel('Awart').oData);   
        oSelectDialog.destroyItems();
        oSelectDialog.setModel(json);
        oSelectDialog.bindAggregation("items", {
          path: "/results",
          template: oItemTemplate
        });
        oSelectDialog.open();

  },
  
  onSelCheckBox: function(oEvent) {
    if(this.oChangeLines.includes(parseInt(oEvent.getSource().sId.split("-")[4]))){
      
    } else {
      this.oChangeLines.push(parseInt(oEvent.getSource().sId.split("-")[4]));     
    }

    var lv_error = false;
  var oParent = oEvent.getSource().getParent();
   if (oParent.getCells()[10].getSelected() == true) {
    oParent.getCells()[8].setEditable(false);
    oParent.getCells()[9].setEditable(false);
    oParent.getCells()[8].setValue('');
    oParent.getCells()[9].setValue('');
    if(oParent.getCells()[8].getValueState() == 'Error'){
   	 oParent.getCells()[8].setValueState('None').setValueStateText('');
    }
    if(oParent.getCells()[9].getValueState() == 'Error'){
   	 oParent.getCells()[9].setValueState('None').setValueStateText('');
    }     
   }
   else {
    oParent.getCells()[8].setEditable(true);
    oParent.getCells()[9].setEditable(true);
    if(oParent.getCells()[6].getValue() != '') {
    for(var i=0; i < sap.ui.getCore().getModel('Awart').oData.results.length; i++){
   	 if(oParent.getCells()[6].getValue() == sap.ui.getCore().getModel('Awart').oData.results[i].Awart){
      lv_error = true;
     }   
    }
    if(lv_error == true){
   	 oParent.getCells()[8].setValueState('Error').setValueStateText('Informar período início e fim ou período integral');
       oParent.getCells()[9].setValueState('Error').setValueStateText('Informar período início e fim ou período integral');
      }
    }
    }
   ;
//  },

  },

  checkChangeFieldTime: function(oEvent) {
    
    if(this.oChangeLines.includes(parseInt(oEvent.getSource().sId.split("-")[4]))){

    } else {
      this.oChangeLines.push(parseInt(oEvent.getSource().sId.split("-")[4]));     
    }

    if(oEvent.getSource().getValue() != "" &&
        oEvent.getSource().getValueState() == 'Error' ){
      oEvent.getSource().setValueState('None');
      oEvent.getSource().setValueStateText('');     
    }

  },

  set_Divergence_Data: function(oEvent) {

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oData.setCountSupported(false);

    var oInputFrequency = {};
    var oDate = new Date();

    var str;

    var oTable = sap.ui.getCore().byId('idDive').byId('idDivergencia');

    var tResult = oTable.getModel().getData();

    var erro = false
    
    for(var i=0; i<this.oChangeLines.length; i++){
  
        var oUpdate = {};
        oUpdate.Abwtxt = tResult.results[this.oChangeLines[i]].Abwtxt // "";
        oUpdate.Alldf = tResult.results[this.oChangeLines[i]].Alldf // "";
        oUpdate.Anzhl = tResult.results[this.oChangeLines[i]].Anzhl // "0.00";
        oUpdate.Awart = tResult.results[this.oChangeLines[i]].Awart // "";
        oUpdate.Begtm = tResult.results[this.oChangeLines[i]].Begtm // "PT99H99M99S";
        oUpdate.Beguz = tResult.results[this.oChangeLines[i]].Beguz // "PT08H00M00S";
        oUpdate.Crm = tResult.results[this.oChangeLines[i]].Crm // "";
        oUpdate.Datum = tResult.results[this.oChangeLines[i]].Datum // "2015-10-16T00:00:00";
        oUpdate.Endtm = tResult.results[this.oChangeLines[i]].Endtm // "PT99H99M99S";
        oUpdate.Enduz = tResult.results[this.oChangeLines[i]].Enduz // "PT20H00M00S";
        oUpdate.Error = tResult.results[this.oChangeLines[i]].Error // "@8N@";
        oUpdate.File = tResult.results[this.oChangeLines[i]].File // "";
        oUpdate.Langt = tResult.results[this.oChangeLines[i]].Langt // "Sexta";
        oUpdate.Mod = tResult.results[this.oChangeLines[i]].Mod // "";
        oUpdate.ModKwert = tResult.results[this.oChangeLines[i]].ModKwert // "";
        oUpdate.Pernr = tResult.results[this.oChangeLines[i]].Pernr // "00000076";
        oUpdate.Sobeg = tResult.results[this.oChangeLines[i]].Sobeg // "PT08H00M00S";
        oUpdate.Soend = tResult.results[this.oChangeLines[i]].Soend // "PT17H00M00S";
        oUpdate.Tagty = tResult.results[this.oChangeLines[i]].Tagty // "0";
        oUpdate.Txter = tResult.results[this.oChangeLines[i]].Txter // "HE

      oUpdate.Beguz = tResult.results[this.oChangeLines[i]].Beguz;
      if (oUpdate.Beguz == '00:00' || oUpdate.Beguz == '') {
        oUpdate.Beguz = 'PT99H99M99S';
      };

      oUpdate.Enduz = tResult.results[this.oChangeLines[i]].Enduz;
      if (oUpdate.Enduz == '00:00' || oUpdate.Enduz == '') {
        oUpdate.Enduz = 'PT99H99M99S';
      };

      oUpdate.Begtm = oTable.getItems()[this.oChangeLines[i]].getCells()[8].getValue();
      if (oUpdate.Begtm == '00:00' || oUpdate.Begtm == '') {
        oUpdate.Begtm = 'PT99H99M99S';
      };

      oUpdate.Endtm = oTable.getItems()[this.oChangeLines[i]].getCells()[9].getValue();
      if (oUpdate.Endtm == '00:00' || oUpdate.Endtm == '') {
        oUpdate.Endtm = 'PT99H99M99S';
      };

      oUpdate.Awart = oTable.getItems()[this.oChangeLines[i]].getCells()[6].getValue();
      if (oTable.getItems()[this.oChangeLines[i]].getCells()[10].getProperty("selected") == true ){
        oUpdate.Alldf = "X";
      } else if(oTable.getItems()[this.oChangeLines[i]].getCells()[10].getProperty("selected") == false){
        oUpdate.Alldf = " ";        
      };
      oUpdate.Abwtxt = oTable.getItems()[this.oChangeLines[i]].getCells()[6].getDescription();
      oUpdate.Anzhl = tResult.results[this.oChangeLines[i]].Anzhl;
      
      oData.update("/DivergenceSet(Pernr='" + tResult.results[this.oChangeLines[i]].Pernr + "'," + "Datum=datetime'" + tResult.results[this.oChangeLines[i]].Datum + "',"
      + "Awart='" + tResult.results[this.oChangeLines[i]].Awart + "'," + "Begtm=time'" + tResult.results[this.oChangeLines[i]].Begtm + "'," +
 "Endtm=time'" + tResult.results[this.oChangeLines[i]].Endtm + "'," + "Beguz=time'" + tResult.results[this.oChangeLines[i]].Beguz + "'," + "Enduz=time'"
 + tResult.results[this.oChangeLines[i]].Enduz + "')", oUpdate, null, function(oSuccess) {

      }, function(oErro) {

        var sMessage = $(oErro.response.body).find('message').first().text();

      });
      
    }

    var oCreate = {};
    oCreate.Pernr = sap.ui.getCore().byId('idmain').byId('idPernr').getText();
    oCreate.Mmaaaa = sap.ui.getCore().byId('idmain').byId('idPeriodo').getSelectedKey();
    oData.create("/EmployedSet", oCreate, null, function(oSuccess) {
      
      sap.m.MessageToast.show('Dados enviados para processamento');
      // Recarrega tabela de frequência
      sap.ui.controller("zhr_br_time_freq.DIVERG.Divergencia").get_Divergence_Data(sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));
      // Saldo do Banco de Horas não estava sendo atualizado 
      sap.ui.controller("zhr_br_time_freq.main").get_Employed_Information(sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));
    }, function(oErro) {
      var sMessage = $(oErro.response.body).find('message').first().text();
      sap.m.MessageToast.show(sMessage);
    });

  },

  get_Divergence_Files: function(oEvent, p_line, p_row) {

      var vCrm = false;

  var oAwart = oEvent.getSource().getParent().mAggregations.cells[6].mProperties.value;  

  for(var i=0; i < sap.ui.getCore().getModel('Awart').getData().results.length; i++){
    if(sap.ui.getCore().getModel('Awart').getData().results[i].Awart == oAwart){
      if(sap.ui.getCore().getModel('Awart').getData().results[i].Med != "false"){
        vCrm = true;
      }
    }
  }  

// VERIFICAR SE Mod = "", SE FOR BLOQUIA CAMPOS PARA EDIÇÃO
    var lv_enabled = true;
    if(p_line.Mod == "" || sap.ui.getCore().byId('idLocked').getText() == "X") {
      lv_enabled = false;
    }

    var oFiles = new sap.m.Table('idTabFile', {
      columns: [

      new sap.m.Column({
      visible: true ,
      header: new sap.m.Label({
        text: "Justificativa"
      }),
      width: '30%'
    }),


      ],    });

    // Erro de exibição Anexo
    oFiles.addColumn(new sap.m.Column({
      visible: vCrm,
      header: new sap.m.Label({
        text: "CRM"
      }),
      width: '10%'
    }));

    oFiles.addColumn(new sap.m.Column({
      visible: vCrm,
      header: new sap.m.Label({
        text: "CID"
      }),
      width: '10%'
    }));

    oFiles.addColumn(
        new sap.m.Column({       header: new sap.m.Label({
          text: "Arquivo"
        }),
        width: '20%'
      }));

    oFiles.addColumn(new sap.m.Column({
      header: new sap.m.Label({
        text: ""
      }),
      width: '5%'
    }));

    oFiles.addColumn(new sap.m.Column({
      header: new sap.m.Label({
        text: ""
      }),
      width: '5%'
    }));

    var oRowFile = new sap.m.ColumnListItem("idRowFile", {
      cells: [ new sap.m.Label({
        text: "{Justificativa}"
      }), new sap.m.Label({
        text: "{Crm}"
      }), new sap.m.Label({
        text: "{Cid}"
      }),new sap.m.Label({
        text: "{Filename}"
      }), new sap.m.Button({
        type: sap.m.ButtonType.Transparent,
        icon: sap.ui.core.IconPool.getIconURI('download'),
        enabled: true,
        visible: true,
        press: function(oEvent) {
          sap.ui.controller("zhr_br_time_freq.DIVERG.Divergencia").Files_Show(p_line.Datum, oAwart, this.getParent().getCells()[3].getText());
        }
      }), new sap.m.Button({
        type: sap.m.ButtonType.Transparent,
        icon: sap.ui.core.IconPool.getIconURI('delete'),
        enabled: true,
        visible: lv_enabled,
        press: function(oEvent) {
          sap.ui.controller("zhr_br_time_freq.DIVERG.Divergencia").Files_Delete(p_line.Datum, oAwart, this.getParent());
        }
      }), ],
    });

// SE Mod = "", oculta os campos de inserção
    if(p_line.Mod != ""  && sap.ui.getCore().byId('idLocked').getText() != "X") {


    var oMatrix = new sap.ui.commons.layout.MatrixLayout({
      columns: 4,
      width: "100%",
      widths: ['70px', '40%', '70px', '40%']
    });

    var oVertical    = new sap.ui.layout.VerticalLayout();
    var oHorizontal1  = new sap.ui.layout.HorizontalLayout();
    var oHorizontal2  = new sap.ui.layout.HorizontalLayout();
    var oHorizontal3  = new sap.ui.layout.HorizontalLayout();
    var oHorizontal4  = new sap.ui.layout.HorizontalLayout();
    var oHorizontal5  = new sap.ui.layout.HorizontalLayout();
    var oHorizontal6  = new sap.ui.layout.HorizontalLayout();


    oHorizontal1.addContent(new sap.m.Label({text:'Justificativa', width:'90px'}));
    oHorizontal1.addContent(new sap.m.TextArea({id:"idJustificativa", width:'450px', rows: 3, enabled: lv_enabled}));

    oVertical.addContent(oHorizontal1);

    var oCell1 = new sap.m.Label({
      text: 'Arquivo',
      width:'90px'

    })

    var oCell2 = new sap.ui.commons.FileUploader('idFile', {
      uploadUrl: "/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/FileSet",
      icon: "sap-icon://upload", // sap.ui.core.URI,
      enabled: lv_enabled,
      iconOnly: true, // boolean, since 1.26.0
      width: '235px',
      multiple: false, // boolean
      sendXHR: true, // boolean
//      placeholder: undefined, // string
//      style: undefined, // string
      useMultipart: false, // boolean
//      maximumFilenameLength: undefined, // int,
      // since
      // 1.24.0
      uploadComplete: function(oEvent) {
        var sResponse = oEvent.getParameter("status");

        // Atualiza Erro
        if (sResponse == '201') {
          sap.m.MessageToast.show('Gravado com sucesso');
          var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');

          var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV';
          var oData = new sap.ui.model.odata.ODataModel(vURL);
          oData.setCountSupported(false);

          var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), new sap.ui.model.Filter('Data',
              sap.ui.model.FilterOperator.EQ, p_line.Datum), new sap.ui.model.Filter('Awart', sap.ui.model.FilterOperator.EQ, oAwart)];

          sap.ui.getCore().byId('idTabFile').bindAggregation("items", '/FileSet', sap.ui.getCore().byId('idRowFile'), null, oFilter);
          this.setValue();
          sap.ui.getCore().byId('idCRM').setValue();
          sap.ui.getCore().byId('idCID').setValue();
          sap.ui.getCore().byId('idJustificativa').setValue();
        } else {
          sap.m.MessageToast.show('Erro arquivo não pode ser gravado');
        };
      }
    });

    oHorizontal2.addContent(oCell1);
    oHorizontal2.addContent(oCell2);
    oVertical.addContent(oHorizontal2);

    if (vCrm == true) {

      oCell1 = new sap.m.Label({
      required: true,
        text: 'CRM',
        width:'90px'
      });

      oCell2 = new sap.m.Input({
          id:'idCRM',
        width:'200px',
        enabled: lv_enabled
      });

      oCell3 = new sap.m.Label({
        required: true,
        text: 'CID',
        width:'90px',
      });

      var oCell4 = new sap.m.Input({
          id:'idCID',
        width:'200px',
        enabled: lv_enabled
      });
      oHorizontal3.addContent(oCell1);
      oHorizontal3.addContent(oCell2);
      oHorizontal4.addContent(oCell3);
      oHorizontal4.addContent(oCell4);
      oVertical.addContent(oHorizontal3);
      oVertical.addContent(oHorizontal4);

    }

    oVertical.addContent(new sap.m.Label());
    var oToolBar = new sap.m.Toolbar();

    oToolBar.addContent(oVertical); 

    if (vCrm == true) {
      oToolBar.setHeight('auto');
    } else {
      oToolBar.setHeight('auto');
    };

    oFiles.setHeaderToolbar(oToolBar);


      var oCell3 = new sap.m.Button({
        text: "Inserir informações",
        type: sap.m.ButtonType.Accept,
        press: function(oEvent) {
          sap.ui.controller("zhr_br_time_freq.DIVERG.Divergencia").Files_Create(vCrm, p_line.Datum, oAwart);
        }
      });

      oHorizontal6.addContent(oCell3);
      oVertical.addContent(oHorizontal6);
      oVertical.addContent();

}

    var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oData.setCountSupported(false);

    var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), new sap.ui.model.Filter('Data',
     sap.ui.model.FilterOperator.EQ, p_line.Datum), new sap.ui.model.Filter('Awart', sap.ui.model.FilterOperator.EQ, oAwart) ];

    oFiles.setModel(oData);
    oFiles.bindAggregation("items", '/FileSet', oRowFile, null, oFilter);

    var oDialog = new sap.m.Dialog({
      contentWidth: "600px",
      contentHeight: '50%',
      resizable: true,
      draggable: true,
      title: 'Informações complementares da justificativa',
      content: [oFiles],
      buttons: [

        new sap.m.Button({
        text: "Fechar",
        press: function() {
          oDialog.destroy();
          oFiles.destroy();
        }
      })],
    });

    oDialog.open();

  },

  Files_Create: function(vCrm, vDate, vAwart) {

    var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV");
    oModel.setCountSupported(false);
    sap.ui.getCore().setModel(oModel);

    var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
    var oFile = sap.ui.getCore().byId('idFile');
    var oCRM = sap.ui.getCore().byId('idCRM');
    var oCID = sap.ui.getCore().byId('idCID');
    var oJustificativa = sap.ui.getCore().byId('idJustificativa');

    if (vCrm == true) {

      // Monta Chave
      var sKey = oPernr.getText() // No Pessoal
          + ';' + vDate.substring(0, 4) + vDate.substring(5, 7) + vDate.substring(8, 10) // Data
          + ';' + vAwart // Ausencia
          + ';' + oFile.getValue() // Nome Arquivo
          + ';' + oCRM.getValue() // CRM
          + ';' + oCID.getValue()// CID
          + ';' + oJustificativa.getValue(); // justificativa

      if (oCRM.getValue() == '' && vCrm == true) {
        sap.m.MessageToast.show('Campo CRM obrigatório para esse motivo de justificativa');
      } else {

        // Define Header para atualização Odata
        oFile.destroyHeaderParameters();
        oFile.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({
          name: "x-csrf-token",
          value: oModel.getSecurityToken()
        }));
        oFile.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({
          name: "slug",
          value: sKey
        }));
        oFile.upload();

      };

    }else {
    	oFile.setValue(oFile.getValue().replace(/º/g,"@!"))
      	
	    // Monta Chave
	    var sKey = oPernr.getText() // No Pessoal
	        + ';' + vDate.substring(0, 4) + vDate.substring(5, 7) + vDate.substring(8, 10) // Data
	        + ';' + vAwart // Ausencia
	        + ';' + oFile.getValue() // Nome Arquivo
	        + ';' + '' // CRM
	        + ';' + '' // CID
	        + ';' + oJustificativa.getValue(); // justificativa
	
	    // Define Header para atualização Odata
	    oFile.destroyHeaderParameters();
	    oFile.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({
	      name: "x-csrf-token",
	      value: oModel.getSecurityToken()
	    }));
	    oFile.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({
	      name: "slug",
	      value: sKey
	    }));
	    oFile.upload();

     };

  },

  Files_Show: function(vDate, vAwart, vName) {
    
    var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oModel = new sap.ui.model.odata.ODataModel(vURL);
    oModel.setCountSupported(false);
    var skey = {};
    sKey = "/FileSet(Pernr='" + oPernr.getText() + "',Data=datetime'" + vDate + "',Awart='" + vAwart + "',Filename='" + vName + "')/$value";

    oModel.read(sKey, null, null, true, function(oData, oResponse) {
      var sUrl = oResponse.requestUri;
      window.open(sUrl);
    }, function() {
      alert("Arquivo não Encontrado");
    });

  },

  Files_Delete: function(vDate, vAwart, vLine) {
    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oData.setCountSupported(false);

    oData.remove(vLine.getBindingContext().getPath(), null, function(oSuccess) {
      sap.m.MessageToast.show('Arquivo Removido');

      var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');

      var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV';
      var oData = new sap.ui.model.odata.ODataModel(vURL);
      oData.setCountSupported(false);

      var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), new sap.ui.model.Filter('Data',
      sap.ui.model.FilterOperator.EQ, vDate), new sap.ui.model.Filter('Awart', sap.ui.model.FilterOperator.EQ, vAwart), ];

      sap.ui.getCore().byId('idTabFile').bindAggregation("items", '/FileSet', sap.ui.getCore().byId('idRowFile'), null, oFilter);

    }, function(oErro) {
      var sMessage = $(oErro.response.body).find('message').first().text();
      sap.m.MessageToast.show(sMessage);
    });
  },

  // ================================================================================
  // Opção Aprovação Horas Extras
  // ================================================================================
  Aprov_HE: function(oEvent) {

    oSel = oEvent.getSource().getBindingContext().getObject();

    oDialogHe = new sap.m.Dialog('DialogHEAba1', {
      title: 'Aprovação Horas Extras',
      showHeader: true,
      type: sap.m.DialogType.Standard,
      contentWidth: '50%',
      contentHeight: '70%',
      content: [new sap.m.DateTimeInput('idDataLocal', {
        visible: false,
        displayFormat: 'HH:mm',
        type: "Time",
        valueFormat: "PTHH'H'mm'M'ss'S'",
        value: oSel.Datum
      }), new sap.m.ObjectHeader({
        title: 'Aprovação Horas Extras',
        responsive: true,
        intro: sap.ui.getCore().byId('idmain').byId('idNome').getText(),
      })],
      buttons: [new sap.m.Button({
        text: "Sair",
        type: sap.m.ButtonType.Default,
        press: function() {
          oDialogHe.close();
        }
      })],
      afterClose: function() {
        oTable.destroy();
        oTemplate.destroy();
        oDialogHe.destroy();
      }
    })

    var oTable = new sap.m.Table('TableAprovHEAba1', {
      mode: sap.m.ListMode.None,
      width: "100%",
      enableBusyIndicator: true,
      columns: [new sap.m.Column({
        hAlign: "Center",
        width: "22%",
        header: new sap.m.Label({
          text: "Data"
        }),
      }), new sap.m.Column({
        hAlign: "Center",
        width: "22%",
        header: new sap.m.Label({
          text: "Período"
        })
      }), new sap.m.Column({
        hAlign: "Center",
        width: "22%",
        header: new sap.m.Label({
          text: "Aprovação"
        })
      }), new sap.m.Column({
        hAlign: "Center",
        width: "16%",
        header: new sap.m.Label({
          text: "Dia Anterior"
        })
      }), new sap.m.Column({
        width: "6%",
      }), new sap.m.Column({
        width: "6%",
      }), new sap.m.Column({
        width: "6%",
      }), ]
    })

    var oTemplate = new sap.m.ColumnListItem('TemplateAprovHEAba1', {
      cells: [new sap.m.Label({
        textAlign: "Center",
        text: {
          path: "Data",
          formatter: function(value) {
            return value.substring(8, 10) + '/' + value.substring(5, 7) + '/' + value.substring(0, 4);
          }
        },
      }), new sap.m.Label({
        text: "{Realizadas}",
      }), new sap.m.Label({
        text: "{AutorizadasDescr}",
      }), new sap.m.Label({
        text: {
          path: "Vtken",
          formatter: function(value) {
            if (value == 'X') {
              return 'Sim';
            } else {
              return 'Não';
            }
          }
        },
      }), new sap.m.Button({
        enabled: {
          path: 'AutorizadasDescr',
          formatter: function(value) {
            if (value == "") {
              return true;
            } else {
              return false;
            }
          },
        },
        type: sap.m.ButtonType.Transparent,
        icon: sap.ui.core.IconPool.getIconURI('sys-add'),
        tooltip: 'Aprovar HE',
        press: [sap.ui.controller("zhr_br_time_freq.DIVERG.Divergencia").eDialogInsert]
      }), new sap.m.Button({
        enabled: {
          path: 'AutorizadasDescr',
          formatter: function(value) {
            if (value == "") {
              return false;
            } else {
              return true;
            }
          },
        },
        type: sap.m.ButtonType.Transparent,
        icon: sap.ui.core.IconPool.getIconURI('edit'),
        tooltip: 'Editar',
        press: [sap.ui.controller("zhr_br_time_freq.DIVERG.Divergencia").eDialogEdit]
      }), new sap.m.Button({
        enabled: {
          path: 'AutorizadasDescr',
          formatter: function(value) {
            if (value == "") {
              return false;
            } else {
              return true;
            }
          },
        },
        visible: '{IDGestConfTable>/Insert}',
        type: sap.m.ButtonType.Transparent,
        icon: sap.ui.core.IconPool.getIconURI('delete'),
        tooltip: 'Excluir',
        press: [sap.ui.controller("zhr_br_time_freq.DIVERG.Divergencia").eConfDelete]
      })

      ]
    });

    // Leitura de Dados
    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oTable.setModel(oData);
    var filter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oSel.Pernr), new sap.ui.model.Filter('Data', sap.ui.model.FilterOperator.BT, oSel.Datum, oSel.Datum)];
    oTable.bindAggregation("items", '/ApprovalOvertimeSet', oTemplate, null, filter);

    oDialogHe.addContent(oTable);
    oDialogHe.open();

  },

  // ================================================================================
  // Dialogo de Confirmação - Exclusão Horas Extras
  // ================================================================================
  eConfDelete: function(oEvent) {

    var oParent = oEvent.getSource().getParent();

    var oDialogConfDelete = new sap.m.Dialog('IDConfDelete', {
      title: 'Confirmação',
      content: [new sap.m.Text({
        text: "Deseja excluir autorização?"
      })],
      // Bot�o Confirmar
      buttons: [new sap.m.Button({
        text: "Confirmar",
        type: sap.m.ButtonType.Accept,
        press: function() {
          sap.ui.getCore().byId("idDive").getController().DeleteApproval(oParent);
        }
      }),
      // Bot�o Cancelar
      new sap.m.Button({
        text: "Cancelar",
        type: sap.m.ButtonType.Default,
        press: function() {
          oDialogConfDelete.close();
        }
      })],
      afterClose: function() {
        oDialogConfDelete.destroy();
      }
    })

    oDialogConfDelete.open();

  },

  // ================================================================================
  // Dialogo de Confirmação - Inclusão Horas Extras
  // ================================================================================
  eConfInsert: function(oEvent) {

    var sData = sap.ui.getCore().byId('idDate').getValue();
    var sBegtime = sap.ui.getCore().byId('idBegTime').getValue();
    var sEndtime = sap.ui.getCore().byId('idEndTime').getValue();

    if (sData == '' || sBegtime == '' || sEndtime == '') {
      jQuery.sap.require("sap.m.MessageBox");
      sap.m.MessageBox.show('Preencher Todos os Campos', sap.m.MessageBox.Icon.ERROR, "Mensagem de Erro");
    } else {

      var oDialogConfInsert = new sap.m.Dialog('IDConfInsert', {
        title: 'Confirmação',
        content: [new sap.m.Text({
          text: "Deseja incluir autorização?"
        })],
        // Botão Confirmar
        buttons: [new sap.m.Button({
          text: "Confirmar",
          type: sap.m.ButtonType.Accept,
          press: function() {
            sap.ui.getCore().byId("idDive").getController().AddApproval();
          }
        }),
        // Botão Cancelar
        new sap.m.Button({
          text: "Cancelar",
          type: sap.m.ButtonType.Default,
          press: function() {
            oDialogConfInsert.close();
          }
        })],
        afterClose: function() {
          oDialogConfInsert.destroy();
        }
      })

      oDialogConfInsert.open();

    }

  },

  // ================================================================================
  // Dialogo de Confirmação - Edição Horas Extras
  // ================================================================================
  eConfEdit: function(oParent) {

    var sData = oParent.getBindingContext().getProperty("Data");
    var sBegtime = oParent.getBindingContext().getProperty("Begtime");
    var sEndtime = oParent.getBindingContext().getProperty("Endtime");

    if (sData == '' || sBegtime == '' || sEndtime == '') {
      jQuery.sap.require("sap.m.MessageBox");
      sap.m.MessageBox.show('Preencher Todos os Campos', sap.m.MessageBox.Icon.ERROR, "Mensagem de Erro");
    } else {

      var oDialogConfEdit = new sap.m.Dialog('IDConfEdit', {
        title: 'Confirmação',
        content: [new sap.m.Text({
          text: "Deseja modificar autorização?"
        })],
        // Botão Confirmar
        buttons: [new sap.m.Button({
          text: "Confirmar",
          type: sap.m.ButtonType.Accept,
          press: function() {
            sap.ui.getCore().byId("idDive").getController().EditApproval(oParent);
          }
        }),
        // Botão Cancelar
        new sap.m.Button({
          text: "Cancelar",
          type: sap.m.ButtonType.Default,
          press: function() {
            oDialogConfEdit.close();
          }
        })],
        afterClose: function() {
          oDialogConfEdit.destroy();
        }
      })

      oDialogConfEdit.open();

    }

  },

  // ================================================================================
  // Dialogo de Inclusão Horas Extras
  // ================================================================================
  eDialogInsert: function(oEvent) {

    var oParent = oEvent.getSource().getBindingContext().getObject();

    oDialogInsert = new sap.m.Dialog('IDDialogInsert', {
      title: 'Autorização Horas Extras',
      showHeader: true,
      type: sap.m.DialogType.Standard,
      contentWidth: '50%',
      contentHeight: '25%',
      content: [new sap.m.ObjectHeader({
        title: 'Autorização Horas Extras',
        responsive: true,
        intro: sap.ui.getCore().byId('idmain').byId('idNome').getText(),
      })],
      buttons: [new sap.m.Button({
        text: "Inserir",
        type: sap.m.ButtonType.Accept,
        press: function() {
          sap.ui.getCore().byId("idDive").getController().eConfInsert();
        }
      }), new sap.m.Button({
        text: "Cancelar",
        type: sap.m.ButtonType.Default,
        press: function() {
          oDialogInsert.close();
        }
      })],
      afterClose: function() {
        oDialogInsert.destroy();
      }
    })

    var oLayout = new sap.ui.commons.layout.MatrixLayout({
      width: "100%",
      height: "40px",
      columns: 7,
      widths: ["10%", "20%", "25%", "15%", "20%", "5%", "20%"],
    })
    oLayout.createRow(new sap.m.Label({
      text: "Data:"
    }), new sap.m.DateTimeInput('idDate', {
      displayFormat: 'dd/MM/yyyy',
      valueFormat: "yyyy-MM-dd'T00:00:00'",
      editable: false,
      value: oParent.Data
    }), new sap.m.CheckBox('idVtken', {
      editable: false,
      text: 'Dia Anterior',
    }), new sap.m.Label({
      text: "Horário Início:"
    }), new sap.m.DateTimeInput('idBegTime', {
      displayFormat: 'HH:mm',
      type: "Time",
      valueFormat: "PTHH'H'mm'M'ss'S'",
      value: oParent.RealizadasBegtime
    }), new sap.m.Label({
      text: "até"
    }), new sap.m.DateTimeInput('idEndTime', {
      displayFormat: 'HH:mm',
      type: "Time",
      valueFormat: "PTHH'H'mm'M'ss'S'",
      value: oParent.RealizadasEndtime
    }))

    // Dia Anterior
    if (oParent.Vtken == 'X') {
      sap.ui.getCore().byId('idVtken').setSelected(true);
    } else {
      sap.ui.getCore().byId('idVtken').setSelected(false);
    }

    oDialogInsert.addContent(oLayout);
    oDialogInsert.open();

  },

  // ================================================================================
  // Dialogo de Edição Horas Extras
  // ================================================================================
  eDialogEdit: function(oEvent) {

    var oParent = oEvent.getSource().getParent();

    oDialogEdit = new sap.m.Dialog('IDDialogEdit', {
      title: 'Autorização Horas Extras',
      showHeader: true,
      type: sap.m.DialogType.Standard,
      contentWidth: '50%',
      contentHeight: '25%',
      content: [new sap.m.ObjectHeader({
        title: 'Autorização Horas Extras',
        responsive: true,
        intro: sap.ui.getCore().byId('idmain').byId('idNome').getText(),
      })],
      buttons: [new sap.m.Button({
        text: "Modificar",
        type: sap.m.ButtonType.Accept,
        press: function() {
          sap.ui.getCore().byId("idDive").getController().eConfEdit(oParent);
        }
      }), new sap.m.Button({
        text: "Cancelar",
        type: sap.m.ButtonType.Default,
        press: function() {
          oDialogEdit.close();
        }
      })],
      afterClose: function() {
        oDialogEdit.destroy();
      }
    })

    var oLayout = new sap.ui.commons.layout.MatrixLayout({
      width: "100%",
      height: "40px",
      columns: 7,
      widths: ["10%", "20%", "25%", "15%", "20%", "5%", "20%"],
    })
    oLayout.createRow(new sap.m.Label({
      text: "Data:"
    }), new sap.m.DateTimeInput('idDate', {
      displayFormat: 'dd/MM/yyyy',
      valueFormat: "yyyy-MM-dd'T00:00:00'",
      editable: false,
      value: oParent.getBindingContext().getProperty("Data")
    }), new sap.m.CheckBox('idVtken', {
      editable: false,
      text: 'Dia Anterior',
    }), new sap.m.Label({
      text: "Horário Início:"
    }), new sap.m.DateTimeInput('idBegTime', {
      displayFormat: 'HH:mm',
      type: "Time",
      valueFormat: "PTHH'H'mm'M'ss'S'",
      value: oParent.getBindingContext().getProperty("Begtime")
    }), new sap.m.Label({
      text: "até"
    }), new sap.m.DateTimeInput('idEndTime', {
      displayFormat: 'HH:mm',
      type: "Time",
      valueFormat: "PTHH'H'mm'M'ss'S'",
      value: oParent.getBindingContext().getProperty("Endtime")
    }))

    // Dia Anterior
    if (oParent.getBindingContext().getProperty("Vtken") == 'X') {
      sap.ui.getCore().byId('idVtken').setSelected(true);
    } else {
      sap.ui.getCore().byId('idVtken').setSelected(false);
    }

    oDialogEdit.addContent(oLayout);
    oDialogEdit.open();

  },

  // ================================================================================
  // Novo Registro Aprovações
  // ================================================================================
  AddApproval: function() {

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oData.setCountSupported(false);
    var oEntry = {};
    oEntry.Pernr = sap.ui.getCore().byId('idmain').byId('idPernr').getText();
    oEntry.Data = sap.ui.getCore().byId('idDate').getValue();
    oEntry.Begtime = sap.ui.getCore().byId('idBegTime').getValue();
    oEntry.Endtime = sap.ui.getCore().byId('idEndTime').getValue();

    // Marcação Dia Anterior
    if (sap.ui.getCore().byId('idVtken').getSelected() == true) {
      oEntry.Vtken = 'X';
    }

    oData.create("/ApprovalOvertimeSet", oEntry, null, function(oSuccess) {
      jQuery.sap.require("sap.m.MessageBox");
      sap.m.MessageBox.show("Horas Extras Autorizadas", sap.m.MessageBox.Icon.SUCCESS);
      var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
      oData.read("/PeriodsSet('" + oPeriodo.getSelectedKey() + "')", null, null, false, function(oDataSuccess) {
        var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
        var oTable = sap.ui.getCore().byId('TableAprovHEAba1');
        // Atualiza Time
        var oCreate = {};
        oCreate.Pernr = oPernr.getText();
        oCreate.Mmaaaa = oPeriodo.getSelectedKey();
        oData.create("/EmployedSet", oCreate, null, null, null);
        // Atualiza Tela
        var oTemplate = sap.ui.getCore().byId('TemplateAprovHEAba1');
        var filter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), new sap.ui.model.Filter('Data',
         sap.ui.model.FilterOperator.BT, sap.ui.getCore().byId('idDataLocal').getValue(),
 sap.ui.getCore().byId('idDataLocal').ge+
tValue())];
        oTable.bindAggregation("items", "/ApprovalOvertimeSet", oTemplate, null, filter);
        // Fecha Dialogo
        sap.ui.getCore().byId('IDConfInsert').close(oData);
        sap.ui.getCore().byId('IDDialogInsert').close(oData);

        // Atualiza
        // Banco de
        // Horas
        var oTable = sap.ui.getCore().byId("ListBancoHoras");
        var oTemplate = sap.ui.getCore().byId("ColumnListBancoHoras");
        var filter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, oDataSuccess.Begda), new sap.ui.model.Filter('Endda',
 sap.ui.model.FilterOperator.EQ, o+
DataSuccess.Endda)];
        oTable.bindAggregation("items", '/BancoHorasSet', oTemplate, null, filter);

        // Atualiza
        // Divergência
        sap.ui.controller("zhr_br_time_freq.DIVERG.Divergencia").get_Divergence_Data(oPernr, oPeriodo);

      })

    }, function(error) {
      var message = $(error.response.body).find('message').first().text();
      jQuery.sap.require("sap.m.MessageBox");
      sap.m.MessageBox.show(message, sap.m.MessageBox.Icon.ERROR, "Mensagem de Erro");
      sap.ui.getCore().byId('IDConfInsert').close(oData);
    });

  },

  // ================================================================================
  // Edição Aprovações
  // ================================================================================
  EditApproval: function(oParent) {

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    var sPernr = oParent.getBindingContext().getProperty("Pernr");
    var sData = oParent.getBindingContext().getProperty("Data");
    var sBegtime = oParent.getBindingContext().getProperty("Begtime");
    var sEndtime = oParent.getBindingContext().getProperty("Endtime");
    var sRealizada = oParent.getBindingContext().getProperty("Realizadas");
    var skey = "/ApprovalOvertimeSet(Pernr='" + sPernr + "',Data=datetime'" + sData + "',Begtime=time'" + sBegtime + "',Endtime=time'" + sEndtime + "',Realizadas='" + sRealizada + "')";

    var oEntry = {};
    oEntry.Pernr = sap.ui.getCore().byId('idmain').byId('idPernr').getText();
    oEntry.Data = sap.ui.getCore().byId('idDate').getValue();
    oEntry.Begtime = sap.ui.getCore().byId('idBegTime').getValue();
    oEntry.Endtime = sap.ui.getCore().byId('idEndTime').getValue();
    // Marcação Dia Anterior
    oEntry.Vtken = oParent.getBindingContext().getProperty("Vtken");

    oData.setCountSupported(false);
    oData.update(skey, oEntry, null, function(oSuccess) { // Sucesso
      var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
      oData.read("/PeriodsSet('" + oPeriodo.getSelectedKey() + "')", null, null, false, function(oDataSuccess) {
        var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
        // Atualiza Time
        var oCreate = {};
        oCreate.Pernr = oPernr.getText();
        oCreate.Mmaaaa = oPeriodo.getSelectedKey();
        oData.create("/EmployedSet", oCreate, null, null, null);
        // Atualiza Tela
        var oTable = sap.ui.getCore().byId('TableAprovHEAba1');
        var oTemplate = sap.ui.getCore().byId('TemplateAprovHEAba1');
        jQuery.sap.require("sap.m.MessageBox");
        sap.m.MessageBox.show("Autorização Alterada", sap.m.MessageBox.Icon.SUCCESS);
        // Atualiza��o
        // List de
        // Programa��o
        var filter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), new sap.ui.model.Filter('Data', sap.ui.model.FilterOperator.BT, sap.ui.getCore().byId('idDataLocal').getValue(),
 sap.ui.getCore().byId('idDataLocal').ge+
tValue())];
        oTable.bindAggregation("items", '/ApprovalOvertimeSet', oTemplate, null, filter);
        // Fecha Dialogo
        sap.ui.getCore().byId('IDConfEdit').close(oData);
        sap.ui.getCore().byId('IDDialogEdit').close(oData);
        // Atualiza
        // Banco de
        // Horas
        var oTable = sap.ui.getCore().byId("ListBancoHoras");
        var oTemplate = sap.ui.getCore().byId("ColumnListBancoHoras");
        var filter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, oDataSuccess.Begda), new sap.ui.model.Filter('Endda',
 sap.ui.model.FilterOperator.EQ, o+
DataSuccess.Begda)];
        oTable.bindAggregation("items", '/BancoHorasSet', oTemplate, null, filter);

        // Atualiza
        // Divergência
        sap.ui.controller("zhr_br_time_freq.DIVERG.Divergencia").get_Divergence_Data(oPernr, oPeriodo);
      })
    }, function(error) {
      var sMessage = $(error.response.body).find('message').first().text();
      jQuery.sap.require("sap.m.MessageBox");
      sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.ERROR, "Mensagem de Erro");
    });

  },

  // ================================================================================
  // Apaga Aprovação
  // ================================================================================
  DeleteApproval: function(oParent) {

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    var sPernr = oParent.getBindingContext().getProperty("Pernr");
    var sData = oParent.getBindingContext().getProperty("Data");
    var sBegtime = oParent.getBindingContext().getProperty("Begtime");
    var sEndtime = oParent.getBindingContext().getProperty("Endtime");
    var sRealizada = oParent.getBindingContext().getProperty("Realizadas");
    var skey = "/ApprovalOvertimeSet(Pernr='" + sPernr + "',Data=datetime'" + sData + "',Begtime=time'" + sBegtime + "',Endtime=time'" + sEndtime + "',Realizadas='" + sRealizada + "')";

    oData.setCountSupported(false);
    oData.remove(skey, null, function(oSuccess) { // Sucesso
      var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
      oData.read("/PeriodsSet('" + oPeriodo.getSelectedKey() + "')", null, null, false, function(oDataSuccess) {
        var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
        // Atualiza Time
        var oCreate = {};
        oCreate.Pernr = oPernr.getText();
        oCreate.Mmaaaa = oPeriodo.getSelectedKey();
        oData.create("/EmployedSet", oCreate, null, null, null);
        // Atualiza Tela
        var oTable = sap.ui.getCore().byId('TableAprovHEAba1');
        var oTemplate = sap.ui.getCore().byId('TemplateAprovHEAba1');
        jQuery.sap.require("sap.m.MessageBox");
        sap.m.MessageBox.show("Autorização Excluida", sap.m.MessageBox.Icon.SUCCESS);
        // Atualização
        // List de
        // Programação
        var filter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), new sap.ui.model.Filter('Data', sap.ui.model.FilterOperator.BT, sap.ui.getCore().byId('idDataLocal').getValue(),
 sap.ui.getCore().byId('idDataLocal').ge+
tValue())];
        // sap.ui.getCore().byId('idDataLocal').Destroy();
        oTable.bindAggregation("items", '/ApprovalOvertimeSet', oTemplate, null, filter);
        sap.ui.getCore().byId("IDConfDelete").close();
        // Atualiza
        // Banco de
        // Horas
        var oTable = sap.ui.getCore().byId("ListBancoHoras");
        var oTemplate = sap.ui.getCore().byId("ColumnListBancoHoras");
        var filter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, oDataSuccess.Begda), new sap.ui.model.Filter('Endda',
 sap.ui.model.FilterOperator.EQ, o+
DataSuccess.Endda)];
        oTable.bindAggregation("items", '/BancoHorasSet', oTemplate, null, filter);

        // Atualiza
        // Divergência
        sap.ui.controller("zhr_br_time_freq.DIVERG.Divergencia").get_Divergence_Data(oPernr, oPeriodo);

      })
    }, function(error) {
      var sMessage = $(error.response.body).find('message').first().text();
      jQuery.sap.require("sap.m.MessageBox");
      sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.ERROR, "Mensagem de Erro");
    });

  },

});