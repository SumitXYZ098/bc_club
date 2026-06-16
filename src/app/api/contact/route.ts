import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as ContactFormData;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const message = body.message?.trim();

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    const recipients = [
      process.env.USER_EMAIL,
      ...(process.env.ADDITIONAL_EMAILS?.split(",") || []),
    ]
      .filter(Boolean)
      .map((item) => item!.trim())
      .join(",");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeMessage = escapeHtml(message);

    const adminHtmlTemplate = `
      <div style="margin:0;padding:30px;background:#f0f0f0;font-family:Arial,sans-serif;">
        <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(34,85,139,0.12);">

          <div style="background:#22558b;padding:30px;text-align:center;">
            <h1 style="margin:0;font-size:32px;color:#ffffff;">
              BC Real<span style="color:#eea500;">Estate Market</span>
            </h1>
            <p style="margin-top:10px;color:#f0f0f0;">
              New Contact Form Submission
            </p>
          </div>

          <div style="padding:35px 30px;">
            <div style="display:inline-block;padding:6px 12px;background:#14b51429;color:#14b514;border-radius:999px;font-size:13px;font-weight:600;">
              New Lead
            </div>

            <h2 style="margin:20px 0 10px;color:#22558b;font-size:24px;">
              New Lead Received
            </h2>

            <p style="color:#848484;line-height:1.7;font-size:15px;">
              A visitor submitted a new enquiry through your website contact form.
            </p>

            <div style="margin-top:25px;padding:20px;background:#f0f0f0;border-left:4px solid #eea500;border-radius:8px;">
              <p style="margin:0 0 10px;color:#333333;font-size:15px;">
                <strong>Name:</strong> ${safeName}
              </p>
              <p style="margin:0 0 10px;color:#333333;font-size:15px;">
                <strong>Email:</strong> ${safeEmail}
              </p>
              <p style="margin:0;color:#333333;font-size:15px;">
                <strong>Phone:</strong> ${safePhone}
              </p>
            </div>

            <div style="margin-top:25px;">
              <p style="margin:0 0 8px;color:#848484;font-size:13px;text-transform:uppercase;letter-spacing:1px;">
                Message
              </p>
              <div style="background:#ffffff;border:1px solid #0f0f0f29;padding:18px;border-radius:8px;color:#333333;line-height:1.7;font-size:15px;">
                ${safeMessage}
              </div>
            </div>

            <div style="margin-top:30px;">
              <a href="mailto:${safeEmail}" style="display:inline-block;background:#eea500;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:8px;font-weight:600;">
                Reply to Customer
              </a>
            </div>
          </div>

          <div style="background:#ffffff;padding:20px;text-align:center;border-top:1px solid #0f0f0f29;">
            <p style="margin:0;color:#848484;font-size:13px;">
              Submitted from BC RealEstate Market Contact Form
            </p>
          </div>

        </div>
      </div>
    `;

    const userHtmlTemplate = `
      <div style="margin:0;padding:30px;background:#f0f0f0;font-family:Arial,sans-serif;">
        <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(34,85,139,0.12);">

          <div style="background:#22558b;padding:30px;text-align:center;">
            <h1 style="margin:0;font-size:32px;color:#ffffff;">
              BC Real<span style="color:#eea500;">Estate Market</span>
            </h1>
            <p style="margin-top:10px;color:#f0f0f0;">
              Contact Request Received
            </p>
          </div>

          <div style="padding:35px 30px;">
            <h2 style="margin:0 0 12px;color:#22558b;font-size:24px;">
              Thank You, ${safeName}!
            </h2>

            <p style="color:#333333;line-height:1.8;font-size:15px;">
              We have received your message and appreciate you contacting BC RealEstate Market.
            </p>

            <p style="color:#333333;line-height:1.8;font-size:15px;">
              Our team will review your enquiry and get back to you as soon as possible.
            </p>

            <div style="margin:25px 0;padding:20px;background:#f0f0f0;border-left:4px solid #eea500;border-radius:8px;">
              <strong style="color:#22558b;font-size:16px;">
                Your Message
              </strong>
              <p style="margin:12px 0 0;color:#333333;line-height:1.7;font-size:15px;">
                ${safeMessage}
              </p>
            </div>

            <p style="color:#848484;line-height:1.7;font-size:14px;">
              Regards,<br />
              <strong style="color:#22558b;">BC RealEstate Market Team</strong>
            </p>
          </div>

          <div style="background:#ffffff;padding:20px;text-align:center;border-top:1px solid #0f0f0f29;">
            <p style="margin:0;color:#848484;font-size:13px;">
              This is an automated confirmation email.
            </p>
          </div>

        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"BC RealEstate Market" <${process.env.USER_EMAIL}>`,
      to: recipients,
      subject: `New Enquiry from ${safeName}`,
      html: adminHtmlTemplate,
      replyTo: email,
    });

    await transporter.sendMail({
      from: `"BC RealEstate Market" <${process.env.USER_EMAIL}>`,
      to: email,
      subject: "Thank You for Contacting BC RealEstate Market",
      html: userHtmlTemplate,
      replyTo: process.env.USER_EMAIL,
    });

    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending contact email:", error);

    return NextResponse.json(
      { message: "Failed to send email!" },
      { status: 500 },
    );
  }
}
