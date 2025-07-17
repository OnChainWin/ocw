export const dynamic = "force-dynamic"; // defaults to auto
const fs = require("fs");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_TOKEN);

const resendToken = require("./dbmanager");

export async function GET(request) {
  console.log(request);
  const { mail } = request.query;
  const vstatus = await resendToken(mail);

  return Response.json({ status: vstatus });
}
