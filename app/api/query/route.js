import mongoose from "mongoose";
import user from "./userschema";
import ticket from "./ticketschema";
import winner from "./winnerschema";

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB bağlantısı başarılı!"))
  .catch((error) => console.error("MongoDB bağlantı hatası:", error));

export async function POST(req) {
  try {
    const body = await req.json();
    const { querytype, query } = body;

    if (querytype === "user") {
      let cuser;

      if (query.includes("@")) {
        cuser = await user.findOne({ email: query });
      } else {
        cuser = await user.findOne({ wallet: query });
      }

      if (cuser) {
        return new Response(JSON.stringify({ durum: true, user: cuser }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(
          JSON.stringify({ durum: false, error: "User Not Found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    } else if (querytype === "ticket") {
      let cticket;

      if (
        [
          "Paid",
          "Free",
          "Free3",
          "TokenPaid",
          "Partnership",
          "Partnership2",
          "Sales",
          "Christmas",
          "NewYear",
          "PaidBase",
          "FreeBase",
          "Free3Base",
          "TokenPaidBase",
          "BasePartnershipFree",
          "BasePartnership2Free",
          "B2B",
        ].includes(query)
      ) {
        cticket = await ticket.find({ raffeltype: query });
      } else if (query === "all") {
        cticket = await ticket.find({}).sort({ time: -1 });
      } else if (query.length > 43) {
        cticket = await ticket.find({ hash: query });
      } else {
        cticket = await ticket.find({ wallet: query });
      }

      if (cticket.length > 0) {
        return new Response(JSON.stringify({ durum: true, ticket: cticket }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(
          JSON.stringify({ durum: false, error: "Ticket Not Found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    } else if (querytype === "winner") {
      let cwinner;

      if (
        [
          "Paid",
          "Free",
          "Free3",
          "TokenPaid",
          "Partnership",
          "Partnership2",
          "Sales",
          "Christmas",
          "NewYear",
          "PaidBase",
          "FreeBase",
          "Free3Base",
          "TokenPaidBase",
          "BasePartnership2Free",
          "BasePartnershipFree",
          "B2B",
        ].includes(query)
      ) {
        cwinner = await winner.find({ raffeltype: query });
      } else if (query === "all") {
        cwinner = await winner.find({}).sort({ time: -1 });
      } else if (query.length > 43) {
        cwinner = await winner.find({ hash: query });
      } else {
        cwinner = await winner.find({ wallet: query });
      }

      if (cwinner.length > 0) {
        return new Response(JSON.stringify({ durum: true, winner: cwinner }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(
          JSON.stringify({ durum: false, error: "Winner Not Found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    } else {
      return new Response(
        JSON.stringify({ durum: false, error: "Invalid Query Type" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ durum: false, error: "Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
