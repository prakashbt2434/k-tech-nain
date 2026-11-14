/**
 * Email templates for deal notifications (English + Kannada).
 *
 * Moved here from lib/notificationTemplates*.js: those files were ES modules in
 * the Next.js app and were never imported by the Cloud Function, so the
 * Kannada emails could not be sent. This CommonJS copy is what the function uses.
 * The recipient's language comes from users/{uid}.language (set in the app).
 */

const NOTIFICATION_EVENTS = {
  DEAL_CONFIRMED: "DEAL_CONFIRMED",
  DEAL_COMPLETED: "DEAL_COMPLETED",
};

const SUPPORTED_LANGUAGES = {
  EN: "en",
  KN: "kn",
};

// ---------------------------------------------------------------- Kannada
/**
 * Get email subject in Kannada
 * @param {string} eventType - Notification event type
 * @param {string} recipientRole - 'farmer' or 'buyer'
 * @returns {string} - Email subject line in Kannada
 */
function getEmailSubjectKannada(eventType, recipientRole) {
  switch (eventType) {
    case NOTIFICATION_EVENTS.DEAL_CONFIRMED:
      return recipientRole === "farmer"
        ? "ಒಪ್ಪಂದ ದೃಢೀಕರಿಸಲಾಗಿದೆ - ಖರೀದಿದಾರ ಮುಂದುವರಿಯಲು ಸಿದ್ಧರಾಗಿದ್ದಾರೆ"
        : "ಒಪ್ಪಂದ ದೃಢೀಕರಿಸಲಾಗಿದೆ - ರೈತ ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಸ್ವೀಕರಿಸಿದ್ದಾರೆ";

    case NOTIFICATION_EVENTS.DEAL_COMPLETED:
      return "ಒಪ್ಪಂದ ಪೂರ್ಣಗೊಂಡಿದೆ - ವಹಿವಾಟು ಯಶಸ್ವಿಯಾಗಿದೆ";

    default:
      return "ಫಾರ್ಮ್ ಟು ಟೇಬಲ್ - ಒಪ್ಪಂದ ನವೀಕರಣ";
  }
}

/**
 * Generate plain text email body in Kannada
 * @param {string} eventType - Notification event type
 * @param {object} data - Email template data
 * @returns {string} - Plain text email body in Kannada
 */
