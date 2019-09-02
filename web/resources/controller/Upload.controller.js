sap.ui.define(['jquery.sap.global','sap/m/MessageToast','sap/ui/core/mvc/Controller'],
	function(jQuery, MessageToast, Controller) {
	"use strict";

	var ControllerController = Controller.extend("ZHTS.ZHTS.controller.Upload", {
		
		handleUploadComplete: function(oEvent) {
			var sResponse = oEvent.getParameter("response");
			if (sResponse) {
				sResponse = sResponse.split(">")[1];
				sResponse = sResponse.substring(0, sResponse.length-5);
				MessageToast.show(sResponse);
				console.log(sResponse);
			}
		},

		handleUploadPress: function(oEvent) {
			var oFileUploader = this.byId("fileUploader");
			if (!oFileUploader.getValue()) {
				MessageToast.show("Choose a file first");
				return;
			}

			oFileUploader.upload();
		},

		handleTypeMissmatch: function(oEvent) {
			var aFileTypes = oEvent.getSource().getFileType();
			jQuery.each(aFileTypes, function(key, value) {aFileTypes[key] = "*." +  value;});
			var sSupportedFileTypes = aFileTypes.join(", ");
			MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
									" is not supported. Choose one of the following types: " +
									sSupportedFileTypes);
		},

		handleValueChange: function(oEvent) {
			MessageToast.show("Press 'Upload File' to upload file '" +
									oEvent.getParameter("newValue") + "'");
		},
		
		doNavBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("home", true);
		}
	});

	return ControllerController;

});
