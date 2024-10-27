/**
 * Sets necessary permissions by calling Google services that require authorization.
 */
function setPermission() {
  // Access the current active form in the project
  FormApp.getActiveForm();

  // Trigger a URL fetch request (used here to force permissions setup)
  UrlFetchApp.fetch('https://www.google.com');

  // Request OAuth token to ensure permissions are set up
  ScriptApp.getOAuthToken();

  // Send a test email to confirm permission for Gmail service
  GmailApp.sendEmail('test@gmail.com', 'test subject', 'test body');
}

/**
 * Sends a confirmation email to the respondent with dynamically generated content.
 */
function sendEmail(e) {
  // Retrieve the respondent's email from the form response event
  const recipient = e.response.getRespondentEmail();
  const subject = 'Attendance recorded';

  // Initialize an object to store form question-answer pairs
  let fieldData = {};

  // Loop through each response item to populate `fieldData` with question-answer pairs
  const itemResponses = e.response.getItemResponses();
  for (const itemResponse of itemResponses) {
    const question = itemResponse.getItem().getTitle(); // Question title
    const answer = itemResponse.getResponse(); // User's answer

    // Store question-answer pair in `fieldData` with question as key
    fieldData[question] = answer;
  }

  // Fetch the HTML content of the Google Docs template
  const docId = 'Your_Docs_ID';
  let htmlBody = getDocAsHtml(docId);

  // Replace placeholders in the template with actual data from `fieldData`
  for (const [question, answer] of Object.entries(fieldData)) {
    const placeholder = `{{${question}}}`; // Placeholder format {{Question}}
    htmlBody = htmlBody.replace(new RegExp(placeholder, 'g'), answer);
  }

  // Send an email with the customized HTML body content
  GmailApp.sendEmail(recipient, subject, '', { htmlBody });
}

/**
 * Fetches the content of a Google Doc as HTML.
 */
function getDocAsHtml(docId) {
  // Construct the URL to export the document as HTML
  const url = `https://docs.google.com/document/u/0/export?format=html&id=${docId}`;

  // Fetch the document content as HTML
  const response = UrlFetchApp.fetch(url);

  // Return the document content as a text string
  return response.getContentText();
}

/**
 * Trigger function that runs when a form is submitted.
 */
function onFormSubmit(e) {
  // Calls `sendEmail` function to handle the form submission and email sending
  sendEmail(e);
}