function getEmailBodyPlainTextKannada(eventType, data) {
  const { recipientName, productName, dealId, otherPartyName } = data;

  switch (eventType) {
    case NOTIFICATION_EVENTS.DEAL_CONFIRMED:
      return data.recipientRole === "farmer"
        ? `ನಮಸ್ಕಾರ ${recipientName},

ಅದ್ಭುತ ಸುದ್ದಿ! ನಿಮ್ಮ ಒಪ್ಪಂದವನ್ನು ದೃಢೀಕರಿಸಲಾಗಿದೆ.

ಉತ್ಪನ್ನ: ${productName}
ಖರೀದಿದಾರ: ${otherPartyName}
ಒಪ್ಪಂದ ಐಡಿ: ${dealId}

ನೀವು ಮತ್ತು ಖರೀದಿದಾರರು ಈ ಒಪ್ಪಂದವನ್ನು ದೃಢೀಕರಿಸಿದ್ದೀರಿ. ನೀವು ಈಗ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನಲ್ಲಿ ಒದಗಿಸಲಾದ ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಬಳಸಿಕೊಂಡು ವಹಿವಾಟಿಗೆ ಮುಂದುವರಿಯಬಹುದು.

ಸಂಪೂರ್ಣ ಒಪ್ಪಂದ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಮತ್ತು ವಿತರಣೆಯನ್ನು ಸಂಯೋಜಿಸಲು ದಯವಿಟ್ಟು ಫಾರ್ಮ್ ಟು ಟೇಬಲ್‌ಗೆ ಲಾಗಿನ್ ಆಗಿ.

ಫಾರ್ಮ್ ಟು ಟೇಬಲ್ ಬಳಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು!

---
ಇದು ಸ್ವಯಂಚಾಲಿತ ವ್ಯವಹಾರ ಸಂದೇಶವಾಗಿದೆ. ದಯವಿಟ್ಟು ಈ ಇಮೇಲ್‌ಗೆ ಉತ್ತರಿಸಬೇಡಿ.
ಫಾರ್ಮ್ ಟು ಟೇಬಲ್ - ರೈತರನ್ನು ನೇರವಾಗಿ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು`
        : `ನಮಸ್ಕಾರ ${recipientName},

ಅದ್ಭುತ ಸುದ್ದಿ! ನಿಮ್ಮ ಒಪ್ಪಂದವನ್ನು ದೃಢೀಕರಿಸಲಾಗಿದೆ.

ಉತ್ಪನ್ನ: ${productName}
ರೈತ: ${otherPartyName}
ಒಪ್ಪಂದ ಐಡಿ: ${dealId}

ನೀವು ಮತ್ತು ರೈತರು ಈ ಒಪ್ಪಂದವನ್ನು ದೃಢೀಕರಿಸಿದ್ದೀರಿ. ನೀವು ಈಗ ಪಾವತಿಗೆ ಮುಂದುವರಿಯಬಹುದು ಮತ್ತು ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನಲ್ಲಿನ ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಬಳಸಿಕೊಂಡು ವಿತರಣೆಯನ್ನು ಸಂಯೋಜಿಸಬಹುದು.

ಪಾವತಿ ಮಾಹಿತಿ ಮತ್ತು ವಿತರಣಾ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ದಯವಿಟ್ಟು ಫಾರ್ಮ್ ಟು ಟೇಬಲ್‌ಗೆ ಲಾಗಿನ್ ಆಗಿ.

ಫಾರ್ಮ್ ಟು ಟೇಬಲ್ ಬಳಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು!

---
ಇದು ಸ್ವಯಂಚಾಲಿತ ವ್ಯವಹಾರ ಸಂದೇಶವಾಗಿದೆ. ದಯವಿಟ್ಟು ಈ ಇಮೇಲ್‌ಗೆ ಉತ್ತರಿಸಬೇಡಿ.
ಫಾರ್ಮ್ ಟು ಟೇಬಲ್ - ರೈತರನ್ನು ನೇರವಾಗಿ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು`;

    case NOTIFICATION_EVENTS.DEAL_COMPLETED:
      return `ನಮಸ್ಕಾರ ${recipientName},

ನಿಮ್ಮ ಒಪ್ಪಂದವನ್ನು ಪೂರ್ಣಗೊಂಡಂತೆ ಗುರುತಿಸಲಾಗಿದೆ.

ಉತ್ಪನ್ನ: ${productName}
ಒಪ್ಪಂದ ಐಡಿ: ${dealId}

ಫಾರ್ಮ್ ಟು ಟೇಬಲ್ ಬಳಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಈ ವಹಿವಾಟು ಯಶಸ್ವಿಯಾಗಿದೆ ಎಂದು ನಾವು ಭಾವಿಸುತ್ತೇವೆ.

ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಭೇಟಿ ನೀಡುವ ಮೂಲಕ ಈ ಒಪ್ಪಂದಕ್ಕಾಗಿ ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಬಹುದು.

ನಮ್ಮ ಸಮುದಾಯದ ಭಾಗವಾಗಿರುವುದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು!

---
ಇದು ಸ್ವಯಂಚಾಲಿತ ವ್ಯವಹಾರ ಸಂದೇಶವಾಗಿದೆ. ದಯವಿಟ್ಟು ಈ ಇಮೇಲ್‌ಗೆ ಉತ್ತರಿಸಬೇಡಿ.
ಫಾರ್ಮ್ ಟು ಟೇಬಲ್ - ರೈತರನ್ನು ನೇರವಾಗಿ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು`;

    default:
      return `ನಮಸ್ಕಾರ ${recipientName},

ನಿಮ್ಮ ಒಪ್ಪಂದಕ್ಕೆ (ಐಡಿ: ${dealId}) ನವೀಕರಣವಿದೆ.

ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ದಯವಿಟ್ಟು ಫಾರ್ಮ್ ಟು ಟೇಬಲ್‌ಗೆ ಲಾಗಿನ್ ಆಗಿ.

ಧನ್ಯವಾದಗಳು!

---
ಫಾರ್ಮ್ ಟು ಟೇಬಲ್ - ರೈತರನ್ನು ನೇರವಾಗಿ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು`;
  }
}

/**
 * Generate HTML email body in Kannada
 * @param {string} eventType - Notification event type
 * @param {object} data - Email template data
 * @returns {string} - HTML email body in Kannada
 */
