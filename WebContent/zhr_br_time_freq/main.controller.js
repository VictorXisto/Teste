sap.ui.controller("zhr_br_time_freq.main", {
  /**
   * Called when a controller is instantiated and its View controls (if available) are
   * already created. Can be used to modify the View before it is displayed, to bind event
   * handlers and do other one-time initialization.
   * 
   * @memberOf zhr_br_time_freq.main
   */

  onInit: function() {
    
  var sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage();
    
    // ComboBox Período
    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);

    var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
    var oItemTemplate = new sap.ui.core.ListItem({
      key: "{Mmaaaa}",
      text: "{Mmmmaaaa}", 
    });
    new sap.m.CheckBox("idIsProxy")
    oPeriodo.setModel(oData);
    oPeriodo.bindAggregation('items', '/PeriodsSet', oItemTemplate, null, null);
    
    var oGlobalFieldsModel = new sap.ui.model.json.JSONModel({pernr: null, periodo: null});
    this.getView().setModel(oGlobalFieldsModel, "globals");

    // Informações Empregado Inicial
    var vDate = new Date();
    //            var vPeriod = vDate.getMonth() + '' + vDate.getFullYear();
    //            var vPeriod = ("0" + (vDate.getMonth() + 1)).slice(-2) + '' + vDate.getFullYear();
    oData.read("/PeriodsSet('999999')", null, null, false, function(oDataSuccess) {
      oPeriodo.setSelectedKey(oDataSuccess.Mmaaaa);
      
      var oLogin = new sap.m.Text({
        id: 'idLogin'
      });
      var oGestor = new sap.m.Text({
        id: 'idGestor'
      });
      var oGestorSobre = new sap.m.Text({
        id: 'idGestorSobre'
      });
      var oGestorSubst = new sap.m.Text({
        id: 'idGestorSubst'
      });
      var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
      if (oPernr.getText() == '') {
        oPernr.setText('99999999');
      };

      var oLocked = new sap.m.Text({
        id: 'idLocked',
        text: oDataSuccess.Notavailable
      });

      var oLayout = sap.ui.getCore().byId('idLayout');

      oData.read("/EmployedSet(Pernr='" + oPernr.getText() + "',Mmaaaa='" + oDataSuccess.Mmaaaa + "')", null, null, false, function(oDataSuccess) {
        oPernr.setText(oDataSuccess.Pernr);
        oLogin.setText(oDataSuccess.PernrLogin);
        oGestor.setText(oDataSuccess.Gestor);
        oGestorSobre.setText(oDataSuccess.Sobre);
        oGestorSubst.setText(oDataSuccess.Subst);
        sap.ui.getCore().Persg = oDataSuccess.Persg;

        sap.ui.getCore().byId('Name').setText(oDataSuccess.Cname);

        if (oDataSuccess.Proxy != null) {
          sap.ui.getCore().byId('idButtonProxy').setVisible(true);
        } else {
          sap.ui.getCore().byId('idButtonProxy').setVisible(false);
        }
        
        
		if (oDataSuccess.Gestor == 'true') {
			sap.ui.getCore().byId("aprovacoes").setVisible(true);
		}
		else{
			sap.ui.getCore().byId("aprovacoes").setVisible(false);
		}
		
/*		if (oDataSuccess.Gestor == 'X'){
			sap.ui.getCore().byId("frequencia").setVisible(true);
		}
		else{
			sap.ui.getCore().byId("frequencia").setVisible(false);
		}*/
      });

    });

    // Inicia SetModel Banco de Horas
    var oBanco = sap.ui.getCore().byId("ListBancoHoras");
    oBanco.setModel(oData);

    // Atualiza Informações das Abas
    var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
    this.get_newValues(oPernr, oPeriodo, sap.ui.getCore().byId("idIsProxy").setSelected());
  },
  
  onNavPress: function(){
      sap.ui.getCore().byId("PageDetail").fireNavButtonPress();  
  },

  openAutoDelegate: function() {

    jQuery.sap.require("sap.m.MessageBox");
    var oPage = new sap.ui.core.HTML({
      content: '<iframe src="/sap/bc/ui5_ui5/sap/zhr_br_autodelg/index.html' + window.location.search + '" width="100%" height="100%" ' + ' style="margin-top: -1rem; margin-left: -1rem; ' + ' position: absolute; overflow: none;" ' + ' frameborder=0></iframe+>'});

    var oDialog = new sap.m.Dialog({
      showHeader: false,
      resizable: true,
      draggable: true,
      horizontalScrolling: false,
      verticalScrolling: false,
      stretch: false,
      contentWidth: '90%',
      contentHeight: '90%',
      buttons: [],
      content: oPage
    });

    oDialog.addButton(new sap.m.Button({
      text: 'Fechar',
      icon: sap.ui.core.IconPool.getIconURI('decline'),
      press: function() {
    	  
        oPage.destroy();
        oDialog.destroyContent();
        oDialog.destroyButtons();
        oDialog.close();
      }
    }));

    oDialog.open();
  },

  openProxy: function() {

    new sap.m.Dialog({
      id: "idDialogProxy",
      title: "Selecionar usuário-alvo",
      resizable: true,
      contentWidth: "20%",
      contentHeight: "20%",
      content: [new sap.m.Label({
        text: "Forneça o nome do usuário-alvo:",
      }), new sap.m.Input("idProxy", {
        showSuggestion: true,
        filterSuggests: false,
        showTableSuggestionValueHelp: true,
        suggestionItemSelected: [function(oEvent) {
          oEvent.oSource.setTooltip(oEvent.mParameters.selectedItem.getKey())
        }, this],
        suggest: [function(oEvent) {
          var binding = oEvent.oSource.getBinding("suggestionItems");
          if (!oEvent.mParameters.suggestValue) {
            binding.filter([]);
          } else {
            binding.filter([new sap.ui.model.Filter([new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, oEvent.mParameters.suggestValue),//
            new sap.ui.model.Filter("Cname", sap.ui.model.FilterOperator.Contains, oEvent.mParameters.suggestValue)], false)])
          }
        }, this],
      }).setModel(new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/"))//
      .bindAggregation('suggestionItems', '/SFSFProxySet', new sap.m.SuggestionItem({
        text: "{Cname}",
        key: "{Pernr}"
      })),

      new sap.m.MessageStrip({
        text: "Letras maiúsculas e minúsculas",
      })],
      endButton: new sap.m.Button({
        tooltip: "OK",
        text: "OK",
        type: sap.m.ButtonType.Emphasized,
        press: [function(oEvent) {
          if (sap.ui.getCore().byId("idProxy").getTooltip() != null) {
            // Atualiza Informações das Abas
            var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
            var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
            sap.ui.getCore().byId("idLogin").setText(sap.ui.getCore().byId("idProxy").getTooltip())
            oPernr.setText(sap.ui.getCore().byId("idProxy").getTooltip());
            sap.ui.getCore().byId("idIsProxy").setSelected(true)
            sap.ui.getCore().byId("idmain").getController().get_newValues(oPernr, oPeriodo, sap.ui.getCore().byId("idIsProxy").getSelected());
            oEvent.oSource.getParent().close()
          } else {
            sap.m.MessageToast.show("O usuário-alvo precisa ser selecionado", {
              duration: 3000
            })
          }
        }, this]
      }),
      leftButton: new sap.m.Button({
        tooltip: "Cancelar",
        text: "Cancelar",
        press: [function(oEvent) {
          oEvent.oSource.getParent().close()
        }, this]
      }),
      afterClose: [function(oEvent) {
        oEvent.oSource.destroy();
      }, this]
    }).open()
  },

  get_Employed_Information: function(oPernr, oPeriodo, isProxy) {

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);

    // Atualiza Time
    var oCreate = {};
    oCreate.Pernr = oPernr.getText();
    oCreate.Mmaaaa = oPeriodo.getSelectedKey();
    oData.create("/EmployedSet", oCreate, null, null, null);

    oData.read("/PeriodsSet('" + oPeriodo.getSelectedKey() + "')", null, null, false, function(oDataSuccess) {

      // Atualiza Banco de Horas
      var oTable = sap.ui.getCore().byId("ListBancoHoras");
      var oTemplate = sap.ui.getCore().byId("ColumnListBancoHoras");
      var filter = [new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oPernr.getText()), new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, oDataSuccess.Begda), new sap.ui.model.Filter('Endda',
 sap.ui.model.FilterOperator.EQ, oDataSuccess.Endda)];
      oTable.bindAggregation("items", '/BancoHorasSet', oTemplate, null, filter);

      oData.read("/EmployedSet(Pernr='" + oPernr.getText() + "',Mmaaaa='" + oDataSuccess.Mmaaaa + "')", null, null, false, function(oDataSuccess) {
        sap.ui.getCore().byId('idmain').byId('idPernr').setText(oDataSuccess.Pernr);
        sap.ui.getCore().byId('idmain').byId('idNome').setText(oDataSuccess.Cname);
        sap.ui.getCore().byId('idmain').byId('idHorario').setText(oDataSuccess.Schkz);
        sap.ui.getCore().byId('idmain').byId('idUO').setText(oDataSuccess.Orgeh + ' - ' + oDataSuccess.Orgtx);
        sap.ui.getCore().byId('idmain').byId('idPosicao').setText(oDataSuccess.Plans);
        sap.ui.getCore().byId('idmain').byId('idDPosicao').setText(oDataSuccess.Platx);
        sap.ui.getCore().byId('idmain').byId('idSubarea').setText(oDataSuccess.Btrtl + ' - ' + oDataSuccess.Btext);


    var oModel = new sap.ui.model.json.JSONModel();
    oModel.setData(oDataSuccess);
    sap.ui.getCore().byId('objectHeader').setObjectTitle(oDataSuccess.Cname);
    sap.ui.getCore().byId('objectHeader').setObjectSubtitle(oDataSuccess.Platx + ', ' + oDataSuccess.Orgtx + ', ' + oDataSuccess.Btext);
    //sap.ui.getCore().byId('objectHeader').setObjectImageURI("https://hcm4preview.sapsf.com/eduPhoto/view?companyId=C0004831526T1&photo_type=liveProfile&user_id=" + oDataSuccess.Userid.replace(/^0+/, ''));
    sap.ui.getCore().byId('objectHeader').setObjectImageURI("https://hcm4preview.sapsf.com/eduPhoto/view?companyId=C0004831526T1&photo_type=liveProfile&user_id=" + oDataSuccess.Userid);
    sap.ui.getCore().byId('idmain').byId('idLayout').addHeaderContent(new sap.m.Text({text: "" }))   
//  var oVLayout = new sap.ui.layout.VerticalLayout();
//  oVLayout.addContent(new sap.m.Text({text:oDataSuccess.Orgtx }));
//  oVLayout.addContent(new sap.m.Text({text:oDataSuccess.Btext }));
//  sap.ui.getCore().byId('idmain').byId('idLayout').addHeaderContent(oVLayout);

        if (isProxy == true && oDataSuccess.Proxy == "false") {
          sap.ui.getCore().byId("idLocked").setText("X")
        } else if (isProxy == true && oDataSuccess.Proxy == "true") {
          sap.ui.getCore().byId("idLocked").setText("")
        }

      });
    });

  },

  // ================================================================================
  // Função seleção Subordinados e UO
  // ================================================================================
  getinfGestor: function(oPeriodo) {

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);

    var filter = [new sap.ui.model.Filter('Option', sap.ui.model.FilterOperator.EQ, '1'),//
    new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("idLogin").getText()),//
    new sap.ui.model.Filter('Periodo', sap.ui.model.FilterOperator.EQ, oPeriodo.getSelectedKey()),//
    new sap.ui.model.Filter('Delegate', sap.ui.model.FilterOperator.EQ, true)//
    ];
    oData.read("/MenuSet", {
      filters: filter,
      success: function(oData) {
        var json = new sap.ui.model.json.JSONModel(oData);
        var oTable = sap.ui.getCore().byId("ListGestorOrgeh");
        var oTemplate = sap.ui.getCore().byId("ColumnListIGestorOrgeh");
        oTable.destroyItems();
        oTable.setModel(json);
        oTable.bindAggregation("items", {
          path: "/results",
          template: oTemplate
        });
      }
    });

  },
  
  onCheckgestor: function(oPernr){
  	
    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);
  	
    oData.read("/PeriodsSet('999999')", null, null, false, function(oDataSuccess) {

        oData.read("/EmployedSet(Pernr='" + oPernr.getText() + "',Mmaaaa='" + oDataSuccess.Mmaaaa + "')", null, null, false, function(oDataSuccess) {
        	
        	sap.ui.getCore().byId('Name').setText(oDataSuccess.Cname);
          
	  		if (oDataSuccess.Gestor == 'true') {
	  			sap.ui.getCore().byId("aprovacoes").setVisible(true);
	  		}
	  		else{
	  			sap.ui.getCore().byId("aprovacoes").setVisible(false);
	  		}
	  		
	  		if (oDataSuccess.Pernr !== oDataSuccess.PernrLogin) {
	  			sap.ui.getCore().byId("frequencia").setVisible(true);
	  		}
	  		else{
	  				sap.ui.getCore().byId("frequencia").setVisible(false);
	  		}
	  		
	  		if (oDataSuccess.Pernr !== oDataSuccess.PernrLogin) {
	  			sap.ui.getCore().byId("divergencia").setVisible(true);
	  		}
	  		else{
	  			if(oDataSuccess.Gestor === "X") {
	  				sap.ui.getCore().byId("divergencia").setVisible(false);
	  			}
	  			else{
	  				sap.ui.getCore().byId("divergencia").setVisible(true);
	  			}

	  		}

        });

      });
  },

  // ================================================================================
  // Função seleção de novos valores
  // ================================================================================
  get_newValues: function(oPernr, oPeriodo, isProxy) {
	this.onCheckgestor(oPernr);
    this.getinfGestor(oPeriodo);
    
    this.getView().getModel("globals").setProperty("/pernr", oPernr);
    this.getView().getModel("globals").setProperty("/periodo", oPeriodo);
    
    this.get_Employed_Information(oPernr, oPeriodo, isProxy);
    sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").get_Frequency_Data(oPernr, oPeriodo);
    sap.ui.controller("zhr_br_time_freq.DIVERG.Divergencia").get_Divergence_Data(oPernr, oPeriodo);
    sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").get_Marcacao_Data(oPernr, oPeriodo);
    sap.ui.controller("zhr_br_time_freq.TAB3.Sobreaviso").get_SobreAviso_Data(oPernr, oPeriodo);
    sap.ui.controller("zhr_br_time_freq.TAB4.AprovHE").get_Approval_Data(oPernr, oPeriodo);
    sap.ui.controller("zhr_br_time_freq.PROG.ProgFerias").getPeriodoAquisitivo(oPernr, oPeriodo);
    //sap.ui.controller("zhr_br_time_freq.RELA.Relatorios").onInit();
    sap.ui.controller("zhr_br_time_freq.APROV.Aprovacoes").get_Aprovacoes_Data(oPernr, oPeriodo);
  },

  get_espelho: function() {
	  
	var that = this;
	
    var oPernr = sap.ui.getCore().byId('idmain').byId('idPernr');
    var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');

    var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
    var oData = new sap.ui.model.odata.ODataModel(vURL);

    oData.read("/PeriodsSet('" + oPeriodo.getSelectedKey() + "')", null, null, false, function(oDataSuccess) {    	
    	
    	var oBar =	new sap.m.Toolbar({	
    		content : [ new sap.m.Button({text: "Voltar", type: sap.m.ButtonType.Reject, press: function(oEvent){
				
				sap.ui.getCore().byId("idDialogEspelho").close();  
			},}),			
			]
    		
    	});

      var oDialogEspelho = new sap.m.Dialog("idDialogEspelho",{
        contentWidth: '95%',
        contentHeight: '95%',
        stretch: true,
        showHeader: false,
        customHeader: oBar,
        content: [new sap.ui.core.HTML({id: "idFrameEspelho",
          content: '<iframe src="/sap/bc/ui5_ui5/sap/zhr_br_reponew/index2.html' + window.location.search + '&hasSel=false&isPdf=true&ServiceName=ZCL_HR_BR_REPORTS_UI5_GW_SRV&ServiceSet=EspelhoPontoSet' + '&Begda=' + oDataSuccess.Begda + '&Endda=' +
oDataSuccess.Endda + '&selected_user=' + oPernr.getText() + '&Report=ESPT' + '" width="100%" height="100%" style="position: absolute; overflow: none;" frameborder=0></iframe>'
        })],
        draggable: true,
        resizable: true,
        title: 'Visualização de Espelho de Ponto',
/*        buttons: [new sap.m.Button({
          text: 'Fechar',
          press: [function(oEvent) {
//        	  that.onCloseDialogEspelho();
//        	  sap.ui.getCore().onDialogEspelho();
            oDialogEspelho.close();
          }]
        })],*/
        afterClose: [function(oEvent) {
          oDialogEspelho.destroy();
        }]
      });

      oDialogEspelho.open();

    });

  },
  
  onDialogEspelho: function() {
	sap.ui.getCore().byId("idDialogEspelho").close();  
  },
  
/*	openRelatorios: function() {
		var sURL = 'http://blvsaps4hd1.belagricola.local:8000/sap/bc/gui/sap/its/webgui?~transaction=PT_BAL00 user=R.FARIAS&password=Hrst@2020 USR02-BNAME=DDIC';
		

		//var oButton = new sap.ui.commons.Button("b1");

		//oButton.setText("Call Transaction SU01");

		//oButton.attachPress(function() {

		window.open(sURL);

		//});
	},*/

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's View is
 * re-rendered (NOT before the first rendering! onInit() is used for that one!).
 * 
 * @memberOf zhr_br_time_freq.main
 */
// onBeforeRendering : function() {
//
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the same one
 * that SAPUI5 controls get after being rendered.
 * 
 * @memberOf zhr_br_time_freq.main
 */
// onAfterRendering : function() {
//
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and finalize
 * activities.
 * 
 * @memberOf zhr_br_time_freq.main
 */
// onExit: function() {
//
// }
});
// #
// sourceURL=http://lnxpodecc01.dasa.net:8000/sap/bc/ui5_ui5/sap/zhr_br_pt_freq/zhr_br_time_freq/main.controller.js