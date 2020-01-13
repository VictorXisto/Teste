sap.ui.controller("zhr_br_time_freq.GEST.Gest", {

  /**
   * Called when a controller is instantiated and its View controls (if
   * available) are already created. Can be used to modify the View before it
   * is displayed, to bind event handlers and do other one-time
   * initialization.
   * 
   * @memberOf zhr_br_time_freq.GEST.Gest
   */
  // ================================================================================
  // Evento Inicial 
  // ================================================================================
  onInit: function() { 

  },

  // ================================================================================
  // Evento Seleção Unidade Organizacional 
  // ================================================================================
  pressGestorOrgeh: function(oEvent) {

    var oApp = sap.ui.getCore().byId("AppGestor");
    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
    var obindingContext = oEvent.getSource().getBindingContext();
    var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');

    var filter = [new sap.ui.model.Filter('Option', sap.ui.model.FilterOperator.EQ, '2'),//
    new sap.ui.model.Filter('Objid', sap.ui.model.FilterOperator.EQ, obindingContext.getObject('Objid')),//
    new sap.ui.model.Filter('Periodo', sap.ui.model.FilterOperator.EQ, oPeriodo.getSelectedKey()),//
    new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("idLogin").getText()),//
    new sap.ui.model.Filter('Delegate', sap.ui.model.FilterOperator.EQ, true)//
    ];

    oData.read("/MenuSet", {
      filters: filter,
      success: function(oData) {
        var json = new sap.ui.model.json.JSONModel(oData);
        var oTable = sap.ui.getCore().byId("ListGestorPernr");
        var oTemplate = sap.ui.getCore().byId("ColumnListGestorPernr");
        oTable.destroyItems();
        oTable.setModel(json);
        oTable.bindAggregation("items", {
          path: "/results",
          template: oTemplate
        });
      }
    });
    //Abre Página
    oApp.to('GestorPernr');

  },

  // ================================================================================
  // Evento Seleção Unidade Organizacional 
  // ================================================================================
  pressGestorPernr: function(oEvent) {

    var obindingContext = oEvent.getSource().getBindingContext();
    var oPernr = new sap.m.Text();
    oPernr.setText(obindingContext.getObject('Objid'));
    sap.ui.getCore().byId("idIsProxy").getSelected(false);

    var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
    //Atualiza Informações Funcionário
    sap.ui.getCore().byId("idmain").getController().get_newValues(oPernr, oPeriodo, sap.ui.getCore().byId("idIsProxy").setSelected());

  },

  // ================================================================================
  // Voltar Página Gestor 
  // ================================================================================
  pressback: function() {
    
    var oApp = sap.ui.getCore().byId("AppGestor");
    oApp.back();

  },

  // ================================================================================
  // Localizar Unidade Organizacional 
  // ================================================================================
  SearchOrgeh: function(oEvt) {

    // Filtro
    var aFilters = [];
    var sQuery = oEvt.getSource().getValue();
    if (sQuery && sQuery.length > 0) {
      var filter = new sap.ui.model.Filter("Stext", sap.ui.model.FilterOperator.Contains, sQuery);
      aFilters.push(filter);
    }

    // Atualiza Menu
    var list = sap.ui.getCore().byId("ListGestorOrgeh");
    var binding = list.getBinding("items");
    binding.filter(aFilters);
  },

  // ================================================================================
  // Localizar Nome Colaborador
  // ================================================================================
  SearchPernr: function(oEvt) {

    // Filtro
    var aFilters = [];
    var sQuery = oEvt.getSource().getValue();
    if (sQuery && sQuery.length > 0) {
      var filter = new sap.ui.model.Filter("Stext", sap.ui.model.FilterOperator.Contains, sQuery);
      aFilters.push(filter);
    }

    // Atualiza Menu
    var list = sap.ui.getCore().byId("ListGestorPernr");
    var binding = list.getBinding("items");
    binding.filter(aFilters);
  },

  pressGestor: function() {
    
    var oPernr = sap.ui.getCore().byId('idLogin');
    var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
    //Atualiza Informações Funcionário
    sap.ui.getCore().byId("idmain").getController().get_newValues(oPernr, oPeriodo, sap.ui.getCore().byId("idIsProxy").setSelected());
    
    
    //this.getOwnerComponent()._oSplitApp = this.byId("splitApp");
    
    //var oSplitApp = this.getOwnerComponent()._oSplitApp;
    
    //sap.ui.getCore().byId("splitApp").hideMaster();
  }

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf zhr_br_time_freq.GEST.Gest
 */
// onBeforeRendering: function() {
//
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf zhr_br_time_freq.GEST.Gest
 */
// onAfterRendering: function() {
//
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf zhr_br_time_freq.GEST.Gest
 */
// onExit: function() {
//
// }
});