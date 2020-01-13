sap.ui.controller("zhr_br_time_freq.PROG.ProgFerias", {

  /**
   * Called when a controller is instantiated and its View controls (if available) are already created.
   * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
   * @memberOf zhr_br_time_freq.PROG.ProgFerias
   */

  onInit: function () {
      var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
        var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
        this.getPeriodoAquisitivo(oPernr, oPeriodo);
  },

  getPeriodoAquisitivo: function (oPernr, oPeriodo) {

    var that = this;
    var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/");
    
    oModel.read("/PeriodsSet('" + oPeriodo.getSelectedKey() + "')", null, null, false, function(oDataSuccess) {
        var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), ];
/*        new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, oDataSuccess.Begda),
        new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, oDataSuccess.Endda) ];*/

	    oModel.read("/PeriodoAquiSet", {
	      async: true,
	      filters: oFilter,
	      success: function (oData) {
	    	
	        var json = new sap.ui.model.json.JSONModel(oData, "Periodos");
	        var oTable = sap.ui.getCore().byId("idTab");
	        var oTemp = sap.ui.getCore().byId("idTabItems");
	        oTable.destroyItems();
	        sap.ui.getCore().byId('idTab').setModel(json);
	        oTable.bindAggregation(
	          "items", {
	            path: "/results",
	            template: oTemp
	          });
	
	      },
	      error: function (error) {
	    	  
	      }
	    });
    
    });

    var oModel2 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/");

    oModel2.read("/ShowMsgFeriasSet", {
      success: function (oData2) {
    	
        sap.ui.getCore().dadosShowMsgFerias = oData2.results[0];
        if (oData2.results[0].SendMail == "X" && oData2.results[0].RespMailApp == "") {

          var oRBGOPT = new sap.m.RadioButtonGroup("idListSimNao", {
            columns: 2, // int
            selectedIndex: 0, // int
            buttons: [
              new sap.m.RadioButton({
                text: "Sim", // string
              }),
              new sap.m.RadioButton({
                text: "Não", // string
              }),
            ], // sap.m.RadioButton
            select: [function (oEvent) {
            	
              if (oEvent.getSource().getSelectedIndex() == 0) {
            	  if(sap.ui.getCore().byId("IdSim1").getSelected() == true){
                      sap.ui.getCore().byId("idListNao").setVisible(false);
                      sap.ui.getCore().byId("idListSim").setVisible(true);
                      sap.ui.getCore().byId("idoH").setVisible(false);
            	  }else{
                      sap.ui.getCore().byId("idListNao").setVisible(false);
                      sap.ui.getCore().byId("idListSim").setVisible(true);
                      sap.ui.getCore().byId("idoH").setVisible(true);
            	  }

              } else if (oEvent.getSource().getSelectedIndex() == 1) {
            	  if(sap.ui.getCore().byId("IdNao1").getSelected() == true){
                      sap.ui.getCore().byId("idListSim").setVisible(false);
                      sap.ui.getCore().byId("idListNao").setVisible(true);
                      sap.ui.getCore().byId("idoH").setVisible(false);
            	  }
            	  else if(sap.ui.getCore().byId("IdNao2").getSelected() == true){
                      sap.ui.getCore().byId("idListSim").setVisible(false);
                      sap.ui.getCore().byId("idListNao").setVisible(true);
                      sap.ui.getCore().byId("idoH").setVisible(true);
            		  
            	  }
            	  else if(sap.ui.getCore().byId("IdNao3").getSelected() == true){
                      sap.ui.getCore().byId("idListSim").setVisible(false);
                      sap.ui.getCore().byId("idListNao").setVisible(true);
                      sap.ui.getCore().byId("idoH").setVisible(false);
            	  }
              }

            }, this]
          });

          var oRBGSIM = new sap.m.RadioButtonGroup("idListSim", {
            columns: 1, // int
            buttons: [new sap.m.RadioButton({
            	id: "IdSim1",
                text: "Pretendo usufruir o período todo",
              }),
              new sap.m.RadioButton({
            	  id: "IdSim2",
            	  id: "Por",
                text: "Porem não ao mês todo, apenas o período informado abaixo",
              }),
            ],
            select: function (oEvent) {
              that.onSelect(oEvent);
            }
          });

          var oRBGNAO = new sap.m.RadioButtonGroup("idListNao", {
            visible: false,
            columns: 1, // int
            buttons: [new sap.m.RadioButton({
            	id: "IdNao1",
                text: "Gostaria de suspendê-la para gozo em momento oportuno",
              }),
              new sap.m.RadioButton({
            	  id: "IdNao2",
                text: "Gostaria gozá-las no mês:",
              }),
              new sap.m.RadioButton({
            	  id: "IdNao3",
                text: "Não posso tirar férias, por necessidade de trabalho",
              }),
            ],
            select: function (oEvent) {
              that.onSelect(oEvent);
            }
          });
          
          var oDialog = new sap.m.Dialog('idShowDialog', {
            //            icon : undefined, // sap.ui.core.URI
            title: "Confirmação de férias", // string
            showHeader: true, // boolean, since 1.15.1
            contentWidth: "auto", // sap.ui.core.CSSSize, since 1.12.1
            contentHeight: "auto", // sap.ui.core.CSSSize, since 1.12.1
            resizable: true, // boolean, since 1.30
            draggable: true, // boolean, since 1.30
          });

          var oBtnClose = new sap.m.Button({
            text: "Fechar",
            type: sap.m.ButtonType.Reject,
            press: function (oEvent) {
              sap.ui.getCore().byId("idShowDialog").close();
              sap.ui.getCore().byId("idShowDialog").destroy();
              //                sap.ui.getCore().byId("idShowDialog").destroyContent();
            }
          });
          var oBtnSalvar = new sap.m.Button({
            text: "Salvar",
            type: sap.m.ButtonType.Accept,
            press: function (oEvent) {
              that.onSalvar(oEvent);
              
            }
          });

          var oBegda = oData2.results[0].Begda.substring(8, 10) + "/" + oData2.results[0].Begda.substring(5, 7) + "/" + oData2.results[0].Begda
            .substring(0, 4);
          var oEndda = oData2.results[0].Endda.substring(8, 10) + "/" + oData2.results[0].Endda.substring(5, 7) + "/" + oData2.results[0].Endda
            .substring(0, 4);

          oDialog.addContent(new sap.m.Text({
            text: "Prezado colaborador, favor tomar uma ação para as férias que serão" +
              " gozadas de " + oBegda + " à " + oEndda
          }));

          //              oDialog.addContent(new sap.m.Text({text: "Prezado colaborador, favor tomar uma ação para as férias que serão" +
          //              " gozadas de 01.01.2019 à 31.01.2019"}));
          //                }

          var oH = new sap.ui.layout.HorizontalLayout({
            id: "idoH",
            visible: false
          });
          oH.addContent(new sap.m.Label({
            text: "Período de: "
          }));
          oH.addContent(new sap.m.Label());
          oH.addContent(new sap.m.DatePicker({
            id: "idRespNewBegda",
            value: "{RespNewBegda}",
            width: "150px",
            enabled: true,
            displayFormat: 'dd/MM/yyyy',
            valueFormat: "yyyy-MM-dd'T00:00:00'"
          }));
          oH.addContent(new sap.m.Label());
          oH.addContent(new sap.m.Label({
            text: "Período até: "
          }));
          oH.addContent(new sap.m.Label());
          oH.addContent(new sap.m.DatePicker({
            id: "idRespNewEndda",
            value: "{RespNewEndda}",
            width: "150px",
            enabled: true,
            displayFormat: 'dd/MM/yyyy',
            valueFormat: "yyyy-MM-dd'T00:00:00'"
          }));

          oDialog.addContent(new sap.m.Label());
          oDialog.addContent(oRBGOPT);
          oDialog.addContent(new sap.m.Label());
          oDialog.addContent(oRBGSIM);
          oDialog.addContent(oRBGNAO);
          oDialog.addContent(oH);
          oDialog.addButton(oBtnSalvar);
          oDialog.addButton(oBtnClose);
          if(oData2.results[0].Persg === "1"){
        	  oDialog.open();  
          }
          
        }

      },
      error: function (oError) {

      },
    });

  },

  onSelect: function (oEvent) {
	  
    if (oEvent.getSource().getSelectedIndex() == 0) {
      sap.ui.getCore().byId("idoH").setVisible(false);
    } else if (oEvent.getSource().getSelectedIndex() == 1) {
      sap.ui.getCore().byId("idoH").setVisible(true);
    } else if (oEvent.getSource().getSelectedIndex() == 2) {
      sap.ui.getCore().byId("idoH").setVisible(false);
    } else if (oEvent.getSource().getSelectedIndex() == 3) {
      sap.ui.getCore().byId("idoH").setVisible(true);
    } else if (oEvent.getSource().getSelectedIndex() == 4) {
      sap.ui.getCore().byId("idoH").setVisible(false);
    }

  },

  onSalvar: function (oEvent) {
	
    var oDados = sap.ui.getCore().dadosShowMsgFerias;

    if ((sap.ui.getCore().byId("idListSimNao").getSelectedIndex() == 0) && (sap.ui.getCore().byId("idListSim").getSelectedIndex() == 0)) {
      oDados.RespSimNao = "S";
      oDados.RespKey = 0;
    } else if ((sap.ui.getCore().byId("idListSimNao").getSelectedIndex() == 0) && (sap.ui.getCore().byId("idListSim").getSelectedIndex() ==
        1)) {
      oDados.RespSimNao = "S";
      oDados.RespNewBegda = sap.ui.getCore().byId("idRespNewBegda").getValue();
      oDados.RespNewEndda = sap.ui.getCore().byId("idRespNewEndda").getValue();
      oDados.RespKey = 1;
    } else if ((sap.ui.getCore().byId("idListSimNao").getSelectedIndex() == 1) && (sap.ui.getCore().byId("idListNao").getSelectedIndex() ==
        0)) {
      oDados.RespSimNao = "N";
      oDados.RespKey = 2;
      
      var sId = '1';
      window.open("/sap/opu/odata/sap/ZHRST_SHOW_PDF_SRV/ShowPdfSet('" + sId + "')/$value");
      
    } else if ((sap.ui.getCore().byId("idListSimNao").getSelectedIndex() == 1) && (sap.ui.getCore().byId("idListNao").getSelectedIndex() ==
        1)) {
      oDados.RespSimNao = "N";
      oDados.RespKey = 3;
      oDados.RespNewBegda = sap.ui.getCore().byId("idRespNewBegda").getValue();
      oDados.RespNewEndda = sap.ui.getCore().byId("idRespNewEndda").getValue();
    } else if ((sap.ui.getCore().byId("idListSimNao").getSelectedIndex() == 1) && (sap.ui.getCore().byId("idListNao").getSelectedIndex() ==
        2)) {
      oDados.RespSimNao = "N";
      oDados.RespKey = 4;

      var sId = '1';
      window.open("/sap/opu/odata/sap/ZHRST_SHOW_PDF_SRV/ShowPdfSet('" + sId + "')/$value");

    }

    //    if(oEvent.getSource().getSelectedIndex() == 0) {
    //      oDados.RespSimNao = "S";
    //    } else if(oEvent.getSource().getSelectedIndex() == 1) {
    //      oDados.RespSimNao = "S";
    //      oDados.RespNewBegda = sap.ui.getCore().byId("idRespNewBegda").getValue();
    //      oDados.RespNewEndda = sap.ui.getCore().byId("idRespNewEndda").getValue();
    //    } else if(oEvent.getSource().getSelectedIndex() == 2) {
    //      oDados.RespSimNao = "N";
    //    } else if(oEvent.getSource().getSelectedIndex() == 3) {
    //      oDados.RespSimNao = "N";
    //      oDados.RespNewBegda = sap.ui.getCore().byId("idRespNewBegda").getValue();
    //      oDados.RespNewEndda = sap.ui.getCore().byId("idRespNewEndda").getValue();
    //    } else if(oEvent.getSource().getSelectedIndex() == 4) {
    //      oDados.RespSimNao = "N";
    //    }

    //    oDados.RespKey   = oEvent.getSource().getSelectedIndex();
    //    oDados.RespDescr = oEvent.getSource().getSelectedText();

    var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/");
    delete oDados.__metadata;

    oModel.update("/ShowMsgFeriasSet(Pernr='" + oDados.Pernr + "',Infty='" + oDados.Infty + "',Subty='" + oDados.Subty + "')", oDados, {
      success: function (oData3) {
          
          sap.ui.getCore().byId("idShowDialog").close();
          sap.ui.getCore().byId("idShowDialog").destroy();
      },
      error: function (oError) {
          jQuery.sap.require("sap.m.MessageBox");
          sap.m.MessageBox.show($(oError.response.body).find('message').first().text(), {
            title: 'Erro',
            icon: sap.m.MessageBox.Icon.ERROR
          });
        }
        //        error: function(oError) {
        //
        //        }
    });

  },

  onClose: function (oEvent) {},

  onPress: function (oEvent) {

    switch (oEvent.getSource().getId().split("-")[0]) {
    case "idShow":
      this.showDialog(oEvent);
      break;
    case "idAdd":
      this.showDialog(oEvent);
      break;
    case "idBtnCancel":

      sap.ui.getCore().byId("idDialogFeri").close();
      sap.ui.getCore().byId("idDialogFeri").destroy();
      if (sap.ui.getCore().byId("idTabS")) {
        sap.ui.getCore().byId("idTabS").destroy();
      }
      break;
    case "idBtnClose":

      sap.ui.getCore().byId("idDialogFeri").close();
      sap.ui.getCore().byId("idDialogFeri").destroy();
      if (sap.ui.getCore().byId("idTabS")) {
        sap.ui.getCore().byId("idTabS").destroy();
      }
      
      if(sap.ui.getCore().byId("idTempS")){
    	  sap.ui.getCore().byId("idTempS").destroy();
      }
      break;
    case "idBtnSave":
      sap.ui.getCore().byId("idDialogFeri").close();

      // STATUS
      //          1 Lançado
      //          2 Confirmado
      //          3 Suspensa
      //          4 Transferido

      var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/");
      var oDados = {};

      oDados.Pernr = sap.ui.getCore().byId('idmain').byId('idPernr').getText();
      oDados.Begda = sap.ui.getCore().byId("idBegdaFeri").getValue().substring(0,10)
      oDados.Endda = sap.ui.getCore().byId("idEnddaFeri").getValue();
      oDados.Saldo = sap.ui.getCore().byId("idSaldo").getValue();
      oDados.QtdDias = sap.ui.getCore().byId("idQtdeDias").getValue();
      oDados.Abono = sap.ui.getCore().byId("idAbono").getSelected();
      /*oDados.Abono = sap.ui.getCore().byId("idAbono").getValue();*/
      oDados.TpStatus = '1';
      //oDados.Quonr = sap.ui.getCore().byId("idQuonr").getValue();
      oDados.PerAquisitivo = sap.ui.getCore().byId("idPeriodoAquisitivo").getValue();
      oDados.PerConcessivo = sap.ui.getCore().byId("idPeriodoConcessivo").getValue();
      
      oDados.DecTerSal = sap.ui.getCore().byId("idCk13").getSelected();

      oModel.create("/CreateFeriSet", oDados, {
        success: function (oData) {
        	sap.ui.getCore().byId("idDialogFeri").destroy();
        	jQuery.sap.require("sap.m.MessageBox");
        	sap.m.MessageBox.show('Férias programada com sucesso', {
        		title: "Sucesso",
        		icon: sap.m.MessageBox.Icon.SUCCESS,
        	});
          	var oFilter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oData.Pernr), ];
	  	    oModel.read("/PeriodoAquiSet", {
	  	      async: true,
	  	      filters: oFilter,
	  	      success: function (oData) {
	  	    	
	  	        var json = new sap.ui.model.json.JSONModel(oData, "Periodos");
	  	        var oTable = sap.ui.getCore().byId("idTab");
	  	        var oTemp = sap.ui.getCore().byId("idTabItems");
	  	        oTable.destroyItems();
	  	        sap.ui.getCore().byId('idTab').setModel(json);
	  	
	  	        //  oTitle.setText('Minhas solicitações de workflow (' + oData.results.length + ")");
	  	        oTable.bindAggregation(
	  	          "items", {
	  	            path: "/results",
	  	            template: oTemp
	  	          });
	  	
	  	      },
	  	      error: function (error) {
	  	    	  
	  	      }
	  	    });

        },
        error: function (oError) {
            jQuery.sap.require("sap.m.MessageBox");
            sap.m.MessageBox.show($(oError.response.body).find('message').first().text(), {
              title: 'Erro',
              icon: sap.m.MessageBox.Icon.ERROR,
              onClose: function (oEvent) {
                sap.ui.getCore().byId("idDialogFeri").destroy();
              }
            });
          }

      });
      break;

    default:
      break;
    }

  },
  
  onDelProg: function(oEvent){

	  var sTable = sap.ui.getCore().byId("idTabS").getItems();
		
		  //if(sTable[0].getSelected()){
			  
			  if(sTable[0].getBindingContext().getObject().TpStatus !== "Aguardando aprovação do gestor"){
				  jQuery.sap.require("sap.m.MessageBox");
				  sap.m.MessageBox.error("Náo pode excluir programação de férias diferente de Aguardando aprovação do gestor", {
					    title: "Error",
					    onClose: null,
					    styleClass: "",
					    initialFocus: null,
					    textDirection: sap.ui.core.TextDirection.Inherit
					});
			  }
			  else{

				  var oDialog = new sap.m.Dialog('idConfirmDialog', {
					  icon : "sap-icon://circle-task-2",
			          title: "Confirmação de Exclusão",
			          showHeader: true,
			          contentWidth: "250px",
			          contentHeight: "200px",
			          resizable: true,
			          draggable: true,
			        });
				  
			      oDialog.addContent(new sap.m.Text({
			          text: "Deseja realmente excluir a programação de férias?"            
			        }));
			
			        var oBtnClose = new sap.m.Button({
			          text: "Não",
			          type: sap.m.ButtonType.Reject,
			          press: function (oEvent) {
			            sap.ui.getCore().byId("idConfirmDialog").close();
			            sap.ui.getCore().byId("idConfirmDialog").destroy();
			          }
			        });
			        var oBtnSalvar = new sap.m.Button({
			          text: "Sim",
			          type: sap.m.ButtonType.Accept,
			          press: function (oEvent) {
			        	  
			        	  sap.ui.getCore().byId("idConfirmDialog").close();
			              sap.ui.getCore().byId("idConfirmDialog").destroy();
			        	  
			        	  var vURL = "/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/";
			        	  var oData = new sap.ui.model.odata.ODataModel(vURL);
			        		
			        	  oData.setCountSupported(false);
			        		
			        	  loTable = sap.ui.getCore().byId("idTabS").getItems();
			        	  var value;
			        		
			        	  for(var i = 0; loTable.length; i++){
			        		  if(loTable[i].getSelected()){
			        				
			        			  var laPernr      = loTable[i].getBindingContext().getObject().Pernr;
			        			  var laBegda      = loTable[i].getBindingContext().getObject().Begda;
			        			  var laEndda      = loTable[i].getBindingContext().getObject().Endda;
			        			  var laPerAq      = loTable[i].getBindingContext().getObject().PerAquisitivo;
			        				
			        			  laBegda = laBegda.substring(0,2) + "." + laBegda.substring(3,5) + "." + laBegda.substring(6,10);
			        			  laEndda = laEndda.substring(0,2) + "." + laEndda.substring(3,5) + "." + laEndda.substring(6,10);
			        				
			        			  value = "/CreateFeriSet" + "(Pernr=" + "'" + laPernr + "'," + "Begda=" + "'" + laBegda + "'," + "Endda=" + "'" + laEndda + "')";
			        			  oData.remove(value, {
			        				  success: function(success){
			        						
			        					var sPernr = sap.ui.getCore().byId('idmain').byId('idPernr').getText();    				
			        				    var sBegda = laPerAq.substring(0, 10);
			        				    var sEndda = laPerAq.substring(12, 24);
			        			
			        					var sFilter = [new sap.ui.model.Filter('Quonr', sap.ui.model.FilterOperator.EQ, "112233"),
			        					    new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, sPernr),
			        					    new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, sBegda),
			        					    new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, sEndda)
			        					];
			        			
			    					  oData.read("/CreateFeriSet", {
			    					      async: true,
			    					      filters: sFilter,
			    					      success: function (oData) {
			    			
				    					       	var json = new sap.ui.model.json.JSONModel(oData, "Ferias");
				    					       	var oTable = sap.ui.getCore().byId("idTabS");
				    					       	var oTemp = sap.ui.getCore().byId("idTempS");
				    					       	oTable.destroyItems();   			        	
				    					       	sap.ui.getCore().byId('idTabS').setModel(json);
				    			
				    					       	oTable.bindAggregation(
				    					       	  "items", {
				    					       		  path: "/results",
				    					       		  template: oTemp
				    					         });
			    			
			    					        },
			    					        error: function (oError) {
				    			   				jQuery.sap.require("sap.m.MessageBox");
				    			   				sap.m.MessageBox.show($(oError.response.body).find('message').first().text(), {
				    			   					title: 'Erro',
				    			   					icon: sap.m.MessageBox.Icon.ERROR
				    			   				});
			    					        }
			    					      });
			    				      var oPernr = sap.ui.getCore().byId("idmain").byId('idPernr');
			    				      var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
			    				      sap.ui.getCore().byId("idmain").getController().get_newValues(oPernr, oPeriodo, sap.ui.getCore().byId("idIsProxy").setSelected());
			        					      
			        				},
			        				error: function(oError){
			        					jQuery.sap.require("sap.m.MessageBox");
			        					sap.m.MessageBox.show($(oError.response.body).find('message').first().text(), {
			        						title: 'Erro',
			        						icon: sap.m.MessageBox.Icon.ERROR
			        					});
			        				}
			        			});   		
			        		
			        		}
			        	}
			            
			          }
			        });
			
			      oDialog.addButton(oBtnSalvar);
			      oDialog.addButton(oBtnClose);
				  
				  oDialog.open();
		}
     //}
    
  },

  showDialog: function (oEvent) {

    var pTitle = "";
    if (oEvent.getSource().getId().split("-")[0] == "idShow") {
      pTitle = "Visualizar programação de férias";
    } else if (oEvent.getSource().getId().split("-")[0] == "idAdd") {
      pTitle = "Nova programação de férias";
    }

    var oDialog = sap.ui.getCore().byId("idDialogFeri");
    if (oDialog) {
      oDialog.destroy();
    }

    oDialog = new sap.m.Dialog({
      id: "idDialogFeri",
      //      icon : undefined, // sap.ui.core.URI
      title: pTitle, // string
      showHeader: true, // boolean, since 1.15.1
      type: sap.m.DialogType.Standard, // sap.m.DialogType
      state: sap.ui.core.ValueState.None, // sap.ui.core.ValueState, since 1.11.2
      stretchOnPhone: false, // boolean, since 1.11.2
      stretch: false, // boolean, since 1.13.1
      contentWidth: "auto", // sap.ui.core.CSSSize, since 1.12.1
      contentHeight: "400px", // sap.ui.core.CSSSize, since 1.12.1
      horizontalScrolling: true, // boolean, since 1.15.1
      verticalScrolling: true, // boolean, since 1.15.1
      resizable: true, // boolean, since 1.30
      draggable: true, // boolean, since 1.30
    });

    if (oEvent.getSource().getId().split("-")[0] == "idShow") {

      var oPanelShow = new sap.m.Panel();
      var oTableS = new sap.m.Table({
        id: "idTabS",
        mode: "MultiSelect"
      });
      
      var oColR1 = new sap.m.Column({
          width: "130px",
          visible: false,
          header: new sap.m.Text({
            text: "Periodo Aquisitivo"
          })
      });

      var oColS1 = new sap.m.Column({
        width: "130px",
        header: new sap.m.Text({
          text: "Data desde"
        })
      });
      var oColS2 = new sap.m.Column({
        width: "130px",
        header: new sap.m.Text({
          text: "Data até"
        })
      });
      var oColS3 = new sap.m.Column({
        width: "130px",
        header: new sap.m.Text({
          text: "Dias"
        })
      });
      var oColS4 = new sap.m.Column({
        width: "220px",
        header: new sap.m.Text({
          text: "Status"
        })
      });

      var oItems = new sap.m.ColumnListItem({
        id: "idTempS"
      });

      //          oItems.addCell(new sap.m.DatePicker({
      //              value : "{Begda}",
      //        //      editable : false,
      //              enabled: false,
      //        //      type : "Date",
      //              displayFormat : 'dd/MM/yyyy',
      //              valueFormat : "yyyy-MM-dd'T00:00:00'"
      //             }));
      
      oItems.addCell(new sap.m.Text({
        	text: "{PerAquisitivo}"
      }));

      oItems.addCell(new sap.m.Text({
        text: "{Begda}" /*{
          parts: [{
            path: "Begda",
            type: new sap.ui.model.type.String()
          }],
          formatter: function (fValue) {
            //
            var day = fValue.substring(8, 10);
            var month = fValue.substring(5, 7);
            var year = fValue.substring(0, 4);

            var Begda = day + "/" + month + "/" + year;

            return Begda;
          }
        }*/
      }));

      oItems.addCell(new sap.m.Text({
        text: "{Endda}"
      }));
      //          oItems.addCell(new sap.m.Text({text: "{QtdDias}"}));

      oItems.addCell(new sap.m.Text({
        text: {
          parts: [{
            path: "QtdDias",
            type: new sap.ui.model.type.String()
          }],
          formatter: function (fValue) {
            //
            if (fValue != '0.00000') {

              var dias_um = fValue.split(".", 1)[0];
              var dias_dois = fValue.split(".", 2)[1];

              if ((parseFloat(dias_um.trim())) < '10') {
                dias_um = "0" + dias_um.trim();
              }

              var QtdDias = dias_um.trim() + '.' + dias_dois.trim().substring(0, 2);

            }
            if (fValue == '0.00000') {
              QtdDias = ' ';
            }
            return QtdDias;
          }
        }
      }));

      oItems.addCell(new sap.m.Text({
        text: "{TpStatus}"
      }));
      
      oTableS.addColumn(oColR1);
      oTableS.addColumn(oColS1);
      oTableS.addColumn(oColS2);
      oTableS.addColumn(oColS3);
      oTableS.addColumn(oColS4);

      oPanelShow.addContent(oTableS);
      oDialog.addContent(oPanelShow);
      
      var oBtnDelete = new sap.m.Button({
          id: "idBtnDelete",
          //text: "Excluir",
          icon: "sap-icon://delete",
          type: sap.m.ButtonType.Emphasized,
          press: this.onDelProg
       });

       oDialog.addButton(oBtnDelete);

      var oBtnCancel = new sap.m.Button({
        id: "idBtnClose",
        text: "Fechar",
        type: sap.m.ButtonType.Reject,
        press: this.onPress
      });

      oDialog.addButton(oBtnCancel);

      var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/");

      var sDatas = oEvent.getSource().getParent().getCells()[2].mProperties.text;
      var sPernr = sap.ui.getCore().byId('idmain').byId('idPernr').getText();
      var sBegda = sDatas.substring(0, 10);
      var sEndda = sDatas.substring(13, 24);

      var sFilter = [new sap.ui.model.Filter('Quonr', sap.ui.model.FilterOperator.EQ, "112233"),
    	new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, sPernr),
        new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, sBegda),
        new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, sEndda)
      ];

      oModel.read("/CreateFeriSet", {
        async: true,
        filters: sFilter,
        success: function (oData) {

          var json = new sap.ui.model.json.JSONModel(oData, "Ferias");
          sap.ui.getCore().byId("idTabS").setModel(json);

          sap.ui.getCore().byId("idTabS").bindAggregation(
            "items", {
              path: "/results",
              template: sap.ui.getCore().byId("idTempS")
            });

        },
        error: function (oError) {

        }
      })

    } else if (oEvent.getSource().getId().split("-")[0] == "idAdd") {

      var oDadosEmpregado = sap.ui.getCore().getModel("dadosempregado");

      var oPanelDados = new sap.m.Panel({
        headerText: "Dados do período",
        expandable: true,
        expanded: true
      });
      var oPanelFerias = new sap.m.Panel({
        headerText: "Dados da férias",
        expandable: true,
        expanded: true
      });
      var oHLPD = new sap.ui.layout.HorizontalLayout();
      var oVCol1PD = new sap.ui.layout.VerticalLayout();
      var oVCol2PD = new sap.ui.layout.VerticalLayout();

      oVCol1PD.addContent(new sap.m.Label({
    	  text: "Período aquisitivo:"
      }));
      oVCol1PD.addContent(new sap.m.Input({
        id: "idPeriodoAquisitivo",
        width: "170px",
        editable: false,
        value: oEvent.getSource().getParent().mAggregations.cells[2].getProperty("text")
      }));
      
/*      oVCol1PD.addContent(new sap.m.Input({
          id: "idTipo",
          width: "100px",
          editable: false,
          value: oEvent.getSource().getParent().mAggregations.cells[3].getProperty("text")
        }));*/

      oVCol1PD.addContent(new sap.m.Label({
        text: "Período concessivo:"
      }));
      oVCol1PD.addContent(new sap.m.Input({
        id: "idPeriodoConcessivo",
        width: "170px",
        editable: false,
        value: oEvent.getSource().getParent().mAggregations.cells[3].getProperty("text")
      }));

      //      oVCol2PD.addContent(new sap.m.Label({text: "Total de dias:" }));
      //      oVCol2PD.addContent(new sap.m.Input({width: "50px", editable: false, value: oEvent.getSource().getParent().mAggregations.cells[4].getProperty("text") }));
      oVCol2PD.addContent(new sap.m.Label({
        text: "Total de dias:"
      }));
      oVCol2PD.addContent(new sap.m.Input({
        id: "idSaldo",
        width: "70px",
        editable: false,
        value: oEvent.getSource().getParent().mAggregations.cells[5].getProperty("text")
      }));
      oVCol2PD.addContent(new sap.m.Label({
        text: "Saldo"
      }));
      oVCol2PD.addContent(new sap.m.Input({
        width: "70px",
        editable: false,
        value: oEvent.getSource().getParent().mAggregations.cells[4].getProperty("text")
      }));
/*      oVCol2PD.addContent(new sap.m.Label({
        text: "Quonr:",
        visible: false
      }));
      oVCol2PD.addContent(new sap.m.Input({
        id: "idQuonr",
        visible: false,
        width: "50px",
        editable: false,
        value: oEvent.getSource().getParent().mAggregations.cells[6].getProperty("text")
      }));*/

      oHLPD.addContent(oVCol1PD);
      oHLPD.addContent(new sap.m.ToolbarSpacer({
        width: "50px"
      }));
      oHLPD.addContent(oVCol2PD);

      // DADOS FERIAS
      var oHLPF = new sap.ui.layout.HorizontalLayout();
      var oVCol1PF = new sap.ui.layout.VerticalLayout();
      var oVCol2PF = new sap.ui.layout.VerticalLayout();
      var oVCol3PF = new sap.ui.layout.VerticalLayout();

      oVCol1PF.addContent(new sap.m.Label({
        text: "Data de início:"
      }));
      oVCol1PF.addContent(new sap.m.DatePicker({
        id: "idBegdaFeri",
        width: "120px",
        displayFormat: "dd/MM/yyyy",
        valueFormat: "yyyy-MM-dd'T'hh:mm:ss",
        //    change      : [oController.ChDate, oController]
      }));
      
      oVCol2PF.addContent(new sap.m.Label({
    	  text: "Data fim:"
      }));
      
      oVCol2PF.addContent(new sap.m.Input({
          id: "idEnddaFeri",
          width: "100px",
          editable: false
        }));

      oVCol2PF.addContent(new sap.m.Label({
    	  text: ""
      }));

      oVCol1PF.addContent(new sap.m.Label({
        text: "Dias:"
      }));
      oVCol1PF.addContent(new sap.m.ComboBox({
        id: "idQtdeDias",
        width: "80px",
        editable: true,
        items: [
          new sap.ui.core.Item({
            text: "10", // string
            enabled: true, // boolean
            textDirection: sap.ui.core.TextDirection.Inherit, // sap.ui.core.TextDirection
            key: "10", // string
          }),
          new sap.ui.core.Item({
            text: "15", // string
            enabled: true, // boolean
            textDirection: sap.ui.core.TextDirection.Inherit, // sap.ui.core.TextDirection
            key: "15", // string
          }),
          new sap.ui.core.Item({
            text: "20", // string
            enabled: true, // boolean
            textDirection: sap.ui.core.TextDirection.Inherit, // sap.ui.core.TextDirection
            key: "20", // string
          }),
          new sap.ui.core.Item({
            text: "30", // string
            enabled: true, // boolean
            textDirection: sap.ui.core.TextDirection.Inherit, // sap.ui.core.TextDirection
            key: "30", // string
          }),
        ],
        change: this.onChange
      }));

      /*oVCol2PF.addContent(new sap.m.Label({
    	  text: "Data fim:"
      }));
      
      oVCol2PF.addContent(new sap.m.Input({
        id: "idEnddaFeri",
        width: "100px",
        editable: false
      }));*/

      oVCol3PF.addContent(new sap.m.CheckBox({
		  id: "idCk13",
		  width: "100px",
		  text: "13°",
		  selected: false,
		  editable: true,
		  visible: true
      }));
            
      /*oVCol2PF.addContent(new sap.m.Label({
        text: "Abono:",
        visible: false,
      }));*/
            
      oVCol2PF.addContent(new sap.m.CheckBox({
    	  id: "idAbono",
    	  text: "Abono",
    	  width: "100px",
    	  selected: false,
    	  editable: true,
    	  visible: true
      }));
      
      /*oVCol2PF.addContent(new sap.m.ComboBox({
    	  id: "idAbono",
          width: "80px",
          editable: true,
          visible: false,
          items: [
            new sap.ui.core.Item({
              text: "10", // string
              enabled: true, // boolean
              textDirection: sap.ui.core.TextDirection.Inherit, // sap.ui.core.TextDirection
              key: "10", // string
            }),
            new sap.ui.core.Item({
              text: "15", // string
              enabled: true, // boolean
              textDirection: sap.ui.core.TextDirection.Inherit, // sap.ui.core.TextDirection
              key: "15", // string
            }),
            new sap.ui.core.Item({
              text: "20", // string
              enabled: true, // boolean
              textDirection: sap.ui.core.TextDirection.Inherit, // sap.ui.core.TextDirection
              key: "20", // string
            }),
            new sap.ui.core.Item({
              text: "30", // string
              enabled: true, // boolean
              textDirection: sap.ui.core.TextDirection.Inherit, // sap.ui.core.TextDirection
              key: "30", // string
            }),
          ],
        })); */
      
      if(oDadosEmpregado){

	      if (oDadosEmpregado.oData.Persg === "1") {
	        oVCol2PF.addContent(new sap.m.Label({
	          id: "idLblFerias",
	          text: "Férias Indenizadas:",
	          visible: true
	        }));
	        oVCol2PF.addContent(new sap.m.CheckBox({
	          id: "idCkbFerias",
	          width: "100px",
	          editable: true,
	          visible: true
	        }));
	      }
      
      }

      oHLPF.addContent(oVCol1PF);
      oHLPF.addContent(new sap.m.ToolbarSpacer({
        width: "50px"
      }));
      oHLPF.addContent(oVCol2PF);
      
      oHLPF.addContent(oVCol3PF);

      oPanelDados.addContent(oHLPD);
      oDialog.addContent(oPanelDados);
      oPanelFerias.addContent(oHLPF);
      oDialog.addContent(oPanelFerias);

      var oBtnCancel = new sap.m.Button({
        id: "idBtnCancel",
        text: "Cancelar",
        type: sap.m.ButtonType.Reject,
        press: this.onPress
      });
      var oBtnSave = new sap.m.Button({
        id: "idBtnSave",
        text: "Salvar",
        type: sap.m.ButtonType.Accept,
        press: this.onPress
      });

      oDialog.addButton(oBtnSave);
      oDialog.addButton(oBtnCancel);

    }

    oDialog.open();

  },

  onChange: function (oEvent) {

    var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/");
    var date = sap.ui.getCore().byId("idBegdaFeri").getValue().substr(0, 10);
    var days = this.getValue();

    var filter = [new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, date), //
      new sap.ui.model.Filter('QtdeDias', sap.ui.model.FilterOperator.EQ, days), //

    ];
    oModel.read("/GetEnddaFeriSet", {
      async: true,
      filters: filter,
      success: function (oData) {

        sap.ui.getCore().byId("idEnddaFeri").setValue(oData.results[0].Endda);

      },
      error: function (oError) {
        jQuery.sap.require("sap.m.MessageBox");
        sap.m.MessageBox.show($(oError.response.body).find('message').first().text(), {
          title: 'Erro',
          icon: sap.m.MessageBox.Icon.ERROR
        });
      }

    });

  },

  /**
   * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
   * (NOT before the first rendering! onInit() is used for that one!).
   * @memberOf zhr_br_time_freq.PROG.ProgFerias
   */
  //  onBeforeRendering: function() {
  //
  //  },

  /**
   * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
   * This hook is the same one that SAPUI5 controls get after being rendered.
   * @memberOf zhr_br_time_freq.PROG.ProgFerias
   */
  //  onAfterRendering: function() {
  //
  //  },

  /**
   * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
   * @memberOf zhr_br_time_freq.PROG.ProgFerias
   */
  //  onExit: function() {
  //
  //  }

});