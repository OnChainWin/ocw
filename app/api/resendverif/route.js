export const dynamic = "force-dynamic";

const resendToken = require("./dbmanager");

export async function GET(request) {
  console.log(request);
  const { mail } = request.query;
  const vstatus = await resendToken(mail);

  return Response.json({ status: vstatus });
}
