import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  pool: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  },
});

transporter.verify(function (error) {
  if (error) {
    console.log("Connection error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export const sendAdminLeadMail = async (lead) => {
  const {
    name,
    email,
    phone,
    industry,
    message,
    utm_source,
    utm_medium,
    utm_campaign,
    gclid,
    lpurl,
    createdAt,
  } = lead;

  return transporter.sendMail({
    from: `"e-Marketing Leads" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🚀 New Lead Received — ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; background:#f4f4f5; padding:20px">
        <div style="max-width:700px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden">

          <div style="background:#18181b; color:#facc15; padding:16px">
            <h2 style="margin:0">📩 New Lead Alert</h2>
          </div>

          <div style="padding:20px">
            <p style="margin-bottom:16px">
              A new lead has been submitted through your website.
            </p>

            <table width="100%" cellpadding="10" cellspacing="0" 
              style="border-collapse:collapse; font-size:14px">
              <tr style="background:#f9fafb">
                <td><strong>Name</strong></td>
                <td>${name}</td>
              </tr>
              <tr>
                <td><strong>Email</strong></td>
                <td>${email}</td>
              </tr>
              <tr style="background:#f9fafb">
                <td><strong>Phone</strong></td>
                <td>${phone}</td>
              </tr>
              <tr>
                <td><strong>Industry</strong></td>
                <td>${industry}</td>
              </tr>
              <tr style="background:#f9fafb">
                <td><strong>Message</strong></td>
                <td>${message || "-"}</td>
              </tr>
              <tr>
                <td><strong>UTM Source</strong></td>
                <td>${utm_source || "-"}</td>
              </tr>
              <tr style="background:#f9fafb">
                <td><strong>UTM Medium</strong></td>
                <td>${utm_medium || "-"}</td>
              </tr>
              <tr>
                <td><strong>UTM Campaign</strong></td>
                <td>${utm_campaign || "-"}</td>
              </tr>
              <tr style="background:#f9fafb">
                <td><strong>GCLID</strong></td>
                <td>${gclid || "-"}</td>
              </tr>
              <tr>
                <td><strong>LPUrl</strong></td>
                <td>${lpurl}</td>
              </tr>
                            <tr style="background:#f9fafb">
                <td><strong>Submitted At</strong></td>
                <td>${new Date(createdAt).toLocaleString()}</td>
              </tr>
            </table>

            <div style="margin-top:20px; text-align:center">
              <a href="${process.env.ADMIN_PANEL_URL}/admin/leads"
                 style="background:#facc15; color:#000; padding:10px 16px;
                        border-radius:6px; text-decoration:none; font-weight:600">
                View in Dashboard
              </a>
            </div>
          </div>

          <div style="background:#f4f4f5; padding:12px; font-size:12px; text-align:center">
            e-Marketing Admin Notification
          </div>

        </div>
      </div>
    `,
  });
};

export const sendLeadMail = async ({ name, email }) => {
  return transporter.sendMail({
    from: `"e-Marketing" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Thanks for contacting us!",
    html: `
      <h3>Hello ${name},</h3>
      <p>Thanks for reaching out to us.</p>
      <p>Our team will contact you shortly.</p>
      <br/>
      <p>Regards,<br/>e-Marketing Team</p>
    `,
  });
};
