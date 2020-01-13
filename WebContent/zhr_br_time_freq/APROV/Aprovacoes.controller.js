var oLine = null;
sap.ui.controller("zhr_br_time_freq.APROV.Aprovacoes", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zhr_br_time_freq.APROV.Aprovacoes
*/
  onInit: function() {

    var that = this;
    this.oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/");

      var oView = this.getView();
      oView.setModel(new sap.ui.model.json.JSONModel({
        globalFilter: "",
      }), "ui");

      this._oGlobalFilter = null;

    this.oModel.read("/AprovarSet",{
      success: function(oData){
        
        var json = new sap.ui.model.json.JSONModel(oData, "Aprovar");
        var oTable = sap.ui.getCore().byId("TabAprov");
        var oTemp  = sap.ui.getCore().byId("TempAprov");
        var oTitle = sap.ui.getCore().byId("tabTitle");

        that.getView().setModel(json);

        oTitle.setText('Solicitações aguardando aprovação (' + oData.results.length + ")");
        oTable.bindAggregation(
          "items", {
          path: "/results",
          template: oTemp
        });

      },
      error: function(oError){
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.show($(oError.response.body).find('message').first().text(), {
			title: 'Erro',
			icon: sap.m.MessageBox.Icon.ERROR
		});
      }
    })

  },

  onPress: function(oEvent) {

    if(oEvent.getSource().getParent().getBindingContext() != undefined){
      oLine = parseInt(oEvent.getSource().getParent().getBindingContext().sPath.split('/')[2]);
    }
    
    var split = oEvent.getSource().sId.split("-")[0];

    switch (split) {
    case "singleApproval":
    //  oConfirm.setId("singleConfirm");
    
     var that = this;
     debugger
     var oValues = oEvent.getSource().getParent().oBindingContexts.undefined.getModel().getData().results
                      [oEvent.getSource().getParent().oBindingContexts.undefined.sPath.split('/')[2]];
    	
      this.showPopup("Aprovar requisição", // POPUP TITLE
               new sap.m.Text({text: oValues.Descr + ", Aprovar requisição?" }), // POPUP MSG
               [ new sap.m.Button({text:"Aprovar", type: sap.m.ButtonType.Accept, press: this.onPress}),
                 new sap.m.Button({text:"Cancelar", type: sap.m.ButtonType.Reject, press: this.onPress})] // POPUP BUTTONS
      );
      break;
    case "massApprovals":
    	debugger
  //    oConfirm.setId("massConfirm");
      this.showPopup("Aprovar requisições", // POPUP TITLE
             new sap.m.Text({text: "Aprovar todas as requisições selecionadas?"}), // POPUP MSG
             [ new sap.m.Button({text:"Aprovar", type: sap.m.ButtonType.Accept, press: this.onPress}),
               new sap.m.Button({text:"Cancelar", type: sap.m.ButtonType.Reject, press: this.onPress})] // POPUP BUTTONS
        );
      break;
    case "singleReject":
  //    oConfirm.setId("singleReject");
      oVert = new sap.ui.layout.VerticalLayout({width:"300px"});
      oVert.addContent(new sap.m.Label({text:"Informar justificativa:", required: true}));
      oVert.addContent(new sap.m.TextArea({rows: 4, width: "300px", liveChange: this.onLiveChange }));
      this.showPopup("Reprovar requisição", // POPUP TITLE
                 [oVert], // POPUP MSG
               [ new sap.m.Button({text:"Reprovar", enabled: false, type: sap.m.ButtonType.Accept, press: this.onPress}),
                 new sap.m.Button({text:"Cancelar", type: sap.m.ButtonType.Reject, press: this.onPress})] // POPUP BUTTONS
        );
      break;
    default:


      if(oEvent.getSource().getProperty("text") == "Aprovar"){
        oEvent.getSource().getParent().destroy();
        sap.ui.controller("zhr_br_time_freq.APROV.Aprovacoes").setAprovarReprovar(oLine, "Aprovar");
      } else if (oEvent.getSource().getProperty("text") == "Reprovar") {
        var texto = oEvent.getSource().getParent().mAggregations.content[0].mAggregations.content[1].getValue();
        oEvent.getSource().getParent().destroy();
        sap.ui.controller("zhr_br_time_freq.APROV.Aprovacoes").setAprovarReprovar(oLine, "Reprovar", texto );
      } else if(oEvent.getSource().getProperty("text") == "Cancelar"){
        oEvent.getSource().getParent().destroy();
      }

      break;
    }

    that = this;

  },
    filterGlobally : function(oEvent) {
    debugger;
    var sQuery = oEvent.getParameter("query");
    this._oGlobalFilter = null;
    this._oGlobalFilter = new sap.ui.model.Filter([  new sap.ui.model.Filter("Title",
                                                                sap.ui.model.FilterOperator.Contains,
                                                                sQuery) ], false);

        oFilter = new sap.ui.model.Filter([this._oGlobalFilter], true);

        var oTable = sap.ui.getCore().byId("TabAprov");
        oTable.getBinding("items").filter(oFilter, "Application");


    },
    
    get_Aprovacoes_Data: function(oPernr, oPeriodo) {

        var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
        var oData = new sap.ui.model.odata.ODataModel(vURL);
        oData.setCountSupported(false);

        oData.read("/AprovarSet",{
          success: function(oData){
            
            var json = new sap.ui.model.json.JSONModel(oData, "Aprovar");
            var oTable = sap.ui.getCore().byId("TabAprov");
            var oTemp  = sap.ui.getCore().byId("TempAprov");
            var oTitle = sap.ui.getCore().byId("tabTitle");

            that.getView().setModel(json);

            oTitle.setText('Solicitações aguardando aprovação (' + oData.results.length + ")");
            oTable.bindAggregation(
              "items", {
              path: "/results",
              template: oTemp
            });

          },
          error: function(oError){
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.show($(oError.response.body).find('message').first().text(), {
				title: 'Erro',
				icon: sap.m.MessageBox.Icon.ERROR
			});
          }
        })
    },

  onLiveChange: function(oEvent) {
    debugger
    if(oEvent.getSource().getValue() != "" ){
      oEvent.getSource().getParent().getParent().mAggregations.buttons[0].setEnabled(true);
    } else{
      oEvent.getSource().getParent().getParent().mAggregations.buttons[0].setEnabled(false);
    }
  },

  setAprovarReprovar: function(line, oEvent, texto) {

    this.oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/");
    var oData = {};
    debugger
    
//  Aprovação em massa
    if (line == null) {
    	var cont;
        var oTable = sap.ui.getCore().byId('TabAprov');
        var lSelected = oTable.getSelectedItems();
          for(var i=0; i<lSelected.length; i++){
              oData = sap.ui.getCore().byId('TabAprov').getParent().getModel().getData().results[i];
              delete oData.__metadata;
              
          this.oModel.update("/AprovarSet(Mandt='" + oData.Mandt + "',Pernr='" + oData.Pernr + "',Infty='" + oData.Infty + "',Subty='" + oData.Subty + "')", oData, {
          success: function(){
            debugger
            var msg = null;
            if(oData.Approv == "true"){
              msg = "Requisição aprovada com sucesso";
            } else {
              msg = "Requisição reprovada com sucesso";
            }
            
            cont = cont++;
            if(cont == lSelected){
            jQuery.sap.require("sap.m.MessageBox");
            sap.m.MessageBox.success(
             msg, {
                icon: sap.m.MessageBox.Icon.SUCCESS,
                title: "Sucesso",
                onClose: function(oEvent){
                  location.reload();
                }});
            }
            
 
            debugger
          },
          error: function(error){
            debugger
          }
        });
              
    }
    
    } else {
      oData = sap.ui.getCore().byId('TabAprov').getParent().getModel().getData().results[line];
      delete oData.__metadata;	    		
	}
    
//    oData = sap.ui.getCore().byId('TabAprov').getParent().getModel().getData().results[line];
//    delete oData.__metadata;

    if(oEvent == "Aprovar") {
      oData.Approv = "true";
    } else{
      oData.Reprov = "true";
      oData.Texto = texto;
    }

    this.oModel.update("/AprovarSet(Mandt='" + oData.Mandt + "',Pernr='" + oData.Pernr + "',Infty='" + oData.Infty + "',Subty='" + oData.Subty + "')", oData, {
      success: function(){
        debugger
        var msg = null;
        if(oData.Approv == "true"){
          msg = "Requisição aprovada com sucesso";
        } else {
          msg = "Requisição reprovada com sucesso";
        }

        jQuery.sap.require("sap.m.MessageBox");
           sap.m.MessageBox.success(
            msg, {
               icon: sap.m.MessageBox.Icon.SUCCESS,
               title: "Sucesso",
               onClose: function(oEvent){
                 location.reload();
               }});

        debugger
      },
      error: function(error){
        debugger
      }
    });

  },

  showPopup: function(p_title, p_content, p_buttons) {

      var oDialog = new sap.m.Dialog({
          contentWidth: "250px",
          contentHeight: '200px',
          resizable: true,
          title: p_title,
          content: [p_content],
          buttons: [p_buttons],
        });
      
      oDialog.open();

  },

  showAttach: function(oEvent) {

    var that = this;
    debugger
    var oValues = oEvent.getSource().getParent().oBindingContexts.undefined.getModel().getData().results
      [oEvent.getSource().getParent().oBindingContexts.undefined.sPath.split('/')[2]];

    var oDialog = new sap.m.Dialog({
    contentWidth: "50%",
    contentHeight: 'auto',
    resizable: true,
    draggable : true, // boolean, since 1.30
    title: oValues.Title,
    //content: [p_content],
    buttons: [new sap.m.Button({type: sap.m.ButtonType.Transparent, text:"Fechar", press: function(oEvent){
      oEvent.getSource().getParent().destroy();
    }})],
    });

    //var oPanel = new sap.m.Panel();
    var aprov = null;
    var date  = null;
    this.oVert = new sap.ui.layout.VerticalLayout({id:"oVert"});
    this.oVert.addContent(new sap.m.Label({text: "Descrição: "}));
    this.oVert.addContent(new sap.m.Text({text: oValues.Descr }));
    this.oVert.addContent(new sap.m.Label());
    this.oVert.addContent(new sap.m.Label({text: "Criado por: "}));
    this.oVert.addContent(new sap.m.Text({text: oValues.CreateCname + " (" + oValues.CreateUname + ")" }));
    this.oVert.addContent(new sap.m.Label());
    this.oVert.addContent(new sap.m.Label({text: "Criado em: "}));
    this.oVert.addContent(new sap.m.Text({text: + oValues.CreateErdat.substr(8,2) + "."
                         + oValues.CreateErdat.substr(5,2) + "."
                         + oValues.CreateErdat.substr(0,4) + " / "
                         + oValues.CreateErtim.substr(2,2) + ":"
                         + oValues.CreateErtim.substr(5,2)
    }));

    if(oValues.Apprv1Cname != ""){
      this.oVert.addContent(new sap.m.Label());
      aprov = oValues.Apprv1Cname + " (" + oValues.Apprv1Uname + ")";
    if(oValues.Apprv1Erdat != null) {
    date  = oValues.Apprv1Erdat.substr(8,2) + "."
      + oValues.Apprv1Erdat.substr(5,2) + "."
      + oValues.Apprv1Erdat.substr(0,4) + " / "
      + oValues.Apprv1Ertim.substr(2,2) + ":"
      + oValues.Apprv1Ertim.substr(5,2);
    }
    }
    if(oValues.Apprv2Uname != ""){
    aprov = oValues.Apprv2Cname + " (" + oValues.Apprv2Uname + ")";
    if(oValues.Apprv2Erdat != null ){
    date  = oValues.Apprv2Erdat.substr(8,2) + "."
        + oValues.Apprv2Erdat.substr(5,2) + "."
        + oValues.Apprv2Erdat.substr(0,4) + " / "
          + oValues.Apprv2Ertim.substr(2,2) + ":"
          + oValues.Apprv2Ertim.substr(5,2);
    }
    }
    if(oValues.Apprv3Uname != ""){
    aprov = oValues.Apprv3Cname + " (" + oValues.Apprv3Uname + ")";
    if(oValues.Apprv3Erdat != null) {
    date  = oValues.Apprv3Erdat.substr(8,2) + "."
        + oValues.Apprv3Erdat.substr(5,2) + "."
        + oValues.Apprv3Erdat.substr(0,4) + " / "
          + oValues.Apprv3Ertim.substr(2,2) + ":"
          + oValues.Apprv3Ertim.substr(5,2)
    }
    }
    if(aprov != null) { 
      this.oVert.addContent(new sap.m.Label({text: "Última modificação por: "}));
      this.oVert.addContent(new sap.m.Text({text: aprov}));
    }

    if(date != null){
      this.oVert.addContent(new sap.m.Label());
      this.oVert.addContent(new sap.m.Label({text: "Última modificação em: "}));
      this.oVert.addContent(new sap.m.Text({text: date }));
    }

    if(oValues.Texto != ""){
      this.oVert.addContent(new sap.m.Label());
      this.oVert.addContent(new sap.m.Label({text: "Justificativa: "}));          
      this.oVert.addContent(new sap.m.Text({width:"auto", text: oValues.Texto}));        
    }


        var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oValues.Pernr), new sap.ui.model.Filter('Data',
            sap.ui.model.FilterOperator.EQ, oValues.Data), new sap.ui.model.Filter('Awart', sap.ui.model.FilterOperator.EQ, oValues.Subty)];

        this.oModel.read("/FileSet",{
          async: false,
          filters: oFilter,
          success: function(oData){
            debugger
            if(oData.results.length > 0 ) {
        var json = new sap.ui.model.json.JSONModel(oData, 'Anexo');
        sap.ui.getCore().setModel(json);
            sap.ui.getCore().byId("oVert").addContent(new sap.m.Label());
            sap.ui.getCore().byId("oVert").addContent(new sap.m.Label({text:"CID:"}));
            sap.ui.getCore().byId("oVert").addContent(new sap.m.Text({text: oData.results[0].Cid}));
            sap.ui.getCore().byId("oVert").addContent(new sap.m.Label());
            sap.ui.getCore().byId("oVert").addContent(new sap.m.Label({text:"CRM:"}));
            sap.ui.getCore().byId("oVert").addContent(new sap.m.Text({text: oData.results[0].Crm}));
            sap.ui.getCore().byId("oVert").addContent(new sap.m.Label());
            sap.ui.getCore().byId("oVert").addContent(new sap.m.Label({text:"Anexo:"}));
            sap.ui.getCore().byId("oVert").addContent(new sap.m.Link({text : oData.results[0].Filename, // string
          enabled : true, // boolean
          emphasized : false, // boolean, since 1.22
          tooltip : "Visualizar anexo", // sap.ui.core.TooltipBase
          press : [ function(oEvent) {

              var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
              var oModel = new sap.ui.model.odata.ODataModel(vURL);
              oModel.setCountSupported(false);
              var skey = {};
              sKey = "/FileSet(Pernr='" + oEvent.getSource().getModel().getData().results[0].Pernr + "',Data=datetime'" +
              oEvent.getSource().getModel().getData().results[0].Data + "',Awart='" + 
              oEvent.getSource().getModel().getData().results[0].Awart + "',Filename='" +
              oEvent.getSource().getModel().getData().results[0].Filename + "')/$value";

              oModel.read(sKey, null, null, true, function(oData, oResponse) {
                var sUrl = oResponse.requestUri;
                window.open(sUrl);
              }, function() {
                alert("Arquivo não Encontrado");
              });

          }, this ]
          }));
             }

          },
          error: function(error){
            debugger
          }
        });



    oDialog.addContent(this.oVert);
    oDialog.open();

    debugger
    var line = parseInt(oEvent.getSource().getParent().oBindingContexts.undefined.sPath.split('/')[2]);
    var vDate = null;
    var vAwart = null;

    for(var i=0; i<oEvent.getSource().getParent().oBindingContexts.undefined.oModel.oData.results.length; i++){
      if(line == oEvent.getSource().getParent().oBindingContexts.undefined.oModel.oData.results[i]);
      vDate  = oEvent.getSource().getParent().oBindingContexts.undefined.oModel.oData.results[i].Data;
      vAwart = oEvent.getSource().getParent().oBindingContexts.undefined.oModel.oData.results[i].Subty;
    }

