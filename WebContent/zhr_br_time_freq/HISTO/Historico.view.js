sap.ui.jsview("zhr_br_time_freq.HISTO.Historico", {

  /** Specifies the Controller belonging to this View. 
  * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
  * @memberOf zhr_br_time_freq.HISTO.Historico
  */ 
  getControllerName : function() {
    return "zhr_br_time_freq.HISTO.Historico";
  },

  /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
  * Since the Controller is given to this method, its event handlers can be attached right away. 
  * @memberOf zhr_br_time_freq.HISTO.Historico
  */ 
  createContent : function(oController) {

//      var oPage = new sap.m.Page();
      var oTable   = new sap.m.Table({id: "idTabHisto", noDataText : "Sem histórico de solicitações"});

      var oColStatus   = new sap.m.Column({width : "150px", header: new sap.m.Label({text:''})});
      var oColTpAprov  = new sap.m.Column({width : "150px", header: new sap.m.Label({text:''})});
      var oColData  = new sap.m.Column({width : "300px", header: new sap.m.Label({text:''})});
      var oColTitle    = new sap.m.Column({width : "auto", header: new sap.m.Label({text:''})});
      var oColButton   = new sap.m.Column({width : "40px", header: new sap.m.Label({text:''})});

      var oList = new sap.m.ColumnListItem({id: "idTempHisto"});

      oList.addCell(new sap.m.Button({icon: {
          parts :
          [
             { path : "Approv" },
             { path : "Reprov" },
             { path : "Cancel" },            
          ],
      formatter: function(p_aprov, p_reprov, p_cancel){
        if(p_aprov != "false"){
          return "sap-icon://hr-approval";
        } else if(p_reprov != "false"){
          return "sap-icon://employee-rejections";
        } else if(p_cancel != "false"){
          return "sap-icon://sys-cancel";
        } else {
          return "sap-icon://lateness";
        }
          debugger
      }  },
   color : {
          parts :
          [
             { path : "Approv" },
             { path : "Reprov" },
             { path : "Cancel" },            
          ],
      formatter: function(p_aprov, p_reprov, p_cancel){
        if(p_aprov != "false"){
          return "blue";
        } else if(p_reprov != "false"){
          return "red";
        } else if(p_cancel != "false"){
          return "red";
        } else {
          return "orange";
        }
          debugger
      }  },

      text: {
          parts :
            [
               { path : "Approv" },
               { path : "Reprov" },
               { path : "Cancel" },
            ],
        formatter: function(p_aprov, p_reprov, p_cancel){
          if(p_aprov != "false"){
            return "Aprovado";
          } else if(p_reprov != "false"){
            return "Reprovado";
          } else if(p_cancel != "false"){
            return "Cancelado";
          } else {
            return "Pendente";
          }
            debugger
        }
      },
      type: sap.m.ButtonType.Transparent,
      press:[oController.showPopover, oController]}));

      oList.addCell(new sap.m.Text({
      text: {
          parts :
            [
               { path : "Origem" },
               { path : "Reprov" },
               { path : "Cancel" },
            ],
        formatter: function(p_origem){
          if(p_origem == 'M' ){
            return "Marcação";
          } else if(p_origem == 'S' ){
            return "Substituição";
          } else if(p_origem == 'O' ){
            return "Sobreaviso";
          } else if(p_origem == 'J' ){
            return "Justificativa";
          } else if(p_origem == 'F' ){
            return "Férias";
          } else if(p_origem == 'H' ){
            return "Hora Extra";
          } else if(p_origem == 'E' ){
            return "Estorno Marcação";
          } else {
            return "Outros";
          }
            debugger
        }
      },
}));

      oList.addCell(new sap.m.DateTimeInput({
           value : "{Data}",
           editable : false,
           type : "Date",
           displayFormat : 'dd/MM/yyyy',
           valueFormat : "yyyy-MM-dd'T00:00:00'"
          }));
      oList.addCell(new sap.m.Text({text:'{Title}'}));

      oList.addCell(new sap.m.Button({
      icon: "sap-icon://overflow",
      tooltip: "Informações Complementares",
      type: sap.m.ButtonType.Transparent,
      press:[oController.showPopover, oController]}));


//      oTable.setHeaderToolbar(oToolbar);
      oTable.addColumn(oColStatus);
      oTable.addColumn(oColTpAprov);
      oTable.addColumn(oColData);
      oTable.addColumn(oColTitle);
      oTable.addColumn(oColButton);


      return oTable;

  }

});

//icon : {
//    path : "File",
//    formatter : function(fFile) {
//   	 return sap.ui.core.IconPool.getIconURI('attachment');
//      debugger
//     if (fFile == '1') {
//       debugger
//      return sap.ui.core.IconPool.getIconURI('show');
//     }
//     else if (fFile == '0') {
//       return sap.ui.core.IconPool.getIconURI('create');
//     }
//     ;
//    },
//   },