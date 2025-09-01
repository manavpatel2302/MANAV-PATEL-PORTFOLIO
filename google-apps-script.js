// Google Apps Script for Contact Form to Google Sheets
// Deploy this script as a Web App to collect contact form responses

function doPost(e) {
  try {
    let data;

    // Log the incoming request for debugging purposes
    Logger.log("Received POST request: " + JSON.stringify(e));

    // Case 1: Valid POST with JSON body
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    // Case 2: No POST data (manual run or GET fallback) -> use dummy/test values
    else {
      data = {
        name: e && e.parameter && e.parameter.name ? e.parameter.name : "N/A",
        email: e && e.parameter && e.parameter.email ? e.parameter.email : "N/A",
        message: e && e.parameter && e.parameter.message ? e.parameter.message : "N/A",
        submittedAt: new Date().toISOString(),
        timestamp: new Date().toLocaleString(),
        userAgent: "Unknown",
        platform: "Unknown",
      };
    }

    Logger.log("Parsed data: " + JSON.stringify(data));

    // Get the active spreadsheet by ID
    const spreadsheetId = "1_mN_JP-Cd8SFQ-tmVSVzViOQvF9H_X29gzvHGOIgDrw";
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet =
      spreadsheet.getSheetByName("Contact Form Data") ||
      spreadsheet.insertSheet("Contact Form Data");

    // Prepare the data row
    const rowData = [
      new Date(), // Script timestamp
      data.name || "N/A",
      data.email || "N/A",
      data.message || "N/A",
      data.submittedAt || new Date().toISOString(),
      data.timestamp || new Date().toLocaleString(),
      data.userAgent || "N/A",
      data.platform || "N/A",
    ];

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Timestamp",
        "Name",
        "Email",
        "Message",
        "Submitted At (ISO)",
        "Submitted At (Local)",
        "User Agent",
        "Platform",
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.getRange(1, 1, 1, headers.length).setBackground("#4285f4");
      sheet.getRange(1, 1, 1, headers.length).setFontColor("white");
    }

    // Append the row
    sheet.appendRow(rowData);
    sheet.autoResizeColumns(1, rowData.length);

    Logger.log("Data saved successfully.");

    // Success response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Data saved successfully",
        timestamp: new Date().toISOString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    console.error("Error in doPost:", error);

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: "Failed to save data: " + error.toString(),
        timestamp: new Date().toISOString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    "Contact Form API is running! Send a POST request to save data."
  ).setMimeType(ContentService.MimeType.TEXT);
}

// Function to test the script in editor
function testScript() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "Hello from test!",
        submittedAt: new Date().toISOString(),
        timestamp: new Date().toLocaleString(),
        userAgent: "Test User Agent",
        platform: "Test Platform",
      }),
    },
  };

  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
