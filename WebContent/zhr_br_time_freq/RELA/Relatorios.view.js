sap.ui.jsview("zhr_br_time_freq.RELA.Relatorios", {
	
	 getControllerName : function() {
		  return "zhr_br_time_freq.RELA.Relatorios";
	 },
	 
	 createContent: function(oController){
		 
	var oApp = new sap.m.App();
	var oHeaderContainer = new sap.m.HeaderContainer("headerContainer");	
	var oPage = new sap.m.Page(
		{title: "Saldo de Horas",
		content : [oHeaderContainer]
	});
	var oLabel = new sap.m.Label({text: "Variante:", labelFor: "idVariante"});
	
	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/");
	sap.ui.getCore().setModel(oModel, "variant");

	var oComboBox = new sap.m.ComboBox("idVariante", {
	  	  items : {
	  	    path : "variant>/VarianteSaldoHorasSet",  
	  	    template : new sap.ui.core.ListItem({  
	  	        key: "{variant>Variant}",
				text: "{variant>Descricao}"
	  	    })
	  	  },
	  	  selectionChange: [oController.onVariantChange, oController]
    });

    var oTable = new sap.ui.table.Table({
        id: "idSaldoHoras",
        alternateRowColors: true
    });

     oHeaderContainer.addContent(oLabel);
     oHeaderContainer.addContent(oComboBox); 
    
	 oPage.addContent(oTable);
	 
	 oApp.addPage(oPage);
	 return oApp;

	 }
	
});