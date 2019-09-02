var contentType;
var fileContent;

var connection;
var procedureCall;

function insertRow(row) {	
	if (row === undefined) {
		return;
	}
	
	var params = row.split(',');
	var MATERIAL_NUMBER = params[0].toString();
	var BATCH_DATE = params[1];
	var MATERIAL_DESCRIPTION = params[2].toString();
	var COUNTRY = params[3].toString();
	var PROCESS_FLAG = params[4].toString();
	var RUNID =  Number(params[5]);
	
	procedureCall(MATERIAL_NUMBER, BATCH_DATE, MATERIAL_DESCRIPTION, COUNTRY, PROCESS_FLAG, RUNID);
}

function loadDataFromFile(file_content) {
	try {
		var row_index = 1;
		var file_rows = file_content.split('\n');

		connection = $.hdb.getConnection();
		procedureCall = connection.loadProcedure('insertData');

		for (row_index = 1; row_index < file_rows.length; row_index++) { // jump header
			insertRow(file_rows[row_index]);
		}
		
		connection.commit();
		connection.close();
		$.response.contentType = "text/plain";
		$.response.setBody("File imported!!"); // assuming it's in the correct format! 
		$.response.returnCode = 200;
	} catch (err) {
	    $.response.contentType = "text/plain";
	    $.response.setBody("Error while executing query: [" + err.message + "]");
	    $.response.returnCode = 200;
	}
}

// Check Content type headers and parameters
function validateInput() {
	
	if ($.request.method !== $.net.http.POST) {
		$.response.status = $.net.http.NOT_ACCEPTABLE;
		$.response.setBody("Only POST is supported!!");
		return false;
	}
	
	var file_entity_index;

	// Get entity header which contains the file content
	for (file_entity_index = 0; file_entity_index < $.request.entities.length; file_entity_index++) {

		if ($.request.entities[file_entity_index].headers.get("~content_name") === "fup_data") {
			contentType = $.request.entities[file_entity_index].headers.get("content-type");

			if (contentType === 'application/vnd.ms-excel') {
				$.response.status = $.net.http.ACCEPTED;
				fileContent = $.request.entities[4].body.asString();
				return true;
			}
		}
	}

	$.response.status = $.net.http.NOT_ACCEPTABLE;
	$.response.setBody("File is NOT a CSV!");
	return false;
}

// Request process 
function processRequest() {
	if (validateInput()) {
		loadDataFromFile(fileContent);
	}
}
// Call request processing  
processRequest();