function getEmailBodyHTMLKannada(eventType, data) {
  const {
    recipientName,
    productName,
    dealId,
    otherPartyName,
    platformUrl = "https://farmtotable.app",
  } = data;

  const baseStyles = `
    body { font-family: 'Noto Sans Kannada', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10B981; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 5px; margin: 20px 0; }
    .detail { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #10B981; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
    .button { display: inline-block; background: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  `;

  switch (eventType) {
    case NOTIFICATION_EVENTS.DEAL_CONFIRMED:
      return `
<!DOCTYPE html>
<html>
<head>
  <style>${baseStyles}</style>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ಒಪ್ಪಂದ ದೃಢೀಕರಿಸಲಾಗಿದೆ!</h1>
    </div>
    <div class="content">
      <p>ನಮಸ್ಕಾರ ${recipientName},</p>
      <p><strong>ಅದ್ಭುತ ಸುದ್ದಿ!</strong> ನಿಮ್ಮ ಒಪ್ಪಂದವನ್ನು ಎರಡೂ ಪಕ್ಷಗಳು ದೃಢೀಕರಿಸಿದ್ದಾರೆ.</p>
      
      <div class="detail">
        <p><strong>ಉತ್ಪನ್ನ:</strong> ${productName}</p>
        <p><strong>${
          data.recipientRole === "farmer" ? "ಖರೀದಿದಾರ" : "ರೈತ"
        }:</strong> ${otherPartyName}</p>
        <p><strong>ಒಪ್ಪಂದ ಐಡಿ:</strong> ${dealId}</p>
      </div>
      
      <p>${
        data.recipientRole === "farmer"
          ? "ನೀವು ಈಗ ಪಾವತಿ ಮತ್ತು ವಿತರಣಾ ವ್ಯವಸ್ಥೆಗಳಿಗಾಗಿ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಯೋಜನೆ ಮಾಡಬಹುದು."
          : "ನೀವು ಈಗ ಪಾವತಿಗೆ ಮುಂದುವರಿಯಬಹುದು ಮತ್ತು ರೈತರೊಂದಿಗೆ ವಿತರಣೆಯನ್ನು ಸಂಯೋಜಿಸಬಹುದು."
      }</p>
      
      <a href="${platformUrl}/my-deals" class="button">ಒಪ್ಪಂದ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ</a>
    </div>
    
    <div class="footer">
      <p>ಇದು ಸ್ವಯಂಚಾಲಿತ ವ್ಯವಹಾರ ಸಂದೇಶವಾಗಿದೆ. ದಯವಿಟ್ಟು ಈ ಇಮೇಲ್‌ಗೆ ಉತ್ತರಿಸಬೇಡಿ.</p>
      <p>ಫಾರ್ಮ್ ಟು ಟೇಬಲ್ - ರೈತರನ್ನು ನೇರವಾಗಿ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು</p>
    </div>
  </div>
</body>
</html>`;

    case NOTIFICATION_EVENTS.DEAL_COMPLETED:
      return `
<!DOCTYPE html>
<html>
<head>
  <style>${baseStyles}</style>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ಒಪ್ಪಂದ ಪೂರ್ಣಗೊಂಡಿದೆ</h1>
    </div>
    <div class="content">
      <p>ನಮಸ್ಕಾರ ${recipientName},</p>
      <p>ನಿಮ್ಮ ಒಪ್ಪಂದವನ್ನು ಪೂರ್ಣಗೊಂಡಂತೆ ಗುರುತಿಸಲಾಗಿದೆ.</p>
      
      <div class="detail">
        <p><strong>ಉತ್ಪನ್ನ:</strong> ${productName}</p>
        <p><strong>ಒಪ್ಪಂದ ಐಡಿ:</strong> ${dealId}</p>
      </div>
      
      <p>ಫಾರ್ಮ್ ಟು ಟೇಬಲ್ ಬಳಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಈ ವಹಿವಾಟು ಯಶಸ್ವಿಯಾಗಿದೆ ಎಂದು ನಾವು ಭಾವಿಸುತ್ತೇವೆ!</p>
      
      <a href="${platformUrl}/my-deals" class="button">ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ</a>
    </div>
    
    <div class="footer">
      <p>ಇದು ಸ್ವಯಂಚಾಲಿತ ವ್ಯವಹಾರ ಸಂದೇಶವಾಗಿದೆ. ದಯವಿಟ್ಟು ಈ ಇಮೇಲ್‌ಗೆ ಉತ್ತರಿಸಬೇಡಿ.</p>
      <p>ಫಾರ್ಮ್ ಟು ಟೇಬಲ್ - ರೈತರನ್ನು ನೇರವಾಗಿ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು</p>
    </div>
  </div>
</body>
</html>`;

    default:
      return `
<!DOCTYPE html>
<html>
<head>
  <style>${baseStyles}</style>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ಒಪ್ಪಂದ ನವೀಕರಣ</h1>
    </div>
    <div class="content">
      <p>ನಮಸ್ಕಾರ ${recipientName},</p>
      <p>ನಿಮ್ಮ ಒಪ್ಪಂದಕ್ಕೆ (ಐಡಿ: ${dealId}) ನವೀಕರಣವಿದೆ.</p>
      <p>ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಆಗಿ.</p>
      
      <a href="${platformUrl}/my-deals" class="button">ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ</a>
    </div>
    
    <div class="footer">
      <p>ಫಾರ್ಮ್ ಟು ಟೇಬಲ್ - ರೈತರನ್ನು ನೇರವಾಗಿ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು</p>
    </div>
  </div>
</body>
</html>`;
  }
}

