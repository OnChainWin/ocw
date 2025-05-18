import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request, res: Response) {
  const { email, names, mail, wallet } = await request.json();

  const { data, error } = await resend.emails.send({
    from: "OCW <onboarding@resend.dev>",
    to: "support@onchainwin.com",
    subject: "New Beta Request",
    html: `
    <h3>Customer Information</h3>
    <li>Name: ${names}</li>
    <li>E-mail: ${mail}</li>
    <li>Wallet: ${wallet}</li>
    `,
  });

  if (error) {
    return Response.json(error);
  }

  return Response.json({ message: "Email sent successfully" });
}

//     try {
//       const data = await resend.emails.send({
//         from: 'Acme <onboarding@resend.dev>',
//         to: ['delivered@resend.dev'],
//         subject: 'Hello world',
//         react: render(WelcomeTemplate({ userFirstName })),
//       });

//       return Response.json(data);
//     } catch (error) {
//       return Response.json({ error });
//     }
//   }
