// winnerschema.js
const mongoose = require("mongoose");

const WinnerSchema = new mongoose.Schema({
  wallet: String,
  raffeltype: String,
  time: Date,
  hash: String,
  prizeamount: String,
  giveawayhash: String,
  rewardToken: String,
  network: String,
});

module.exports =
  mongoose.models.Winner || mongoose.model("Winner", WinnerSchema);
