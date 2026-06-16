import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

interface NewsletterData {
  email: string;
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
    const body = (await req.json()) as NewsletterData;
    const email = body.email?.trim();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
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

    const safeEmail = escapeHtml(email);

    const adminHtmlTemplate = `
      <div style="margin:0;padding:30px;background:#f0f0f0;font-family:Arial,sans-serif;">
        <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(34,85,139,0.12);">

          <div style="background:#22558b;padding:30px;text-align:center;">
            <h1 style="margin:0;font-size:32px;font-weight:700;color:#ffffff;">
              BC Real<span style="color:#eea500;">Estate Market</span>
            </h1>
            <p style="margin-top:10px;color:#f0f0f0;font-size:14px;">
              New Newsletter Subscription
            </p>
          </div>

          <div style="padding:35px 30px;">
            <div style="display:inline-block;padding:6px 12px;background:#14b51429;color:#14b514;border-radius:999px;font-size:13px;font-weight:600;">
              New Subscriber
            </div>

            <h2 style="margin:20px 0 10px;color:#22558b;font-size:24px;">
              Someone Joined Your Newsletter
            </h2>

            <p style="color:#848484;line-height:1.7;font-size:15px;">
              A visitor has subscribed to receive updates, property insights, and real estate news from your website.
            </p>

            <div style="margin-top:25px;padding:20px;background:#f0f0f0;border-left:4px solid #eea500;border-radius:8px;">
              <p style="margin:0 0 8px;color:#848484;font-size:13px;text-transform:uppercase;letter-spacing:1px;">
                Subscriber Email
              </p>
              <p style="margin:0;color:#333333;font-size:20px;font-weight:700;">
                ${safeEmail}
              </p>
            </div>

            <div style="margin-top:30px;">
              <a href="mailto:${safeEmail}" style="display:inline-block;background:#eea500;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:8px;font-weight:600;">
                Reply to Subscriber
              </a>
            </div>
          </div>

          <div style="background:#ffffff;padding:20px;text-align:center;border-top:1px solid #0f0f0f29;">
            <p style="margin:0;color:#848484;font-size:13px;">
              This subscription was submitted through the BC RealEstate Market website.
            </p>
          </div>

        </div>
      </div>
    `;

    const userHtmlTemplate = `
      <div style="margin:0;padding:30px;background:#f0f0f0;font-family:Arial,sans-serif;">
        <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(34,85,139,0.12);">

          <div style="background:#22558b;padding:30px;text-align:center;">
            <h1 style="margin:0;font-size:32px;font-weight:700;color:#ffffff;">
              BC Real<span style="color:#eea500;">Estate Market</span>
            </h1>
            <p style="margin-top:10px;color:#f0f0f0;font-size:14px;">
              Welcome to Our Newsletter
            </p>
          </div>

          <div style="padding:35px 30px;">
            <h2 style="margin:0 0 12px;color:#22558b;font-size:24px;">
              Thanks for subscribing!
            </h2>

            <p style="color:#333333;line-height:1.8;font-size:15px;">
              Thank you for subscribing to the BC RealEstate Market newsletter.
            </p>

            <p style="color:#333333;line-height:1.8;font-size:15px;">
              You'll receive real estate market updates, property insights, new listing alerts, and community trends from across British Columbia.
            </p>

            <div style="margin:25px 0;padding:20px;background:#f0f0f0;border-left:4px solid #eea500;border-radius:8px;">
              <strong style="color:#22558b;font-size:16px;">
                Stay informed. Stay ahead of the market.
              </strong>
            </div>

            <p style="color:#848484;line-height:1.7;font-size:14px;">
              Thank you,<br />
              <strong style="color:#22558b;">BC RealEstate Market Team</strong>
            </p>
          </div>

          <div style="background:#ffffff;padding:20px;text-align:center;border-top:1px solid #0f0f0f29;">
            <p style="margin:0;color:#848484;font-size:13px;">
              You received this email because you subscribed on the BC RealEstate Market website.
            </p>
          </div>

        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"BC RealEstate Market" <${process.env.USER_EMAIL}>`,
      to: recipients,
      subject: "New Newsletter Subscriber",
      html: adminHtmlTemplate,
      replyTo: email,
    });

    await transporter.sendMail({
      from: `"BC RealEstate Market" <${process.env.USER_EMAIL}>`,
      to: email,
      subject: "Welcome to BC RealEstate Market Newsletter",
      html: userHtmlTemplate,
      replyTo: process.env.USER_EMAIL,
    });

    return NextResponse.json({ message: "Subscription received!" });
  } catch (error) {
    console.error("Error sending newsletter email:", error);

    return NextResponse.json(
      { message: "Failed to process subscription." },
      { status: 500 },
    );
  }
}
