sap.ui.controller("zhr_br_time_freq.HISTO.Historico", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zhr_br_time_freq.HISTO.Historico
*/
  onInit: function() {

    var that = this;
//    var oData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/");
//
////    this.oLine = null;
//
////    sap.ui.getCore().setData(oLine);
//
//    oData.read("/AprovarSet",{
//      success: function(oData){
//        debugger
//        var json = new sap.ui.model.json.JSONModel(oData, "Historico");
//        var oTable = sap.ui.getCore().byId("idTabHisto");
//        var oTemp  = sap.ui.getCore().byId("idTempHisto");
//
//        that.getView().setModel(json);
//
//        oTitle.setText('Minhas solicitações de workflow (' + oData.results.length + ")");
//        oTable.bindAggregation(
//          "items", {
//          path: "/results",
//          template: oTemp
//        });
//
//      },
//      error: function(error){
//
//        debugger
//
//      }
//    })

  },

  getHistorico: function(p_pernr, p_periodo) {

    //var that = this;
    var oData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/");


//        var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
//    var oData = new sap.ui.model.odata.ODataModel(vURL);
    oData.setCountSupported(false);

    oData.read("/PeriodsSet('" + p_periodo.getSelectedKey() + "')", null, null, false, function(oDataSuccess) {
      var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, p_pernr.getText()),
      new sap.ui.model.Filter('Data', sap.ui.model.FilterOperator.BT, oDataSuccess.Begda, oDataSuccess.Endda), ];

//    this.oLine = null;

//    sap.ui.getCore().setData(oLine);
//    var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, p_pernr.getText())];
    oData.read("/HistoricoSet", {
      filters: oFilter,
      success: function(oData){
        debugger
        var json = new sap.ui.model.json.JSONModel(oData, "Historico");
        var oTable = sap.ui.getCore().byId("idTabHisto");
        var oTemp  = sap.ui.getCore().byId("idTempHisto");

        sap.ui.getCore().byId('idHisto').setModel(json);

      //  oTitle.setText('Minhas solicitações de workflow (' + oData.results.length + ")");
        oTable.bindAggregation(
          "items", {
          path: "/results",
          template: oTemp
        });

      },
      error: function(error){

        debugger

      }
    })

    });

  },

  showPopover: function(oEvent){
    debugger

    var oValues = oEvent.getSource().getParent().oBindingContexts.undefined.getModel().getData().results
            [oEvent.getSource().getParent().oBindingContexts.undefined.sPath.split('/')[2]];

      var oDialog = new sap.m.Dialog({
          contentWidth: "50%",
          contentHeight: 'auto',
          resizable: true,
      draggable : true, // boolean, since 1.30
          title: oValues.Title,
//          content: [p_content],
          buttons: [new sap.m.Button({type: sap.m.ButtonType.Transparent, text:"Fechar", press: function(oEvent){
            oEvent.getSource().getParent().destroy();
          }})],
        });
      
//      var oPanel = new sap.m.Panel();
        var aprov = null;
        var date  = null;
        var oVert = new sap.ui.layout.VerticalLayout();

        oVert.addContent(new sap.m.Label({text: "Descrição: "}));
        oVert.addContent(new sap.m.Text({text: oValues.Descr }));
        oVert.addContent(new sap.m.Label());
        oVert.addContent(new sap.m.Label({text: "Criado por: "}));
        oVert.addContent(new sap.m.Text({text: oValues.CreateCname + " (" + oValues.CreateUname + ")" }));
        oVert.addContent(new sap.m.Label());
        oVert.addContent(new sap.m.Label({text: "Criado em: "}));
        oVert.addContent(new sap.m.Text({text: + oValues.CreateErdat.substr(8,2) + "."
                           + oValues.CreateErdat.substr(5,2) + "."
                           + oValues.CreateErdat.substr(0,4) + " / "
                           + oValues.CreateErtim.substr(2,2) + ":"
                           + oValues.CreateErtim.substr(5,2)
      }));
        oVert.addContent(new sap.m.Label());
        if(oValues.Apprv1Cname != ""){
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
        oVert.addContent(new sap.m.Label({text: "Última modificação por: "}));
          oVert.addContent(new sap.m.Text({text: aprov}));
        }
        oVert.addContent(new sap.m.Label());
        if(date != null){
        oVert.addContent(new sap.m.Label({text: "Última modificação em: "}));
          oVert.addContent(new sap.m.Text({text: date }));
      }
        oVert.addContent(new sap.m.Label());
       if(oValues.Texto != ""){
          oVert.addContent(new sap.m.Label({text: "Justificativa: "}));         
          oVert.addContent(new sap.m.Text({width:"auto", text: oValues.Texto}));         
       } 

    oDialog.addContent(oVert);
      oDialog.open();

  },

  setIcon: function(oEvent) {
    debugger
  },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zhr_br_time_freq.HISTO.Historico
*/
//  onBeforeRendering: function() {
//
//  },

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zhr_br_time_freq.HISTO.Historico
*/
//  onAfterRendering: function() {
//
//  },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zhr_br_time_freq.HISTO.Historico
*/
//  onExit: function() {
//
//  }

});