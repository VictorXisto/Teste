sap.ui.jsview("zhr_br_time_freq.GEST.Gest", {

	/**
	 * Specifies the Controller belonging to this View. In the case that it is not implemented, or
	 * that "null" is returned, this View does not have a Controller.
	 * 
	 * @memberOf zhr_br_time_freq.GEST.Gest
	 */
	getControllerName : function() {
		return "zhr_br_time_freq.GEST.Gest";
	},

	/**
	 * Is initially called once after the Controller has been instantiated. It is the place where the
	 * UI is constructed. Since the Controller is given to this method, its event handlers can be
	 * attached right away.
	 * 
	 * @memberOf zhr_br_time_freq.GEST.Gest
	 */
	createContent : function(oController) {

		
		  // ================================================================================
		  // Páginas 
		  // ================================================================================
		  var oPageGestorOrgeh = new sap.m.Page("GestorOrgeh", {
			  showHeader : false,
			  content : [ new sap.m.Toolbar({	active : true,
				  								height : "60px",
												design : sap.m.ToolbarDesign.Info,
											   content : [ new sap.ui.core.Icon({ src :'sap-icon://activity-individual',
												   								 size : '25px',
												   								color : 'white'}),	
												   		   new sap.m.Label({text : 'Meus Lançamentos'}),
												   		  ],
												 press : [oController.pressGestor]
			  			  }),
			              new sap.m.Toolbar({	height : "60px",
												design : sap.m.ToolbarDesign.Info,
												content : [ new sap.ui.core.Icon({ src :'sap-icon://org-chart',
																				  size : '25px',
																				  color : 'white'}),
														    new sap.m.Label({text : 'Unidade Organizacional'}),
												]}),
					      new sap.m.Bar({ contentLeft : [ new sap.m.SearchField({liveChange : [oController.SearchOrgeh]}) ], // sap.ui.core.Control
					   		  			 contentRight : []})
			    		],
				howNavButton : true,
		  });

		  var oPageGestorPernr = new sap.m.Page("GestorPernr", {
	  		    showHeader : false,
	  		  content : [ new sap.m.Toolbar({	height : "60px",
												design : sap.m.ToolbarDesign.Info,
											   content : [ new sap.ui.core.Icon({ src : 'sap-icon://sys-back-2',
												   								 size : '25px',
												   								color : 'white',
												   					       hoverColor : 'Grey',
												   					       	 	press : [oController.pressback]}),
												   		   new sap.ui.core.Icon({ src :'sap-icon://employee',
												   								 size : '25px',
												   								color : 'white'}),
												   		   new sap.m.Label({text : 'Funcionário'}),
												   		 ]
	  		  			  }),
	  		  			  new sap.m.Bar({ contentLeft : [ new sap.m.SearchField({liveChange : [oController.SearchPernr]}) ],
	  		  				  			 contentRight : []})
	  		  			],
				showNavButton : true,
		  });

	      // ================================================================================
		  // Listas / Tabelas  
		  // ================================================================================
		  oListGestorOrgeh = new sap.m.List("ListGestorOrgeh", {
					 columns : new sap.m.Column({ width : "100%"})  
	      });
		  
		  
		  oListGestorPernr = new sap.m.List("ListGestorPernr", {
		 			columns : [ new sap.m.Column({ width : "15%" }),
		 			            new sap.m.Column({ width : "85%" }) ]  
		  });  

		  // ================================================================================
		  // Itens/Colunas - Listas  
		  // ================================================================================  
		  var oColumnListGestorOrgeh = new sap.m.ColumnListItem("ColumnListIGestorOrgeh", {  
	    	  			type  : "Navigation",
	          			press: [oController.pressGestorOrgeh],
	          			unread : false,  
	          			cells : [ new sap.m.Text({text: "{Stext}"})],  
	      });  

	      var oColumnListGestorPernr = new sap.m.ColumnListItem("ColumnListGestorPernr", {
						type  : "Navigation",
						press: [oController.pressGestorPernr],
	          			unread : false,  
	          			cells : [ new sap.ui.core.Icon({
	          				tooltip : '{Msg}',
	          				size : '22px',
/*	          				src : {
	          					path : 'Icon',
	          					formatter : function(fValue) {
	          						if (fValue == '') {
	          							return '';
	          						} else if (fValue == '@8P@') {
	          							return 'sap-icon://message-information'; // Informa��o
	          						} else if (fValue == '@8N@') {
	          							return 'sap-icon://sys-cancel'; // Cancelamento
	          						} else if (fValue == '@8O@') {
	          							return 'sap-icon://error'; // Erro
	          						} else if (fValue == '@8R@') {
	          							return 'sap-icon://warning2'; // Advert�ncia
	          						}
	          					}
	          				},
	          				color : {
	          					path : 'Icon',
	          					formatter : function(fValue) {
	          						if (fValue == '') {
	          						} else if (fValue == '@8P@') {
	          							return 'blue'; // Informa��o
	          						} else if (fValue == '@8N@') {
	          							return 'red'; // Cancelamento
	          						} else if (fValue == '@8O@') {
	          							return 'red'; // Erro
	          						} else if (fValue == '@8R@') {
	          							return '#AEB404'; // Advert�ncia
	          						}
	          					}
	          				}*/
	          				}),
	          					  new sap.m.Label({text: "{Stext}",
	          						  			   tooltip : '{Objid}'})],  
	      });  

					
	      // ================================================================================
		  // Conteúdo das Páginas 
		  // ================================================================================
	    
		  //Página Gestor Unidade
	      oPageGestorOrgeh.addContent(oListGestorOrgeh);
		  //Página Gestor No Pessoal
	      oPageGestorPernr.addContent(oListGestorPernr);
	      
	      // ================================================================================
		  // Applicação 
		  // ================================================================================
	      var oApp = new sap.m.App("AppGestor", {});
	      oApp.addPage(oPageGestorOrgeh).addPage(oPageGestorPernr);		
	      oApp.setInitialPage("GestorOrgeh");

	      return oApp;

	},

});