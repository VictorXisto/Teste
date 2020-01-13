sap.ui.jsview("zhr_br_time_freq.APROV.Aprovacoes", {

  /** Specifies the Controller belonging to this View. 
  * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
  * @memberOf zhr_br_time_freq.APROV.Aprovacoes
  */ 
  getControllerName : function() {
    return "zhr_br_time_freq.APROV.Aprovacoes";
  },

  /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
  * Since the Controller is given to this method, its event handlers can be attached right away. 
  * @memberOf zhr_br_time_freq.APROV.Aprovacoes
  */ 
  createContent : function(oController) {

//    var oPage = new sap.m.Page();
    var oTable   = new sap.m.Table({id: "TabAprov", mode: sap.m.ListMode.MultiSelect, noDataText : "Sem aprovações pendentes..."});
    var oToolbar = new sap.m.Toolbar({content: [new sap.m.Title({id:"tabTitle"}),
                          new sap.m.ToolbarSpacer({width:"595px"}),
                          new sap.m.SearchField({
              placeholder:"Filtrar",
              value:"{ui>/globalFilter}",
              search:  [oController.filterGlobally, oController],
              width:"200px" }),
                          new sap.m.Button({id: "massApprovals",
                                    text:"Aprovar",
                                    icon: "sap-icon://accept",
                                    type: sap.m.ButtonType.Accept,
                                    press: [oController.onPress, oController]
                                  })
                          ]
                    });

    var oColFoto  = new sap.m.Column({width : "35px", header: new sap.m.Label({text:''})});
    var oColColab = new sap.m.Column({width : "300px", header: new sap.m.Label({text:''})});
    var oColData  = new sap.m.Column({width : "400px", header: new sap.m.Label({text:''})});
    var oColReprov = new sap.m.Column({width : "30px", header: new sap.m.Label({text:''})});
    var oColAprov = new sap.m.Column({width : "70px", header: new sap.m.Label({text:''})});
    var oColAttach = new sap.m.Column({width : "70px", header: new sap.m.Label({text:''})});

    var oList = new sap.m.ColumnListItem({id: "TempAprov"});

    var oVert1 = new sap.ui.layout.VerticalLayout();
    var oVert2 = new sap.ui.layout.VerticalLayout();

//    oVert1.addContent(new sap.m.Text({text:"{Title}"}));
//    oVert1.addContent(new sap.m.Text({text:""}));

//    oVert2 = oVert1;

    oList.addCell(//new sap.m.Text({text:'Foto'}));//
    new sap.m.Image({ width: "40px", src: "https://hcm19.sapsf.com/eduPhoto/view?companyId=blaufarmac&photo_type=liveProfile&user_id={Pernr}&mod=" }));
//    oList.addCell(oVert1);
    oList.addCell(new sap.m.Text({text:'{Title}'}));
    oList.addCell(new sap.m.Text({text:'{Descr}'}));
    oList.addCell(new sap.m.Button({icon: "sap-icon://overflow" , type: sap.m.ButtonType.Transparent, press: [oController.showAttach, oController]}));
    oList.addCell(new sap.m.Button({id:"singleReject", text: "Reprovar", type: sap.m.ButtonType.Reject, press: [oController.onPress, oController] }));
    oList.addCell(new sap.m.Button({id:"singleApproval", icon: "sap-icon://accept", text: "Aprovar", type: sap.m.ButtonType.Accept, press: [oController.onPress, oController] }));

    oTable.setHeaderToolbar(oToolbar);
    oTable.addColumn(oColFoto);
    oTable.addColumn(oColColab);
    oTable.addColumn(oColData);
    oTable.addColumn(oColReprov);
    oTable.addColumn(oColAprov);
    oTable.addColumn(oColAttach);

    return oTable;
  }

});