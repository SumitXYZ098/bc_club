import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json();
  const { name, email, phone, message } = body as FormData;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const recipients = [
    ...(process.env.ADDITIONAL_EMAILS?.split(",") || []),
  ].join(",");

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #d4dde8; padding: 20px; text-align: center;">
      <h1 style="color:#22558b; font-size=48px">BC<span style="color:#eea500;">Club</span></h1>
      </div>
      <div style="padding: 20px;">
        <h2 style="color: #22558b;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f9f9f9; padding: 10px; border-radius: 5px;">${message}</p>
      </div>
      <div style="background-color: #f0f0f0; padding: 10px; text-align: center; color: #555;">
        This message was sent from your website contact form.
      </div>
    </div>
  `;

  const mailOptions = {
    from: email,
    to: recipients,
    subject: "New Enquiry from Get In Touch Form",
    html: htmlTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email!" },
      { status: 500 }
    );
  }
}
