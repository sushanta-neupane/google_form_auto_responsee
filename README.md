# Google Form Auto-Response Email Script

This Google Apps Script automatically sends a confirmation email with dynamic content based on responses from a Google Form. The content is populated in an email template using placeholders.

## Setup Instructions

Follow these steps to set up and run the script:

### 1. Create a Google Form

1. Open Google Forms and create a new form with your questions.
2. Go to the **Settings** menu and enable the **Collect email addresses** option to capture respondent emails.

### 2. Add the Script to Your Google Form

1. In Google Forms, click on the **three-dot menu** (⋮) in the top-right corner and select **Script editor**.
2. Delete any default code in the editor and paste in the following script:

   ```javascript
   function setPermission() {
     FormApp.getActiveForm();
     UrlFetchApp.fetch('https://www.google.com');
     ScriptApp.getOAuthToken();
     GmailApp.sendEmail('your_email@gmail.com', 'Test subject', 'Test body');
   }

   function sendEmail(e) {
     const recipient = e.response.getRespondentEmail();
     const subject = 'Attendance recorded';

     // Define placeholders for dynamic content
     let fieldData = {};

     // Loop through form item responses and populate `fieldData`
     const itemResponses = e.response.getItemResponses();
     for (const itemResponse of itemResponses) {
       const question = itemResponse.getItem().getTitle();
       const answer = itemResponse.getResponse();
       fieldData[question] = answer;
     }

     // Fetch Google Docs template content and replace placeholders dynamically
     const docId = 'YOUR_TEMPLATE_DOC_ID_HERE';
     let htmlBody = getDocAsHtml(docId);

     // Replace placeholders with dynamic data from `fieldData`
     for (const [question, answer] of Object.entries(fieldData)) {
       const placeholder = `{{${question}}}`;
       htmlBody = htmlBody.replace(new RegExp(placeholder, 'g'), answer);
     }

     // Send the email with the dynamically generated HTML body
     GmailApp.sendEmail(recipient, subject, '', { htmlBody });
   }

   function getDocAsHtml(docId) {
     const url = `https://docs.google.com/document/u/0/export?format=html&id=${docId}`;
     const response = UrlFetchApp.fetch(url);
     return response.getContentText();
   }

   function onFormSubmit(e) {
     sendEmail(e);
   }
   ```

3. Replace `YOUR_TEMPLATE_DOC_ID_HERE` e.g https://docs.google.com/document/d/xxxxxx__thisisid_xxxxxxxxxxxx/edit?tab=t.0 with the ID of your Google Docs template (the document where placeholders like `{{Field_Title}}` are used).

### 3. Set Up Form Submission Trigger

1. Click on **Triggers** in the Script Editor (clock icon in the toolbar).
2. Select the following options:

   - **Choose which function to run**: `onFormSubmit`
   - **Select event source**: `From form`
   - **Select event type**: `On form submit`

3. Save and authorize the script when prompted. If no popup appears, ensure popups are enabled in your browser settings.

### 4. Run the Script for Initial Permission Setup

1. In the Script Editor, select the `setPermission` function from the dropdown.
2. Click **Run**. The script will request permissions; authorize them to enable the required Google services.

### 5. Customize Your Google Docs Template

- In your Google Doc template, add placeholders using the format `{{Field_Title}}`.
- These placeholders will be replaced with the corresponding form responses in the email sent to respondents.

---

Now your script is ready to send personalized emails based on Google Form submissions!
