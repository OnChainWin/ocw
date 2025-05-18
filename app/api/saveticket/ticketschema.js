// ticketschema.js
const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  wallet: String,
  raffeltype: String,
  ticketcount: Number,
  time: Date,
  hash: String,
  giveawayhash: String,
  network: String,
});

module.exports =
  mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
