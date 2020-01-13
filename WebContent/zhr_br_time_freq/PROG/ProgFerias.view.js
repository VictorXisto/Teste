sap.ui.jsview("zhr_br_time_freq.PROG.ProgFerias", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zhr_br_time_freq.PROG.ProgFerias
	*/ 
	getControllerName : function() {
		return "zhr_br_time_freq.PROG.ProgFerias";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zhr_br_time_freq.PROG.ProgFerias
	*/ 
	createContent : function(oController) {
		
		var oPanel = new sap.m.Panel({headerText: "Períodos processados", expanded: true, expandable: true });
		var oTable = new sap.m.Table({id: "idTab" });
			
		var oCol1  = new sap.m.Column({width: "30px", vAlign : sap.ui.core.VerticalAlign.Center, header: new sap.m.Text({text: "Visualizar"})});
		var oCol2  = new sap.m.Column({width: "30px", vAlign : sap.ui.core.VerticalAlign.Center, header: new sap.m.Text({text: "Criar"})});
		//var oCol3  = new sap.m.Column({width: "60px", header: new sap.m.Text({text: "Exercício"})});
		//var oCol4  = new sap.m.Column({width: "60px", header: new sap.m.Text({text: "Tipo"})});
		var oCol3  = new sap.m.Column({width: "130px", header: new sap.m.Text({text: "Período aquisitivo"})});		
		var oCol5  = new sap.m.Column({width: "130px", header: new sap.m.Text({text: "Período concessivo"})});		
		var oCol6  = new sap.m.Column({width: "60px", header: new sap.m.Text({text: "Saldo"})});			
		var oCol7  = new sap.m.Column({width: "100px", vAlign : sap.ui.core.VerticalAlign.Inherit, header: new sap.m.Text({text: "Dias de direito"})});
		var oCol8  = new sap.m.Column({visible: false, header: new sap.m.Text({text: "Quonr"})});
		
        var oItems = new sap.m.ColumnListItem({id: "idTabItems"});
        
        oItems.addCell(new sap.ui.core.Icon({
        	id: "idShow",
        	src: "sap-icon://sys-find",
        	visible : {
			path : 'Saldo',
			formatter : function(value) {
//				
				if(value < 30) {
					return true;
				} else {
					return false;
				}
			}},
			press: [oController.showDialog, oController]
		}));
        oItems.addCell(new sap.ui.core.Icon({
        	id: "idAdd",
        	src: "sap-icon://add",
        	color: "green",
        	visible : {
			path : 'Saldo',
			formatter : function(value) {
//				
				if(value > 0) {
					return true;
				} else {
					return false;
				}
			}},
			press: [oController.onPress, oController]
		}));
        oItems.addCell(new sap.m.Text({text: "{PeriodoAquisitivo}"}));
//        oItems.addCell(new sap.m.Text({text: "{PeriodoConc}"}));
//        oItems.addCell(new sap.m.Text({text: "{Saldo}"}));
//        oItems.addCell(new sap.m.Text({text: "{DiasDir}"}));
//        oItems.addCell(new sap.m.Text({text: "{Quonr}"}));


//      oItems.addCell(new sap.m.Text({text: "{Exercicio}"}));
//      oItems.addCell(new sap.m.Text({text: "{Tipo}"}));
      oItems.addCell(new sap.m.Text({text: "{PeriodoConc}"}));
      
      oItems.addCell(new sap.m.Text({
   	   text : {
   	   parts : [ {
   	   path : "Saldo",
   	   type : new sap.ui.model.type.String()
   	   } ],
   	   formatter : function(fValue) {
//   	    
/*   	    if (fValue >= '0.00') {
      	if(fValue.search("-") != "-1"){
      		var fValueParse = parseFloat(fValue);
      	    var time = Math.abs(fValueParse);
      	    var tim = time * 3600;
      	    var hour = Math.floor(tim / 3600);
      	    tim = tim % 3600;
      	    var min = Math.round(tim / 60);
      	    if(min < '10'){
      	    	min = '00';
      	    }
      	    if (hour < '10') {
      	     hour = "0" + hour;
      	    }
      	    var Saldo = hour + ':' + min;
      	    if(fValue.search("-") != "-1"){
        	    	Saldo = '-' + Saldo;
      	     }
        } else{	
  	    var time = Math.abs(fValue);
  	    var tim = time * 3600;
  	    var hour = Math.floor(tim / 3600);
  	    tim = tim % 3600;
  	    var min = Math.round(tim / 60);
  	    if (min < '10') {
  	  	    min = "0" + min;
  	  	}
  	    if (hour < 10) {
  	    	hour = "0" + hour;
  	  	}
  	    var Saldo = hour + ':' + min;
        }
   	    }*/
   		
   		var Saldo;
   	    if(fValue == '0.00000'){
   	    	Saldo = '0.00';
   	    }
   	    else{
   	    	
   	   		var um   = fValue.split(".",1)[0];
   	   		var dois = fValue.split(".",2)[1];
   	    	Saldo = um.trim() + '.' + dois.trim().substring(0,2);
   	    }
   	    return Saldo;
   	   }
   	  }
   	  }));
      
      oItems.addCell(new sap.m.Text({
      	   text : {
      	   parts : [ {
      	   path : "DiasDir",
      	   type : new sap.ui.model.type.String()
      	   } ],
      	   formatter : function(fValue) {
//      	    
      	    if(fValue != '0.00000') {

      	    var dias_um   = fValue.split(".",1)[0];
      	    var dias_dois = fValue.split(".",2)[1];
      	    
      	    if((parseFloat(dias_um.trim())) < '10'){
      	    	dias_um = "0" + dias_um.trim();
      	    }
      	    
      	    var DiasDir = dias_um.trim() + '.' + dias_dois.trim().substring(0,2);
      	    
      	    }
      	    if(fValue == '0.00000'){
      	    	DiasDir = '0.00';
      	    }
      	    return DiasDir;
      	   }
      	  }
      }));
      
      oItems.addCell(new sap.m.Text({text: "{Quonr}"}));        
        
      oTable.addColumn(oCol1);
      oTable.addColumn(oCol2);
      oTable.addColumn(oCol3);
      //oTable.addColumn(oCol4);
      oTable.addColumn(oCol5);
      oTable.addColumn(oCol6);
      oTable.addColumn(oCol7);
      oTable.addColumn(oCol8);
      
        
        oPanel.addContent(oTable);
		return oPanel;

	}

});