// ---------------------------------------------------------------- English
/**
 * Get email subject based on event type and recipient role
 * @param {string} eventType - Notification event type
 * @param {string} recipientRole - 'farmer' or 'buyer'
 * @returns {string} - Email subject line
 */
function getEmailSubject(eventType, recipientRole) {
  switch (eventType) {
    case NOTIFICATION_EVENTS.DEAL_CONFIRMED:
      return recipientRole === "farmer"
        ? "Deal Confirmed - Buyer is Ready to Proceed"
        : "Deal Confirmed - Farmer Accepted Your Request";

    case NOTIFICATION_EVENTS.DEAL_COMPLETED:
      return "Deal Completed - Transaction Successful";

    default:
      return "Farm To Table - Deal Update";
  }
}

/**
 * Generate plain text email body
 * @param {string} eventType - Notification event type
 * @param {object} data - Email template data
 * @returns {string} - Plain text email body
 */
function getEmailBodyPlainText(eventType, data) {
  const { recipientName, productName, dealId, otherPartyName } = data;

  switch (eventType) {
    case NOTIFICATION_EVENTS.DEAL_CONFIRMED:
      return data.recipientRole === "farmer"
        ? `Hello ${recipientName},

Great news! Your deal has been confirmed.

Product: ${productName}
Buyer: ${otherPartyName}
Deal ID: ${dealId}

Both you and the buyer have confirmed this deal. You can now proceed with the transaction using the contact details provided on the platform.

Please log in to Farm To Table to view full deal details and coordinate delivery.

Thank you for using Farm To Table!

---
This is an automated transactional message. Please do not reply to this email.
Farm To Table - Connecting Farmers Directly to Buyers`
        : `Hello ${recipientName},

Great news! Your deal has been confirmed.

Product: ${productName}
Farmer: ${otherPartyName}
Deal ID: ${dealId}

Both you and the farmer have confirmed this deal. You can now proceed with payment and coordinate delivery using the contact details on the platform.

Please log in to Farm To Table to view payment information and delivery details.

Thank you for using Farm To Table!

---
This is an automated transactional message. Please do not reply to this email.
Farm To Table - Connecting Farmers Directly to Buyers`;

    case NOTIFICATION_EVENTS.DEAL_COMPLETED:
      return `Hello ${recipientName},

Your deal has been marked as completed.

Product: ${productName}
Deal ID: ${dealId}

Thank you for using Farm To Table. We hope this transaction was successful.

You can leave feedback for this deal by visiting your dashboard.

Thank you for being part of our community!

---
This is an automated transactional message. Please do not reply to this email.
Farm To Table - Connecting Farmers Directly to Buyers`;

    default:
      return `Hello ${recipientName},

There has been an update to your deal (ID: ${dealId}).

Please log in to Farm To Table to view details.

Thank you!

---
Farm To Table - Connecting Farmers Directly to Buyers`;
  }
}

/**
 * Generate HTML email body (optional, for better formatting)
 * @param {string} eventType - Notification event type
 * @param {object} data - Email template data
 * @returns {string} - HTML email body
 */
