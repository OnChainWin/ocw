export const dynamic = "force-dynamic"; // defaults to auto
const fs = require("fs");

const createTicket = require("./dbmanager");

export async function GET(request) {
  return Response.json({ message: "Hello World" });
}

export async function POST(req, res) {
  const body = await req.json();
  let {
    wallet,
    raffeltype,
    time,
    hash,
    prizeamount,
    giveawayhash,
    rewardToken,
    network,
  } = body;

  if (!rewardToken) {
    rewardToken = "notoken";
  }
  if (raffeltype == "Partnership") {
    prizeamount = 666; // bunu değiştir istediğinde Raffle çeşidine göre listeleyebilirim böyle
  }
  if (raffeltype == "Partnership2") {
    prizeamount = 1111; // bunu değiştir istediğinde Raffle çeşidine göre listeleyebilirim böyle
  }

  const cuser = await createTicket(
    wallet,
    raffeltype,
    time,
    hash,
    prizeamount,
    giveawayhash,
    rewardToken,
    network,
  );

  if (cuser.durum) {
    return Response.json({ durum: true, user: cuser.user });
  } else {
    return Response.json({ durum: false, error: cuser.error });
  }
}