//       var oFiles = new sap.m.Table('idTabFile', {
//            columns: [new sap.m.Column({
//              header: new sap.m.Label({
//                text: "Descrição"
//              }),
//              width: '40%'
//            }), ],
//          });
//
//          // Erro de exibição Anexo
//          // if (vCrm == true) {
//          oFiles.addColumn(new sap.m.Column({
//            header: new sap.m.Label({
//              text: "CRM"
//            }),
//            width: '20%'
//          }));
//
//          oFiles.addColumn(new sap.m.Column({
//            header: new sap.m.Label({
//              text: "CID"
//            }),
//            width: '20%'
//          }));
//          // }
//          // ;
//
//          oFiles.addColumn(new sap.m.Column({
//            header: new sap.m.Label({
//              text: ""
//            }),
//            width: '10%'
//          }));
//
//          oFiles.addColumn(new sap.m.Column({
//            header: new sap.m.Label({
//              text: ""
//            }),
//            width: '10%'
//          }));
//
//          var oRowFile = new sap.m.ColumnListItem("idRowFile", {
//            cells: [new sap.m.Label({
//              text: "{Filename}"
//            }), new sap.m.Label({
//              text: "{Crm}"
//            }), new sap.m.Label({
//              text: "{Cid}"
//            }), new sap.m.Button({
//              type: sap.m.ButtonType.Transparent,
//              icon: sap.ui.core.IconPool.getIconURI('vds-file'),
//              enabled: true,
//              visible: true,
//              press: function(oEvent) {
//                sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").Files_Show(vDate, vAwart, this.getParent().getCells()[0].getText());
//              }
//            }), new sap.m.Button({
//              type: sap.m.ButtonType.Transparent,
//              icon: sap.ui.core.IconPool.getIconURI('delete'),
//              enabled: true,
//              visible: true,
//              press: function(oEvent) {
//                sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").Files_Delete(vDate, vAwart, this.getParent());
//              }
//            }), ],
//          });
//          
//      var oVertical    = new sap.ui.layout.VerticalLayout();
//      var oHorizontal1  = new sap.ui.layout.HorizontalLayout();
//      var oHorizontal2  = new sap.ui.layout.HorizontalLayout();
//      var oHorizontal3  = new sap.ui.layout.HorizontalLayout();
//      var oHorizontal4  = new sap.ui.layout.HorizontalLayout();
//      var oHorizontal5  = new sap.ui.layout.HorizontalLayout();
//      
//      oHorizontal1.addContent(new sap.m.Label({text:'Justificativa', width:'90px'}));
//      oHorizontal1.addContent(new sap.m.TextArea({id:"idJustificativa", editable: false, width:'350px', rows: 3}));
//      
//      oVertical.addContent(oHorizontal1);
//
//      var oCell1 = new sap.m.Label({
//        text: 'Arquivo',
//        width:'90px'
////        textAlign: "Center",
////        labelFor: oCell2
//      });
//
//      oHorizontal2.addContent(oCell1);
////      oHorizontal2.addContent(oCell2);
////      oHorizontal2.addContent(oCell3);    
//      oVertical.addContent(oHorizontal2);
//
////      if (vCrm == true) {
//
//        oCell1 = new sap.m.Label({
////        required: true,
//          text: 'CRM',
//          width:'90px'
//        });
//
//        oCell2 = new sap.m.Input({
//            id:'idCRM',
//          enabled: false,  
//          width:'200px'
//        });
//
//        oCell3 = new sap.m.Label({
////          required: true,
//          text: 'CID',
//          width:'90px'        
//        });
//
//        var oCell4 = new sap.m.Input({
//            id:'idCID',
//            enabled: false,           
//          width:'200px'
//        });
//        
//        oHorizontal3.addContent(oCell1);
//        oHorizontal3.addContent(oCell2);  
//        oHorizontal4.addContent(oCell3);        
//        oHorizontal4.addContent(oCell4);  
//        
//        oVertical.addContent(oHorizontal3);
//        oVertical.addContent(oHorizontal4);
////        oMatrix.createRow(oCell1, oCell2, oCell3, oCell4);
//
////      }
//      
//      oVertical.addContent(new sap.m.Label());
//      var oToolBar = new sap.m.Toolbar({height:"13rem"});
//      
//      oToolBar.addContent(oVertical); 
////      oToolBar.addContent(new sap.m.Label());
//      
////      if (vCrm == true) {
////        oToolBar.setHeight('auto');
////      } else {
////        oToolBar.setHeight('auto');
////      };
//
//      oFiles.setHeaderToolbar(oToolBar);
//
//      var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
//
//      var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
//      var oData = new sap.ui.model.odata.ODataModel(vURL);
//      oData.setCountSupported(false);
//
//      var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), new sap.ui.model.Filter('Data',
//       sap.ui.model.FilterOperator.EQ, vDate), new sap.ui.model.Filter('Awart', sap.ui.model.FilterOperator.EQ, vAwart), ];
//
//      oFiles.setModel(oData);
//      oFiles.bindAggregation("items", '/FileSet', oRowFile, null, oFilter);
//
//      var oDialog = new sap.m.Dialog({
//        contentWidth: "auto",
//        contentHeight: 'auto',
//        resizable: true,
//        title: 'Anexos',
//        content: [oFiles],
//        buttons: [
//          
////          new sap.m.Button({
////            type: sap.m.ButtonType.Accept,
////            text: "Salvar",
////              press: function(oEvent) {
////                debugger
////                sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").Files_Create(vCrm, vDate, vAwart);
////              }
////            }),       
//          
//          new sap.m.Button({
//          text: "Fechar",
//          type: sap.m.ButtonType.Reject,
//          press: function() {
//            oDialog.destroy();
//            oFiles.destroy();
//     //       oToolbar.destroy();
////            oRowFile.destroy();
//          }
//        })],
//      });
//
//      oDialog.open();