function getEmailBodyHTML(eventType, data) {
  const {
    recipientName,
    productName,
    dealId,
    otherPartyName,
    platformUrl = "https://farmtotable.app",
  } = data;

  const baseStyles = `
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10B981; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 5px; margin: 20px 0; }
    .detail { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #10B981; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
    .button { display: inline-block; background: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  `;

  switch (eventType) {
    case NOTIFICATION_EVENTS.DEAL_CONFIRMED:
      return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>Deal Confirmed!</h1>
    </div>
    <div class="content">
      <p>Hello ${recipientName},</p>
      <p><strong>Great news!</strong> Your deal has been confirmed by both parties.</p>
      
      <div class="detail">
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>${
          data.recipientRole === "farmer" ? "Buyer" : "Farmer"
        }:</strong> ${otherPartyName}</p>
        <p><strong>Deal ID:</strong> ${dealId}</p>
      </div>
      
      <p>${
        data.recipientRole === "farmer"
          ? "You can now coordinate with the buyer for payment and delivery arrangements."
          : "You can now proceed with payment and coordinate delivery with the farmer."
      }</p>
      
      <a href="${platformUrl}/my-deals" class="button">View Deal Details</a>
    </div>
    
    <div class="footer">
      <p>This is an automated transactional message. Please do not reply to this email.</p>
      <p>Farm To Table - Connecting Farmers Directly to Buyers</p>
    </div>
  </div>
</body>
</html>`;

    case NOTIFICATION_EVENTS.DEAL_COMPLETED:
      return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>Deal Completed</h1>
    </div>
    <div class="content">
      <p>Hello ${recipientName},</p>
      <p>Your deal has been marked as completed.</p>
      
      <div class="detail">
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Deal ID:</strong> ${dealId}</p>
      </div>
      
      <p>Thank you for using Farm To Table. We hope this transaction was successful!</p>
      
      <a href="${platformUrl}/my-deals" class="button">Leave Feedback</a>
    </div>
    
    <div class="footer">
      <p>This is an automated transactional message. Please do not reply to this email.</p>
      <p>Farm To Table - Connecting Farmers Directly to Buyers</p>
    </div>
  </div>
</body>
</html>`;

    default:
      return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>Deal Update</h1>
    </div>
    <div class="content">
      <p>Hello ${recipientName},</p>
      <p>There has been an update to your deal (ID: ${dealId}).</p>
      <p>Please log in to view details.</p>
      
      <a href="${platformUrl}/my-deals" class="button">View Details</a>
    </div>
    
    <div class="footer">
      <p>Farm To Table - Connecting Farmers Directly to Buyers</p>
    </div>
  </div>
</body>
</html>`;
  }
}

/**
 * Prepare email data for sending with language support
 * @param {string} eventType - Notification event type
 * @param {object} deal - Deal object
 * @param {object} product - Product object
 * @param {object} recipient - Recipient user object
 * @param {object} otherParty - Other party user object (farmer/buyer)
 * @returns {object} - Complete email data
 */
function prepareEmailData(
  eventType,
  deal,
  product,
  recipient,
  otherParty
) {
  // Determine recipient's language (default to English)
  const language = recipient.language || SUPPORTED_LANGUAGES.EN;
  const isKannada = language === SUPPORTED_LANGUAGES.KN;

  // Prepare template data
  const templateData = {
    recipientName: recipient.name,
    recipientRole: recipient.role,
    productName: product.cropName,
    dealId: deal.id,
    otherPartyName: otherParty.name,
  };

  return {
    to: recipient.email,
    subject: isKannada
      ? getEmailSubjectKannada(eventType, recipient.role)
      : getEmailSubject(eventType, recipient.role),
    text: isKannada
      ? getEmailBodyPlainTextKannada(eventType, templateData)
      : getEmailBodyPlainText(eventType, templateData),
    html: isKannada
      ? getEmailBodyHTMLKannada(eventType, templateData)
      : getEmailBodyHTML(eventType, templateData),
    language, // Include language for logging
  };
}

module.exports = {
  NOTIFICATION_EVENTS,
  SUPPORTED_LANGUAGES,
  getEmailSubject,
  getEmailBodyPlainText,
  getEmailBodyHTML,
  getEmailSubjectKannada,
  getEmailBodyPlainTextKannada,
  getEmailBodyHTMLKannada,
  prepareEmailData,
};
