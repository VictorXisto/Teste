sap.ui.jsview("zhr_br_time_freq.main", {

  /**
   * Specifies the Controller belonging to this View. In the case that it is not implemented, or
   * that "null" is returned, this View does not have a Controller.
   * 
   * * xisto aqui fazendo merda
   * @memberOf zhr_br_time_freq.main
   */
  getControllerName: function() {
    return "zhr_br_time_freq.main";
  },

  /**
   * Is initially called once after the Controller has been instantiated. It is the place where the
   * UI is constructed. Since the Controller is given to this method, its event handlers can be
   * attached right away.
   * 
   * @memberOf zhr_br_time_freq.main
   */
  createContent: function(oController) {

    // ================================================================================
    // Listas / Tabelas
    // ================================================================================
    oListBancoHoras = new sap.m.List("ListBancoHoras", {
      columns: [new sap.m.Column({
        width: "35%",
        header: new sap.m.Label({
          text: 'Horas Positivas',
        })
      }), new sap.m.Column({
        width: "35%",
        header: new sap.m.Label({
          text: 'Horas Negativas',
        })
      }), new sap.m.Column({
        width: "30%",
        header: new sap.m.Label({
          text: 'Saldo',
        })
      })]
    });

    // ================================================================================
    // Itens/Colunas - Listas
    // ================================================================================
    var oColumnListBancoHoras = new sap.m.ColumnListItem("ColumnListBancoHoras", {
      unread: false,
      cells: [new sap.m.Label({
        text: "{QtdePositivas}"
      }), new sap.m.Label({
        text: "{QtdeNegativas}"
      }), new sap.m.Label({
        text: "{Saldo}"
      })],
    });

    var oSplit = new sap.m.SplitApp(this.createId("splitApp"),{
    	width: "100%",
    	mode: sap.m.SplitAppMode.HideMode,
    	masterPages: [sap.ui.jsview('idGest', "zhr_br_time_freq.GEST.Gest")],
    	detailPages: [new sap.m.Page(this.createId('PageDetail'), {
        showHeader: true,
        content: [new sap.m.Toolbar({
          height: "60px",
          design: sap.m.ToolbarDesign.Info,
          content: [new sap.m.ToggleButton({
            /*text: 'Voltar', 
            type: sap.m.ButtonType.Neutral,
            icon: 'sap-icon://nav-back',
            iconFirst: true,
            press: function(oEvent) {
              window.history.back();
            }*/
          }), new sap.m.Label({
            text: "Período"
          }), new sap.m.ComboBox(this.createId("idPeriodo"), {
            path: "/items",
            template: new sap.ui.core.Item({
              key: "{MMAAAA}",
              text: "{MMMMAAAA}"
            }),
            selectionChange: function(oEvent) {
              var vURL = '/sap/opu/odata/SAP/ZCL_HR_BR_TIME_FREQ_SRV/';
              var oData = new sap.ui.model.odata.ODataModel(vURL);
              oData.read("/PeriodsSet('" + oController.byId('idPeriodo').getSelectedKey() + "')", null, null, false, function(oDataSuccess) {
                sap.ui.getCore().byId('idLocked').setText(oDataSuccess.Notavailable);
              });
              oController.get_newValues(oController.byId('idPernr'), oController.byId('idPeriodo'), sap.ui.getCore().byId("idIsProxy").getSelected());
            }
          }),

           new sap.m.ToolbarSpacer(),

         /* new sap.m.Button("idButtonProxy", {
            tooltip: "Representar",
            visible: true,
            icon: 'sap-icon://company-view',
            press: oController.openProxy,
          }), */

          ]
        }),

        new sap.uxap.ObjectPageLayout(this.createId("idLayout"),{
        alwaysShowContentHeader : true,
        showTitleInHeaderContent : true,
        headerTitle :         new sap.uxap.ObjectPageHeader({ id:'objectHeader', headerDesign:"Light",
          //      objectTitle:"{Header>/Cname}",
                showTitleSelector:true,
                showMarkers:false,
                markFavorite:false,
                markFlagged:false,
                markChanges:false,
            //  objectImageURI:"https://hcm19.sapsf.com/eduPhoto/view?companyId=blaufarmac&photo_type=liveProfile&user_id={Header>/Pernr}",
                objectImageURI:"https://hcm4preview.sapsf.com/eduPhoto/view?companyId=C0004831526T1&photo_type=liveProfile&user_id={Header>/Pernr}",
                objectImageShape:"Circle",
                isObjectIconAlwaysVisible:false,
                isObjectTitleAlwaysVisible:false,
                isObjectSubtitleAlwaysVisible:false,
                isActionAreaAlwaysVisible:true,
                titleSelectorPress:[ function(oEvent){
                oEvent.oSource.oParent.oParent.oParent.oParent.showMaster();
                }],
                showPlaceholder:true }),
          }),
        new sap.m.Label({heigth:"140px"}),
        sap.m.Panel({
          visible: false,
          headerText: "Informações do Colaborador",
          expandable: true,
          expanded: false,
          content: [new sap.ui.layout.form.SimpleForm({
            maxContainerCols: 2,
            editable: true,
            content: [new sap.ui.core.Title({
              text: "Dados pessoais"
            }), new sap.m.Label({
              text: "Matricula"
            }), new sap.m.Text(this.createId("idPernr")), new sap.m.Label({
              text: "Nome"
            }), new sap.m.Text(this.createId("idNome")), new sap.m.Label({
              text: "Horário"
            }), new sap.m.Text(this.createId("idHorario")), new sap.ui.core.Title({
              text: "Atribuição organizacional"
            }), new sap.m.Label({
              text: "Departamento"
            }), new sap.m.Text(this.createId("idUO")), new sap.m.Label({
              text: "Posição"
            }), new sap.m.Text(this.createId("idPosicao")), new sap.m.Label({
              text: "Descrição"
            }), new sap.m.Text(this.createId("idDPosicao")), new sap.m.Label({
              text: "Subárea de RH"
            }), new sap.m.Text(this.createId("idSubarea"))],
          })],
        }),
/*        new sap.m.Button("idRelatorios", {
        	text: "Relatórios",
            tooltip: "Relatórios",
            visible: true,
            icon: 'sap-icon://company-view',
            press: oController.openRelatorios,
          }),*/
         new sap.m.Panel({
          headerText: "Saldo de Horas",
          expandable: true,
          visible: false,
          expanded: false,
          content: [oListBancoHoras, oColumnListBancoHoras]
        }), new sap.m.IconTabBar({
          expandable: false,
          items: [
            new sap.m.IconTabFilter("aprovacoes", {
            text: "Aprovações",
            icon: "sap-icon://approvals",
            tooltip: 'Visualize aqui todas as requisições que necessitam sua aprovação',
            content: [sap.ui.jsview("idAprov", "zhr_br_time_freq.APROV.Aprovacoes")]}),

            new sap.m.IconTabFilter("historico", {
            text: "Histórico",
            tooltip: 'Essa aba permite visualizar todos os ajustes solicitados no período, informando além de detalhes se houve aprovação, reprovação ou ainda está pendente de aprovação',
            icon: "sap-icon://work-history",
            content: [sap.ui.jsview("idHisto", "zhr_br_time_freq.HISTO.Historico")]}),

            new sap.m.IconTabFilter("frequencia", {
            tooltip: 'Utilize essa aba para justificar atrasos ou faltas através de motivos, além de visualizar o horário diário e permitir ajustar as marcações e outras informações já cadastradas no sistema',
            text: "Frequência",
            icon: "sap-icon://timesheet",
            content: [sap.ui.jsview('idFreq', "zhr_br_time_freq.TAB1.Frequencia")]}),
            
            new sap.m.IconTabFilter("divergencia", {
            tooltip: 'Utilize essa aba para justificar atrasos ou faltas através de motivos, além de visualizar o horário diário e permitir ajustar as marcações e outras informações já cadastradas no sistema',
            text: "Divergência",
            icon: "sap-icon://timesheet",
            content: [sap.ui.jsview('idDive', "zhr_br_time_freq.DIVERG.Divergencia")]}),

            new sap.m.IconTabFilter("marcacoes", {
            tooltip: 'Essa aba permite realizar ajustes em marcações, além de visualizar o horário diário e as marcações já cadastradas no sistema',
            text: "Exceções",
            visible: false,
            icon: "sap-icon://time-account",
            content: [sap.ui.jsview("idMarc", "zhr_br_time_freq.TAB2.Marcacao")]}),

            new sap.m.IconTabFilter("sobreaviso", {
            text: "Sobreaviso",
            visible: false,
            icon: "sap-icon://time-entry-request",
            content: [sap.ui.jsview("idSobr", "zhr_br_time_freq.TAB3.Sobreaviso")]}),

            new sap.m.IconTabFilter("horas_extras", {
            tooltip: 'Visualize aqui todas as horas extras aprovadas que foram solicitadas pelo seu gestor',
            text: "Aprov. HE",
            visible: false,
            icon: "sap-icon://time-overtime",
            content: [sap.ui.jsview('idApro', "zhr_br_time_freq.TAB4.AprovHE")]}),
            
            new sap.m.IconTabFilter("prog_ferias", {
            width: "150px",
            tooltip: 'Programar férias',
            text: "Prog.Férias",
            visible: true,
            icon: "sap-icon://create-leave-request",
            content: [sap.ui.jsview('idProg', "zhr_br_time_freq.PROG.ProgFerias")]}),
            
            new sap.m.IconTabFilter("Relatorios", {
                width: "150px",
                tooltip: 'Relatórios',
                text: "Relatórios",
                visible: true,
                icon: "sap-icon://form",
                content: [new sap.ui.jsview('idRel', "zhr_br_time_freq.RELA.Relatorios")]}),
            
            ],
          select: function(oEvent) {

            var oPernr = oController.byId('idPernr');
            var oPeriodo = oController.byId('idPeriodo');

            if (oEvent.getSource().getProperty('selectedKey') == 'historico') {
                sap.ui.controller("zhr_br_time_freq.HISTO.Historico").getHistorico(oPernr, oPeriodo);
            };

            if (oEvent.getSource().getProperty('selectedKey') == 'frequencia') {
              sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").get_Frequency_Data(oPernr, oPeriodo);
            };

            if (oEvent.getSource().getProperty('selectedKey') == 'marcacoes') {
              sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").get_Marcacao_Data(oPernr, oPeriodo);
            };

            if (oEvent.getSource().getProperty('selectedKey') == 'sobreaviso') {
              sap.ui.controller("zhr_br_time_freq.TAB3.Sobreaviso").get_SobreAviso_Data(oPernr, oPeriodo);
            };

            if (oEvent.getSource().getProperty('selectedKey') == 'horas_extras') {
              sap.ui.controller("zhr_br_time_freq.TAB4.AprovHE").get_Approval_Data(oPernr, oPeriodo);
            };
          }
          })],
      })],
     });

    return oSplit;

  }

});