//    var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
//
//    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
//    var oModel = new sap.ui.model.odata.ODataModel(vURL);
//    oModel.setCountSupported(false);
//    var skey = {};
//    sKey = "/FileSet(Pernr='" + oPernr.getText() + "',Data=datetime'" + vDate + "',Awart='" + vAwart + "',Filename='" + vName + "')/$value";
//
//    oModel.read(sKey, null, null, true, function(oData, oResponse) {
//      var sUrl = oResponse.requestUri;
//      window.open(sUrl);
//    }, function() {
//      alert("Arquivo não Encontrado");
//    });

  },


//    var vCrm = '';
//    var vDate = '';
//    var vAwart = '';
//
//       var oFiles = new sap.m.Table('idTabFile', {
//            columns: [new sap.m.Column({
//              header: new sap.m.Label({
//                text: "Descrição"
//              }),
//              width: '40%'
//            }), ],
//          });
//
//          // Erro de exibição Anexo
//          // if (vCrm == true) {
//          oFiles.addColumn(new sap.m.Column({
//            header: new sap.m.Label({
//              text: "CRM"
//            }),
//            width: '20%'
//          }));
//
//          oFiles.addColumn(new sap.m.Column({
//            header: new sap.m.Label({
//              text: "CID"
//            }),
//            width: '20%'
//          }));
//          // }
//          // ;
//
//          oFiles.addColumn(new sap.m.Column({
//            header: new sap.m.Label({
//              text: ""
//            }),
//            width: '10%'
//          }));
//
//          oFiles.addColumn(new sap.m.Column({
//            header: new sap.m.Label({
//              text: ""
//            }),
//            width: '10%'
//          }));
//
//          var oRowFile = new sap.m.ColumnListItem("idRowFile", {
//            cells: [new sap.m.Label({
//              text: "{Filename}"
//            }), new sap.m.Label({
//              text: "{Crm}"
//            }), new sap.m.Label({
//              text: "{Cid}"
//            }), new sap.m.Button({
//              type: sap.m.ButtonType.Transparent,
//              icon: sap.ui.core.IconPool.getIconURI('vds-file'),
//              enabled: true,
//              visible: true,
//              press: function(oEvent) {
//                sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").Files_Show(vDate, vAwart, this.getParent().getCells()[0].getText());
//              }
//            }), new sap.m.Button({
//              type: sap.m.ButtonType.Transparent,
//              icon: sap.ui.core.IconPool.getIconURI('delete'),
//              enabled: true,
//              visible: true,
//              press: function(oEvent) {
//                sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").Files_Delete(vDate, vAwart, this.getParent());
//              }
//            }), ],
//          });
//
//          var oMatrix = new sap.ui.commons.layout.MatrixLayout({
//            columns: 4,
//            width: "100%",
//            widths: ['70px', '40%', '70px', '40%']
//          });
//          
//          var oVertical    = new sap.ui.layout.VerticalLayout();
//          var oHorizontal1  = new sap.ui.layout.HorizontalLayout();
//          var oHorizontal2  = new sap.ui.layout.HorizontalLayout();
//          var oHorizontal3  = new sap.ui.layout.HorizontalLayout();
//          var oHorizontal4  = new sap.ui.layout.HorizontalLayout();
//          var oHorizontal5  = new sap.ui.layout.HorizontalLayout();
//          
//          oHorizontal1.addContent(new sap.m.Label({text:'Justificativa', width:'90px'}));
//          oHorizontal1.addContent(new sap.m.TextArea({width:'450px', rows: 3}));
//          
//          oVertical.addContent(oHorizontal1);
//
//          var oCell1 = new sap.m.Label({
//            text: 'Arquivo',
//            width:'90px'
////            textAlign: "Center",
////            labelFor: oCell2
//          });
//
//          var oCell2 = new sap.ui.commons.FileUploader('idFile', {
//            uploadUrl: "/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/FileSet",
//            icon: "sap-icon://upload", // sap.ui.core.URI,
//            // since 1.26.0
//            iconOnly: true, // boolean, since 1.26.0
//            width: '235px',
//            multiple: false, // boolean
//            sendXHR: true, // boolean
////            placeholder: undefined, // string
////            style: undefined, // string
//            useMultipart: false, // boolean
////            maximumFilenameLength: undefined, // int,
//            // since
//            // 1.24.0
//            uploadComplete: function(oEvent) {
//              var sResponse = oEvent.getParameter("status");
//
//              // Atualiza Erro
//              if (sResponse == '201') {
//                sap.m.MessageToast.show('Gravado com sucesso');
//                var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
//
//                var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV';
//                var oData = new sap.ui.model.odata.ODataModel(vURL);
//                oData.setCountSupported(false);
//
//                var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), new sap.ui.model.Filter('Data',
//                 sap.ui.model.FilterOperator.EQ, vDate), new sap.ui.model.Filter('Awart', sap.ui.model.FilterOperator.EQ,
//       vAwart), ];
//
//                sap.ui.getCore().byId('idTabFile').bindAggregation("items", '/FileSet', sap.ui.getCore().byId('idRowFile'), null, oFilter);
//                this.setValue();
//                sap.ui.getCore().byId('idCRM').setValue();
//                sap.ui.getCore().byId('idCID').setValue();
//              } else {
//                sap.m.MessageToast.show('Erro arquivo não pode ser gravado');
//              };
//            }
//          });
//
////          var oCell3 = new sap.m.Button({
////            text: "Salvar",
////            press: function(oEvent) {
////              sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").Files_Create(vCrm, vDate, vAwart);
////            }
////          });
//          
//          oHorizontal2.addContent(oCell1);
//          oHorizontal2.addContent(oCell2);
////          oHorizontal2.addContent(oCell3);    
//          oVertical.addContent(oHorizontal2);
//
//          if (vCrm == true) {
//
//            oCell1 = new sap.m.Label({
//            required: true,
//              text: 'CRM',
//              width:'90px'
//            });
//
//            oCell2 = new sap.m.Input('idCRM', {
//              width:'200px'
//            });
//
//            oCell3 = new sap.m.Label({
//              required: true,
//              text: 'CID',
//              width:'90px'        
//            });
//
//            var oCell4 = new sap.m.Input('idCID', {
//              width:'200px'
//            });
//            
//            oHorizontal3.addContent(oCell1);
//            oHorizontal3.addContent(oCell2);  
//            oHorizontal4.addContent(oCell3);        
//            oHorizontal4.addContent(oCell4);  
//            
//            oVertical.addContent(oHorizontal3);
//            oVertical.addContent(oHorizontal4);
////            oMatrix.createRow(oCell1, oCell2, oCell3, oCell4);
//
//          }
//          
//          oVertical.addContent(new sap.m.Label());
//          var oToolBar = new sap.m.Toolbar();
//          
//          oToolBar.addContent(oVertical); 
////          oToolBar.addContent(new sap.m.Label());
//          
//          if (vCrm == true) {
//            oToolBar.setHeight('auto');
//          } else {
//            oToolBar.setHeight('auto');
//          };
//
//          oFiles.setHeaderToolbar(oToolBar);
//
//          var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
//
//          var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
//          var oData = new sap.ui.model.odata.ODataModel(vURL);
//          oData.setCountSupported(false);
//
//          var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), new sap.ui.model.Filter('Data',
//           sap.ui.model.FilterOperator.EQ, vDate), new sap.ui.model.Filter('Awart', sap.ui.model.FilterOperator.EQ, vAwart), ];
//
//          oFiles.setModel(oData);
//          oFiles.bindAggregation("items", '/FileSet', oRowFile, null, oFilter);
//
//          var oDialog = new sap.m.Dialog({
//            contentWidth: "50%",
//            contentHeight: '100%',
//            resizable: true,
//            title: 'Anexos',
//            content: [oFiles],
//            buttons: [
//              
//              new sap.m.Button({
//                type: sap.m.ButtonType.Accept,
//                text: "Salvar",
//                  press: function(oEvent) {
//                    debugger
//                    sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").Files_Create(vCrm, vDate, vAwart);
//                  }
//                }),       
//              
//              new sap.m.Button({
//              text: "Cancelar",
//              type: sap.m.ButtonType.Reject,
//              press: function() {
//                oDialog.destroy();
//                oFiles.destroy();
//                oToolbar.destroy();
////                oRowFile.destroy();
//              }
//            })],
//          });
//
//          oDialog.open();
//

//  }

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zhr_br_time_freq.APROV.Aprovacoes
*/
//  onBeforeRendering: function() {
//
//  },

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zhr_br_time_freq.APROV.Aprovacoes
*/
//  onAfterRendering: function() {
//
//  },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zhr_br_time_freq.APROV.Aprovacoes
*/
//  onExit: function() {
//
//  }

});