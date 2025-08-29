# Google Sheets Integration Setup Guide

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Contact Form Responses"
4. Copy the Spreadsheet ID from the URL (it's the long string between /d/ and /edit)

## Step 2: Set up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the contents of `google-apps-script.js`
4. Replace `'YOUR_SPREADSHEET_ID_HERE'` with your actual spreadsheet ID
5. Save the project with a name like "Contact Form Handler"

## Step 3: Deploy the Script

1. Click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. Copy the Web App URL that's generated

## Step 4: Update Your Code

1. Open `main.js`
2. Replace `"YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"` with your actual Web App URL
3. Save the file

## Step 5: Test the Integration

1. Open your portfolio website
2. Fill out the contact form
3. Submit the form
4. Check your Google Sheet - you should see the response data
5. The "Thank You" modal should appear after submission

## Troubleshooting

- **CORS Issues**: Google Apps Script handles CORS automatically
- **Permission Denied**: Make sure the script is deployed as a web app with "Anyone" access
- **Data Not Saving**: Check the browser console for error messages
- **Modal Not Showing**: Ensure Bootstrap JS is properly loaded

## Data Structure

Your Google Sheet will have these columns:

- Timestamp (when the script processed the request)
- Name (from the form)
- Email (from the form)
- Message (from the form)
- Submitted At (when the user submitted the form)
- Platform (user's operating system)

## Security Notes

- The script URL will be visible in your code
- Anyone can submit to your form (this is typically desired for contact forms)
- Consider adding rate limiting or CAPTCHA if you expect high volume
- Data is also saved locally as backup in case Google Sheets is unavailable
