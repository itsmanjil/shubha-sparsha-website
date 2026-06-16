import nodemailer from 'nodemailer'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'shubhasparshanp@gmail.com'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, phone, event_type, message } = req.body || {}

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const eventLabel = event_type || 'Event Planning'

  // Email to admin
  const adminMail = {
    from: `"Shubha Sparsha Website" <${process.env.SMTP_USER}>`,
    to: ADMIN_EMAIL,
    replyTo: email,
    subject: `New Enquiry from ${name} — ${eventLabel}`,
    text: [
      `New enquiry received via the website.`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      `Event type: ${eventLabel}`,
      ``,
      `Message:`,
      message,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #2a0000;">
        <div style="background: #2a0000; padding: 24px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0; font-size: 20px; letter-spacing: 1px;">New Enquiry</h1>
        </div>
        <div style="padding: 24px; background: #fffdf5;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #8a6d00; width: 110px;">Name</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 8px 0; color: #8a6d00;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #2a0000;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #8a6d00;">Phone</td><td style="padding: 8px 0;">${escapeHtml(phone || 'Not provided')}</td></tr>
            <tr><td style="padding: 8px 0; color: #8a6d00;">Event</td><td style="padding: 8px 0;">${escapeHtml(eventLabel)}</td></tr>
          </table>
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5d9b0;">
            <p style="color: #8a6d00; font-size: 14px; margin: 0 0 8px;">Message</p>
            <p style="font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin: 0;">${escapeHtml(message)}</p>
          </div>
        </div>
      </div>
    `,
  }

  // Confirmation to visitor
  const visitorMail = {
    from: `"Shubha Sparsha" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Thank you for your enquiry — Shubha Sparsha',
    text: [
      `Dear ${name},`,
      ``,
      `Thank you for reaching out to Shubha Sparsha about ${eventLabel.toLowerCase()}.`,
      `We've received your enquiry and our team will get back to you within 24 hours to begin planning your celebration.`,
      ``,
      `Here's a copy of what you sent us:`,
      message,
      ``,
      `Warm regards,`,
      `The Shubha Sparsha Team`,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #2a0000;">
        <div style="background: #2a0000; padding: 32px 24px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0; font-size: 24px; font-family: Georgia, serif;">Shubha Sparsha</h1>
          <p style="color: rgba(247,236,208,0.6); margin: 8px 0 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">Event Planning</p>
        </div>
        <div style="padding: 32px 24px; background: #fffdf5;">
          <p style="font-size: 15px; line-height: 1.7;">Dear ${escapeHtml(name)},</p>
          <p style="font-size: 15px; line-height: 1.7;">Thank you for reaching out to us about <strong>${escapeHtml(eventLabel.toLowerCase())}</strong>. We've received your enquiry and our team will get back to you within <strong>24 hours</strong> to begin planning your celebration.</p>
          <div style="margin: 24px 0; padding: 16px; background: #f7ecd0; border-left: 3px solid #d4af37;">
            <p style="color: #8a6d00; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Your message</p>
            <p style="font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin: 0;">${escapeHtml(message)}</p>
          </div>
          <p style="font-size: 15px; line-height: 1.7;">Warm regards,<br/><strong>The Shubha Sparsha Team</strong></p>
        </div>
        <div style="padding: 16px 24px; background: #2a0000; text-align: center;">
          <p style="color: rgba(247,236,208,0.5); font-size: 11px; margin: 0;">This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  }

  // Both sends must be awaited — in serverless, un-awaited promises are
  // killed when the function freezes after the response is returned.
  const [adminResult, visitorResult] = await Promise.allSettled([
    transporter.sendMail(adminMail),
    transporter.sendMail(visitorMail),
  ])

  if (visitorResult.status === 'rejected') {
    console.error('Visitor confirmation failed:', visitorResult.reason?.message)
  }

  // Admin notification is the critical path
  if (adminResult.status === 'rejected') {
    console.error('Admin email failed:', adminResult.reason?.message)
    return res.status(500).json({ error: 'Failed to send email' })
  }

  return res.status(200).json({ success: true, visitorEmailed: visitorResult.status === 'fulfilled' })
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
