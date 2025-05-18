export const dynamic = "force-dynamic"; // defaults to auto
const fs = require("fs");

const createTicket = require("./dbmanager");

export async function GET(request) {
  return Response.json({ message: "Hello World" });
}

export async function POST(req, res) {
  console.log("SA");
  const body = await req.json();
  const { wallet, raffeltype, ticketcount, time, hash, giveawayhash, network } =
    body;

  const cuser = await createTicket(
    wallet,
    raffeltype,
    ticketcount,
    time,
    hash,
    giveawayhash,
    network,
  );

  console.log(cuser);

  if (cuser.durum) {
    return Response.json({ durum: true, user: cuser.user });
  } else {
    return Response.json({ durum: false, error: cuser.error });
  }
}
