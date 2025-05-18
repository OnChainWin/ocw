export const dynamic = "force-dynamic"; // defaults to auto
const fs = require("fs");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_TOKEN);

const createDbUser = require("./dbmanager");
const checkWallet = require("./dbmanager");

export async function GET(request) {
  return Response.json({ message: "Hello World" });
}

export async function POST(req, res) {
  console.log("Calistim");
  const body = await req.json();
  const { wallet, email, usedrefcode } = body;
  console.log(wallet + email + usedrefcode);
  const cuser = await createDbUser(wallet, email, usedrefcode);

  console.log(cuser);
  if (cuser.durum) {
    const { data, error } = await resend.emails.send({
      from: "support@onchainwin.com",
      to: [cuser.user.email],
      subject: "OCW || Your verification code",
      html: `<strong>Your verification code is: ${cuser.user.emailverificationtoken}</strong>`,
    });
    if (error) {
      return console.error({ error });
    }

    console.log({ data });
    return Response.json({ durum: true, user: cuser.user });
  } else {
    if(cuser.mail){
      const { data, error } = await resend.emails.send({
        from: "support@onchainwin.com",
        to: [cuser.user.email],
        subject: "OCW || Your verification code",
        html: `<strong>Your verification code is: ${cuser.user.emailverificationtoken}</strong>`,
      });
    }
    return Response.json({ durum: false, error: cuser.error });
  }
}
