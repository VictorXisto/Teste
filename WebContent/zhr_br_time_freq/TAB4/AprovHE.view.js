sap.ui.jsview("zhr_br_time_freq.TAB4.AprovHE", {

  /** Specifies the Controller belonging to this View. 
  * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
  * @memberOf zhr_br_time_freq.TAB4.AprovHE
  */ 
  getControllerName : function() {
    return "zhr_br_time_freq.TAB4.AprovHE";
  },

  /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
  * Since the Controller is given to this method, its event handlers can be attached right away. 
  * @memberOf zhr_br_time_freq.TAB4.AprovHE
  */ 
  createContent : function(oController) {

      // ================================================================================
    // Tabela/Cabe�alho  
     	// ================================================================================
    var oTable = new sap.m.Table('oTable',{
                   mode : sap.m.ListMode.None,
                   width : "100%",
                   enableBusyIndicator : true,
                     headerToolbar : new sap.m.Toolbar({
                    design : sap.m.ToolbarDesign.Auto,
                    content : [ new sap.m.Button({
                            text : "Inserir",
                            icon : "sap-icon://sys-add",
                            iconFirst : false,
                            press : [oController.eDialogInsert],
                            visible : '{IDGestConfTable>/Insert}',
                          }),
                          new sap.m.ToolbarSpacer(),
                          new sap.m.Button({
                            text : "Espelho de Ponto",
                            icon : "sap-icon://create",
                            iconFirst : false,
                            visible: false,
                            press: [sap.ui.getCore().byId("idmain").getController().get_espelho]
                          }),
                    ],
                     }), // sap.ui.core.Control
                   fixedLayout : true,
                   columns : [new sap.m.Column({  
                            hAlign   : "Left",  
                            width    : "12%",  
                            header   : new sap.m.Label({  
                                  text : "Matrícula"  
                            })
                   }), 
                        new sap.m.Column({  
                            hAlign : "Center",  
                            width : "15%",  
                            header : new sap.m.Label({  
                                  text : "Data"  
                            }),  
                   }), 
                        new sap.m.Column({  
                            hAlign : "Center",  
                            width : "30%",  
                            header : new sap.m.Label({  
                                  text : "Posição"  
                            }),  
                   }), 
                        new sap.m.Column({  
                            hAlign : "Center",  
                            width : "30%",  
                            header : new sap.m.Label({  
                                  text : "Nome"  
                            }),  
                   }), 
                        new sap.m.Column({  
                            hAlign : "Center",  
                            width : "20%",  
                            header : new sap.m.Label({  
                                  text : "HE's autorizadas"  
                            }),  
                   }), 
                        new sap.m.Column({  
                            hAlign : "Center",  
                            width : "15%",  
                            header : new sap.m.Label({  
                                  text : "HE's Realizadas"  
                            }),  
                   }), 
//                        new sap.m.Column({  
//                            hAlign : "Center",  
//                            width : "15%",  
//                            header : new sap.m.Label({  
//                                  text : "Saldo diário"  
//                            }),  
//                   }),
                        new sap.m.Column({
                            visible : '{IDGestConfTable>/Insert}',
                            width : "6%",  
                  }),
                        new sap.m.Column({  
                            visible : '{IDGestConfTable>/Insert}',
                            width : "6%",  
                  })],
    });

      // ================================================================================
    // Tabela/Colunas Itens  
     	// ================================================================================
    var oColumnTable = new sap.m.ColumnListItem("oColumnTable", {
      visible : { path : 'Controlevent',
              formatter : function(value){
                  if (value == 'E'){
                    return false;
                  }else{
                    return true;
                  }
              }},
      press: [oController.pressList],
      unread : false,  
      cells : [ new sap.m.Label({  
                  text : "{Pernr}"  
                }),  
                new sap.m.Label({
                textAlign : "Center",  
              text : {
              path : "Data",
              formatter : function(value){
                          return value.substring(8, 10) + '/' + value.substring(5, 7) + '/' + value.substring(0, 4);
              }
              },
                }), 
                new sap.m.Label({  
                  text: "{PlansDescr}",  
                }), 
                new sap.m.Label({  
                  text: "{Cname}",  
                }), 
                new sap.m.Label({  
                  text: "{AutorizadasDescr}",  
                }), 
                new sap.m.Label({
                  text: "{Realizadas}",  
                }), 
//                new sap.m.Label({  
//                    textAlign : 'Center',
//                    text : "{SaldoDiario}"  
//                }),
                new sap.m.Button({
                  enabled : { path : 'AutorizadasValor',
                          formatter : function(value){
                          if (sap.ui.getCore().byId('idLocked').getText() == 'X') {
                        return false;                           
                          } else if ( value == 'PT00H00M00S' ){
                            return false;
                          } else {
                            return true;
                          }
                          },
                        },
                  visible : '{IDGestConfTable>/Insert}',
              type : sap.m.ButtonType.Transparent,
                  icon : sap.ui.core.IconPool.getIconURI('edit'),
                    press : [oController.eDialogEdit]
              }),
                new sap.m.Button('Del',{
                  enabled : { path : 'AutorizadasValor',
                      formatter : function(value){
                      if (sap.ui.getCore().byId('idLocked').getText() == 'X') {
                    return false;                       
                      } else if ( value == 'PT00H00M00S' ){
                        return false;
                      } else {
                        return true;
                      }
                      },
                    },
                    visible : '{IDGestConfTable>/Insert}',
              type    : sap.m.ButtonType.Transparent,
                  icon    : sap.ui.core.IconPool.getIconURI('delete'),
                    press   : [oController.eConfDelete]
                })   
                ]  
    });

    return oTable;

  }

});