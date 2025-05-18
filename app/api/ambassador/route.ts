import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return Response.json(
      { error: "Resend API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const { name, email, details, socialChannels } = await request.json();

    if (!name || !email || !details) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "e.kaya@onchainwin.com",
      subject: "New Ambassador Application",
      html: `
        <h3>Ambassador Application</h3>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
          <li>Details: ${details}</li>
          <h4>Social Channels:</h4>
          <li>Discord: ${socialChannels?.discord || "Not provided"}</li>
          <li>Telegram: ${socialChannels?.telegram || "Not provided"}</li>
          <li>X (Twitter): ${socialChannels?.x || "Not provided"}</li>
        </ul>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: error.message || "Failed to send email" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Application submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
