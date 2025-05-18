const mongoose = require("mongoose");
const winnerschema = require("./winnerschema");
const fs = require("fs");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {});

const createTicket = async (
  wallet,
  raffeltype,
  time,
  hash,
  prizeamount,
  giveawayhash,
  rewardToken,
  network,
) => {
  try {
    const userExists = await winnerschema.findOne({ hash, wallet });
    if (userExists) {
      return { durum: false, error: "Has already been registered." };
    } else {
      const ticket = await winnerschema.create({
        wallet,
        raffeltype,
        time,
        hash,
        prizeamount,
        giveawayhash,
        rewardToken,
        network,
      });
      return { durum: true, user: ticket };
    }
  } catch (error) {
    return { durum: false, error: error.message };
  }
};

module.exports = createTicket;
