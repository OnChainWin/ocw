import mongoose from "mongoose";
import user from "./userschema";
import ticket from "./ticketschema";
import winner from "./winnerschema";

// MongoDB'ye bağlanma
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB bağlantısı başarılı!"))
  .catch((error) => console.error("MongoDB bağlantı hatası:", error));

export async function POST(req, res) {
  try {
    const body = await req.json();
    const { querytype, query, limit } = body;

    // Kullanıcı sorgulaması
    if (querytype === "user") {
      let cuser;

      if (query.includes("@")) {
        // E-posta ile sorgu
        cuser = await user.findOne({ email: query });
      } else {
        // Wallet ile sorgu
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
    }

    // Ticket sorgulaması
    else if (querytype === "ticket") {
      let cticket;

      // Belirli bir ticket türü ile sorgu
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
          "BaseMultipleWinnerFree",
        ].includes(query)
      ) {
        const ticketQuery = ticket.find({ raffeltype: query }).sort({ time: -1 });
        cticket = limit ? await ticketQuery.limit(limit) : await ticketQuery;
      } else if (query === "all") {
        // Tüm ticket'ları sırayla al
        const ticketQuery = ticket.find({}).sort({ time: -1 });
        cticket = limit ? await ticketQuery.limit(limit) : await ticketQuery;
      } else if (query.length > 43) {
        // Hash ile sorgu
        cticket = await ticket.find({ hash: query });
      } else {
        // Wallet ile sorgu
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
    }

    // Winner sorgulaması
    else if (querytype === "winner") {
      let cwinner;

      // Belirli winner türü ile sorgu
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
          "BaseMultipleWinnerFree",
        ].includes(query)
      ) {
        const winnerQuery = winner.find({ raffeltype: query }).sort({ time: -1 });
        cwinner = limit ? await winnerQuery.limit(limit) : await winnerQuery;
      } else if (query === "all") {
        // Tüm winner'ları sırayla al
        const winnerQuery = winner.find({}).sort({ time: -1 });
        cwinner = limit ? await winnerQuery.limit(limit) : await winnerQuery;
      } else if (query.length > 43) {
        // Hash ile sorgu
        cwinner = await winner.find({ hash: query });
      } else {
        // Wallet ile sorgu
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
    }

    // Geçersiz querytype durumu
    else {
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
