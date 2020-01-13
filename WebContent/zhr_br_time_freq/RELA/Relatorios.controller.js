sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Column",
	"sap/m/Label",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/Table"
], function (Controller, Filter, FilterOperator, Column, Label, JSONModel, Table) {
	"use strict";

	return Controller.extend("zhr_br_time_freq.RELA.Relatorios", {
		onInit: function () {

		},

		onVariantChange: function (oEvent) {
			
			//this._oTable = this.byId("idSaldoHoras");
			this._oTable = sap.ui.getCore().byId("idSaldoHoras");
			var oModel = new JSONModel({
				columns: [],
				rows: []
			});

			this._oTable.setModel(oModel);

			var sVariant = oEvent.getParameter("selectedItem").getKey();
			var oPernr   = sap.ui.getCore().byId('idmain').byId('idPernr');
			var oPeriodo = sap.ui.getCore().byId('idmain').byId('idPeriodo');
			this._getTableData(sVariant);

		},

		_getTableData: function (sVariant) {
			
			var oPernr = this.getView().getModel("globals").getProperty("/pernr");
			var oPeriodo = this.getView().getModel("globals").getProperty("/periodo");

			var aFilters = [new Filter("Pernr", FilterOperator.EQ, oPernr.getText()),
							new Filter("Mmaaaa", FilterOperator.EQ, oPeriodo.getSelectedKey()),
							new Filter("Variant", FilterOperator.EQ, sVariant) ];
			this.getView().getModel("variant").read("/SaldoHorasSet", {
				filters: aFilters,
				success: function (oSuccess) {

					var aResults = oSuccess.results;
					var aColumns = [];
					var aRows = [];
					var oRow = {};

					for (var i = 0; i < aResults.length; i++) {
						var oResult = aResults[i];

						if (oResult.Row === "1") {
							aColumns.push(oResult);
						}

						switch (oResult.Type) {	
						case "P":
							oResult.Value = parseFloat(oResult.Value);
							break;
						case "D":
							var year = oResult.Value.substring(0, 4);
							var month = oResult.Value.substring(4, 6);
							var day = oResult.Value.substring(6, 8);
							oResult.Value = new Date(year, month - 1, day);
							break;
						}

						oRow[oResult.Field] = oResult.Value;

						if (!aResults[i + 1] || aResults[i + 1].Row !== oResult.Row) {
							aRows.push(oRow);
							oRow = {};
						}

					}

					this._oTable.getModel().setProperty("/columns", aColumns);
					this._oTable.getModel().setProperty("/rows", aRows);

					this._oTable.bindColumns("/columns", function (index, oContext) {
						var sColumnId = oContext.getObject().Field;
						var sColumnTitle = oContext.getObject().Description;
						var oType = {};

						switch (oContext.getObject().Type) {
						case "P":
							oType = new sap.ui.model.type.Float();
							break;
						case "D":
							oType = new sap.ui.model.type.Date();
							break;
						default:
							oType = new sap.ui.model.type.String();
						}

						return new sap.ui.table.Column({
							id: sColumnId,
							label: sColumnTitle,
							template: new sap.m.Text().bindProperty("text", {
								path: sColumnId,
								type: oType
							}),
							sortProperty: sColumnId,
							filterProperty: sColumnId
						});
					});

					this._oTable.bindRows("/rows");

				}.bind(this),
				error: function (oError) {
					// mensagem de erro
				}
			});
		}
	});
});