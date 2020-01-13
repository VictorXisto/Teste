sap.ui.jsview("zhr_br_time_freq.TAB1.Frequencia", {

 /**
  * Specifies the Controller belonging to this View. In the
  * case that it is not implemented, or that "null" is
  * returned, this View does not have a Controller.
  * 
  * @memberOf zhr_br_time_freq.TAB1.Frequencia
  */
 getControllerName : function() {
  return "zhr_br_time_freq.TAB1.Frequencia";
 },

 /**
  * Is initially called once after the Controller has been
  * instantiated. It is the place where the UI is
  * constructed. Since the Controller is given to this
  * method, its event handlers can be attached right away.
  * 
  * @memberOf zhr_br_time_freq.TAB1.Frequencia
  */

 createContent : function(oController) {

  // Tabela
  var oTable = new sap.m.Table(this.createId("idFrequencia"), {
   mode : sap.m.ListMode.Nome,
  });

  // ToolBar
  var oToolBar = new sap.m.Toolbar();

  // Bot�es - Salvar
  var oSalvar = new sap.m.Button(this.createId("idSalvar"), {
   text : "Salvar",
   icon : "sap-icon://save",
   iconFirst : false,
   press : function(oEvent) {
    var erro = oController.set_Frequency_Data(oEvent);
    if (erro == false) {
//        location.reload();
     sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").get_Frequency_Data(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));
     sap.ui.controller("zhr_br_time_freq.main").get_Employed_Information(
       sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));

    }
   }
  });

  // Bot�es - Cancelar
  var oCancelar = new sap.m.Button(this.createId("idCancelar"), {
   text : "Cancelar",
   icon : "sap-icon://sys-cancel-2",
   iconFirst : false,
   press : function(oEvent) {
    sap.ui.controller("zhr_br_time_freq.TAB1.Frequencia").get_Frequency_Data(
      sap.ui.getCore().byId('idmain').byId('idPernr'), sap.ui.getCore().byId('idmain').byId('idPeriodo'));
   },
  });

  var oEspelho = new sap.m.Button({
   text : "Espelho de Ponto",
   tooltip: 'Visualize seu espelho de ponto clicando nesse botão, caso exista alguma pendência de aprovação a visualização não será possível',
   icon : "sap-icon://create",
   iconFirst : false,
   press : [ sap.ui.getCore().byId("idmain").getController().get_espelho ]
  });

    // Bot�es - Sub em Lote
    var oLote = new sap.m.Button(this.createId("idLote"), {
      text: "Substituição em Lote",
      icon: "sap-icon://journey-change",
      iconFirst: false,
      press: function(oEvent) {
        sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").set_Lote_Data()
      }

    });

  // Adiciona Bot�es a Toobar
  oToolBar.addContent(oSalvar);
  oToolBar.addContent(oCancelar);
  oToolBar.addContent(new sap.m.ToolbarSpacer());


//oToolBar.addContent(oLote);

  // Bot�es - Espelho
  oToolBar.addContent(oEspelho);

  // Adiciona a Toobar a Tabela
  oTable.setHeaderToolbar(oToolBar);

  // Colunas - Status/Icone
  oTable.addColumn(new sap.m.Column({
   header : new sap.m.Label({
    text : "Status"
   }),
   width : '40px'
  }));

  // Colunas - Marca��o de feriado
//oTable.addColumn(new sap.m.Column({
// visible: false,
// header : new sap.m.Label({
//  text : "Feriado",
// }),
// mergeDuplicates: true,
// width : '45px'
//}));

  // Colunas - Data
  oTable.addColumn(new sap.m.Column({
   header : new sap.m.Label({
    text : "Data"
   }),
   mergeDuplicates: true,
   mergeFunctionName: "getValue",
   width : '90px'
  }));

  // Colunas - Dia da Semana
  oTable.addColumn(new sap.m.Column({
   header : new sap.m.Label({
    text : "Dia Semana"
   }),
   mergeDuplicates: true,
   width : '75px'
  }));

  // Colunas - Horario teorico
  oTable.addColumn(new sap.m.Column({
   header : new sap.m.Label({
    text : "Hor.Teórico"
   }),
   mergeDuplicates: true,
   mergeFunctionName: "getBindingContext",
   vAlign: sap.ui.core.VerticalAlign.Middle,
   width: '85px'
  }));

  // Colunas - Marca��o
  oTable.addColumn(new sap.m.Column({
   header : new sap.m.Label({
    text : "Marcação"
   }),
// mergeDuplicates: true,
   width : '85px'
  }));

  // Colunas - Editar marcacao
  oTable.addColumn(new sap.m.Column({
   header : new sap.m.Label({
    text : ""
   }),
   width : '20px'
  }));

  // Colunas - Subtipo
  oTable.addColumn(new sap.m.Column({
   header : new sap.m.Label({
    text : "Evento"
   }),
// width : '70px',
  }));

  // Colunas - Arquivo
  oTable.addColumn(new sap.m.Column({
   header : new sap.m.Label({
    text : ""
   }),
   width : '20px'
  }));

  // Colunas - Hora Inicio
  oTable.addColumn(new sap.m.Column({
   header : new sap.m.Label({
    text : "Início"
   }),
 width : '80px'
  }));

  // Colunas - Hora Fim
  oTable.addColumn(new sap.m.Column({
   header : new sap.m.Label({
    text : "Fim"
   }),
 width : '80px'
  }));

  // Colunas - Dia todo
  oTable.addColumn(new sap.m.Column({
   header : new sap.m.Label({
    // text : "Todo o dia"
    text : "Integral"
   }),
   width : '55px'
  }));

  // Colunas - Quantidade
  oTable.addColumn(new sap.m.Column({
   visible: false,
   header : new sap.m.Label({
    text : "Qtd."
   }),
   width : '50px'
  }));

  // Colunas - Hora Extra
  oTable.addColumn(new sap.m.Column({
   visible: false,
   header : new sap.m.Label({
    text : "Hora Extra",
   }),
   width : '70px'
  }));

  // Colunas - Ausências
  oTable.addColumn(new sap.m.Column({
   header : new sap.m.Label({
    text : "Ausência"
   }),
   width : '70px'
  }));
  
  var oRowBase = new sap.m.ColumnListItem(this.createId("idRowBase"));

  // Celula - Status/Icone
  oRowBase.addCell(new sap.ui.core.Icon({
   src : {
    path : 'Error',
    formatter : function(fValue) {
     if (fValue == '') {
      return '';
     }
     else if (fValue == '@8P@') {
      return 'sap-icon://message-information'; // Informação
     }
     else if (fValue == '@8N@') {
      return 'sap-icon://sys-cancel'; // Cancelamento
     }
     else if (fValue == '@8O@') {
      return 'sap-icon://error'; // Erro
     }
     else if (fValue == '@1T@') {
      return 'sap-icon://lateness'; // Pendente
     }
     else if (fValue == '@8R@') { return 'sap-icon://warning2'; // Advertência
     }
    }
   },
   color : {
    path : 'Error',
    formatter : function(fValue) {
     if (fValue == '') {
     }
     else if (fValue == '@8P@') {
      return 'blue'; // Informação
     }
     else if (fValue == '@8N@') {
      return 'red'; // Cancelamento
     }
     else if (fValue == '@8O@') {
      return 'red'; // Erro
     }
     else if (fValue == '@1T@') {
      return 'orange'; // Pendente
     }
     else if (fValue == '@8R@') { return 'green'; // Advertência
     }
    }
   },
   tooltip : {
    path : 'Txter'
   },
  }));

//oRowBase.addCell(new sap.ui.core.Icon({
// hAlign : sap.ui.core.TextAlign.Center,
// src : {
//  path : 'Tagty',
//  formatter : function(fValue) {
//   if (fValue != '0') { return 'sap-icon://accept'; }
//  }
// },
// color : {
//  path : 'Tagty',
//  formatter : function(fValue) {
//   if (fValue != '0') { return 'green'; }
//  }
// }
//}));

  oRowBase.addCell(new sap.m.DateTimeInput({
   value : "{Datum}",
   editable : false,
   type : "Date",
   displayFormat : 'dd/MM/yyyy',
   valueFormat : "yyyy-MM-dd'T00:00:00'"
  }));

  oRowBase.addCell(new sap.m.Text({
   text : '{Langt}',
  }));

  oRowBase.addCell(new sap.m.Text({
   text : {
    parts : [ {
     path : "Sobeg",
     type : new sap.ui.model.type.String()
    }, {
     path : "Soend",
     type : new sap.ui.model.type.String()
    } ],
    formatter : function(fSobeg, fSoend) {
     var vSobeg = (fSobeg.substring(2, 4) + ':' + fSobeg.substring(5, 7));
     if (vSobeg == "99:99") {
      vSobeg = '';
     }
     var vSoend = (fSoend.substring(2, 4) + ':' + fSoend.substring(5, 7));
     if (vSoend == "99:99") {
      vSoend = '';
     }
     if (vSobeg == '00:00' && vSoend == '00:00') {
      return '';
     }
     else {
      return vSobeg + ' - ' + vSoend;
     }
     ;
    }
   }
  }));

  oRowBase.addCell(new sap.m.Text({
   text : "{P2011}"

  }));

    oRowBase.addCell(new sap.m.Button({
      type: sap.m.ButtonType.Transparent,
      tooltip: "Tratar marcações",

    icon: "sap-icon://create-entry-time",
    enabled: true,
   visible : { parts: [ {
	     path : "Sobeg",
	     type : new sap.ui.model.type.String()
	    }, {
	     path : "Soend",
	     type : new sap.ui.model.type.String()
	    }, {
	     path : "P2011",
	     type : new sap.ui.model.type.String()
	    } ],
	    formatter : function(fSobeg, fSoend, P2011) {
		     var vSobeg = (fSobeg.substring(2, 4) + ':' + fSobeg.substring(5, 7));
		     var vSoend = (fSoend.substring(2, 4) + ':' + fSoend.substring(5, 7));
		     
		     if (vSobeg == '00:00' && vSoend == '00:00' && P2011 == "") {
		    	 return false;
		     }
		     else {
		    	 return true;
		     };
	    }
    },
    press: function(oEvent) {
        sap.ui.controller("zhr_br_time_freq.TAB2.Marcacao").show_Marcacoes_Day_Data(oEvent);
      }
}));


  oRowBase.addCell(new sap.m.Input({
   value : {
    path : "Awart",
    formatter : function(fValue) {
     return fValue;
    },
   },
   description : "{Abwtxt}",
   tooltip : "{Abwtxt}", // sap.ui.core.TooltipBase
   editable : {
    parts : [ {
     path : "Mod",
    }, {
     path : "ModKwert",
    } ],
    formatter : function(fMod, fModKwert) {
     if (fMod == 'X') {
      if (sap.ui.getCore().byId('idLocked').getText() == 'X') { return false; }
      ;
      // Matricula Diferente,
      // Gestor
      if (sap.ui.getCore().byId('idmain').byId('idPernr').getText() != sap.ui.getCore().byId('idLogin').getText()) {
       return true;
      }
      else {
       if (fModKwert == 'X') { return false; }
      }
      ;
      return true;
     }
     else {
      return false;
     }
     ;
    },
   },
   fieldWidth : '70px',
   valueHelpOnly : true,
   showValueHelp : true,
   valueHelpRequest : function(oEvent) {
    oController.get_valueHelpAbwtxt(oEvent.getSource().getId(), oEvent);
   }
  }));

  oRowBase.addCell(new sap.m.Button({
   type : sap.m.ButtonType.Transparent,
   tooltip: 'Informações complementares',
   icon    : { parts: [
           {  path : "File"  },
           {  path : "Crm"   },
           {  path : "Awart" }, ],
    formatter : function(fFile, fCrm, fAwart) {
    if (fCrm == "" && fFile == "") {
        return sap.ui.core.IconPool.getIconURI('sap-icon://overflow');
    } else {
         return sap.ui.core.IconPool.getIconURI('sap-icon://overflow');
    }

    },
   },

   enabled : true,

   visible : { parts: [
           {  path : "File"  },
           {  path : "Crm"   },
           {  path : "Awart" }, ],
    formatter : function(fFile, fCrm, fAwart) {
    var oReturn = oController.setVisibleAttach(fFile, fCrm, fAwart);
    return oReturn;

    },
   },

   press : function(oEvent) {
  var line = oEvent.getSource().getParent().oBindingContexts.undefined.oModel.oData.results[
       parseInt(oEvent.getSource().getParent().oBindingContexts.undefined.sPath.split('/')[2])];
  var row = parseInt(oEvent.getSource().getParent().oBindingContexts.undefined.sPath.split('/')[2]);
    oController.get_Frequency_Files(oEvent, line, row);
   }
  }));

  oRowBase.addCell(new sap.m.DateTimeInput({
   value : {
    path : "Begtm",
    formatter : function(fValue) {
     if (fValue == "PT99H99M99S") {
      //this.setVisible(false)
     }
     else {
      return fValue;
     }
     ;
    },
   },
   visible : { parts: [
           {  path : "File"  },
           {  path : "Awart" }, ],
    formatter : function(fFile, fAwart) {
    if (fAwart == "") {
    return false;
} else {
   	 return true;
}

    },
   },
   editable : {
    parts : [ 
      { path : "Mod" },
      { path : "ModKwert" },
      { path : "Awart" },
      ],
    formatter : function(fMod, fModKwert, fAwart) {

      if(fMod == ""){
        return false;
      } else{

           if (fMod == 'X') {
               if (sap.ui.getCore().byId('idLocked').getText() == 'X') { return false; }
               ;
               // Matricula Diferente,
               // Gestor
               if (sap.ui.getCore().byId('idmain').byId('idPernr').getText() != sap.ui.getCore().byId('idLogin').getText()) {
   //             this.setVisible(true)
                return true;
               }
               else {
                if (fModKwert == 'X') { return false; }
               }
 //              this.setVisible(true)
               return true;
              }
              else {
               return false;
              }
              ;

      }

    },
   },
   type : "Time",
   displayFormat : 'HH:mm',
   valueFormat : "PTHH'H'mm'M'ss'S'",
   change : [ function(oEvent) {
     oController.checkChangeFieldTime(oEvent);
   var control = oEvent.getSource();
  }, this ]     
  }));


  oRowBase.addCell(new sap.m.DateTimeInput({
   value : {
    path : "Endtm",
    formatter : function(fValue) {
     if (fValue == "PT99H99M99S") {
      //this.setVisible(false)
     }
     else {
      return fValue;
     }
     ;
    },
   },
   visible : { parts: [
           {  path : "File"  },
           {  path : "Awart" }, ],
    formatter : function(fFile, fAwart) {
    if (fAwart == "") {
    return false;
} else {
   	 return true;
}

    },
   },
   editable : {
    parts : [ 
      { path : "Mod" },
      { path : "ModKwert" },
      { path : "Awart" },
      ],
    formatter : function(fMod, fModKwert, fAwart) {

      if(fMod == ""){
        return false;
      } else{

           if (fMod == 'X') {
               if (sap.ui.getCore().byId('idLocked').getText() == 'X') { return false; }
               ;
               // Matricula Diferente,
               // Gestor
               if (sap.ui.getCore().byId('idmain').byId('idPernr').getText() != sap.ui.getCore().byId('idLogin').getText()) {
   //             this.setVisible(true)
                return true;
               }
               else {
                if (fModKwert == 'X') { return false; }
               }
 //              this.setVisible(true)
               return true;
              }
              else {
               return false;
              }
              ;

      }

    },
   },
   type : "Time",
   displayFormat : 'HH:mm',
   valueFormat : "PTHH'H'mm'M'ss'S'",
   change : [ function(oEvent) {
     oController.checkChangeFieldTime(oEvent);
   var control = oEvent.getSource();
  }, this ]     
  }));

  oRowBase.addCell(new sap.m.CheckBox({
   selected : {
    path : "Alldf",
    formatter : function(fValue) {
     var oParent = this.getParent();
//     if (fValue == 'X') {
//      oParent.getCells()[8].setEditable(false);
//      oParent.getCells()[9].setEditable(false);
//      oParent.getCells()[8].setValue('');
//      oParent.getCells()[9].setValue('');
//      return true;
//     }
//     else {
//      oParent.getCells()[8].setEditable(true);
//      oParent.getCells()[9].setEditable(true);
//      return false;
//     }
     ;
    },
   },
   visible : { parts: [
           {  path : "File"  },
           {  path : "Awart" }, ],
    formatter : function(fFile, fAwart) {
    if (fAwart == "") {
    return false;
} else {
   	 return true;
}

    },
   },
   editable : {
    parts : [ {
     path : "Mod",
    }, {
     path : "ModKwert",
    }, {
     path : "ReadOnlyAlldf",
    },
    {
     path : "Awart",
       }    ],
    formatter : function(fMod, fModKwert, ReadOnlyAlldf, fAwart) {

      if(fMod == "" && fAwart == "0200") {
        return false;
      } else {


     var oParent = this.getParent();
     // quando já houver
     // marcações no IT2011
     // (beguz/enduz),
     // bloquear campo 'integral'
     if (ReadOnlyAlldf == 'X') {
      if (sap.ui.getCore().byId('idLocked').getText() == 'X') {
       oParent.getCells()[8].setEditable(false);
       oParent.getCells()[9].setEditable(false);
      }
      return false;
     }
     if (fMod == 'X') {
      if (sap.ui.getCore().byId('idLocked').getText() == 'X') {
       oParent.getCells()[8].setEditable(false);
       oParent.getCells()[9].setEditable(false);
       this.setVisible(false);
       return false;
      }
      ;

      // Matricula Diferente,
      // Gestor
      if (sap.ui.getCore().byId('idmain').byId('idPernr').getText() != sap.ui.getCore().byId('idLogin').getText()) {
       oParent.getCells()[8].setEditable(true);
       oParent.getCells()[9].setEditable(true);
       this.setVisible(true);
       return true;
      }
      else {
       if (fModKwert == 'X') {
        oParent.getCells()[8].setEditable(false);
        oParent.getCells()[9].setEditable(false);
        this.setVisible(false);
        return false;
       }
      }
      return true;
     }
     else {
      oParent.getCells()[8].setEditable(false);
      oParent.getCells()[9].setEditable(false);
      this.setVisible(false);
      return false;
     }
     ;
     
     }
     
    },
   },
   select : [oController.onSelCheckBox, oController]
  }));

  oRowBase.addCell(new sap.m.Text({
   text : {
    parts : [ {
     path : "Anzhl",
     type : new sap.ui.model.type.String()
    } ],
    formatter : function(fValue) {
     if (fValue != '0.00') {
      var time = Math.abs(fValue);
      var tim = time * 3600;
      var hour = Math.floor(tim / 3600);
      tim = tim % 3600;
      var min = Math.round(tim / 60);
      var vAnzhl = hour + ':' + min;
      if (hour < 10) {
       hour = "0" + hour;
      }
      if (min < 10) {
       min = "0" + min;
      }
      vAnzhl = hour + ':' + min;
     }
     else {
      vAnzhl = '';
     }
     return vAnzhl;
    }
   }
  }));


  oRowBase.addCell(new sap.m.Text({
   text : {
    parts : [ {
     path : "Att",
     type : new sap.ui.model.type.String()
    } ],
    formatter : function(fValue) {
     if (fValue != '0.00') {
      var time = Math.abs(fValue);
      var tim = time * 3600;
      var hour = Math.floor(tim / 3600);
      tim = tim % 3600;
      var min = Math.round(tim / 60);
      var vAnzhl = hour + ':' + min;
      if (hour < 10) {
       hour = "0" + hour;
      }
      if (min < 10) {
       min = "0" + min;
      }
      vAnzhl = hour + ':' + min;
     }
     else {
      vAnzhl = '';
     }
     return vAnzhl;
    }
   }
  }));


  oRowBase.addCell(new sap.m.Text({
   text : {
    parts : [ {
     path : "Abs",
     type : new sap.ui.model.type.String()
    } ],
    formatter : function(fValue) {
     if (fValue != '0.00') {
      var time = Math.abs(fValue);
      var tim = time * 3600;
      var hour = Math.floor(tim / 3600);
      tim = tim % 3600;
      var min = Math.round(tim / 60);
      var vAnzhl = hour + ':' + min;
      if (hour < 10) {
       hour = "0" + hour;
      }
      if (min < 10) {
       min = "0" + min;
      }
      vAnzhl = hour + ':' + min;
     }
     else {
      vAnzhl = '';
     }
     return vAnzhl;
    }
   }
  }));



  return oTable;

 }

});