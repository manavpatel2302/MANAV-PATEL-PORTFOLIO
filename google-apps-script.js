// Google Apps Script for Contact Form to Google Sheets
// Deploy this script to collect contact form responses

function doPost(e) {
  try {
    // Parse the incoming data from the POST request
    const data = JSON.parse(e.postData.contents);

    // Get the active spreadsheet by ID
    // Replace 'YOUR_SPREADSHEET_ID_HERE' with your actual spreadsheet ID
    const spreadsheetId = "1_mN_JP-Cd8SFQ-tmVSVzViOQvF9H_X29gzvHGOIgDrw";
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet =
      spreadsheet.getSheetByName("Contact Form Data") ||
      spreadsheet.insertSheet("Contact Form Data");

    // Prepare the data row
    const rowData = [
      new Date(), // Timestamp when script processed the request
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

    // Append the data row
    sheet.appendRow(rowData);

    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, rowData.length);

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Data saved successfully",
        timestamp: new Date().toISOString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Error in doPost:", error);

    // Return error response
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
  // Handle GET requests (optional - for testing)
  return ContentService.createTextOutput(
    "Contact Form API is running!"
  ).setMimeType(ContentService.MimeType.TEXT);
}

// Function to test the script (optional)
function testScript() {
  const testData = {
    name: "Test User",
    email: "test@example.com",
    message: "This is a test message",
    submittedAt: new Date().toISOString(),
    timestamp: new Date().toLocaleString(),
    userAgent: "Test User Agent",
    platform: "Test Platform",
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData),
    },
  };

  const result = doPost(mockEvent);
  console.log("Test result:", result);
}
