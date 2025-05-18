const mongoose = require("mongoose");
const ticketschema = require("./ticketschema");

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true });

const createTicket = async (
  wallet,
  raffeltype,
  ticketcount,
  time,
  hash,
  giveawayhash,
  network,
) => {
  try {
    const userExists = await ticketschema.findOne({ hash });
    if (userExists) {
      return { durum: false, error: "Has already been registered." };
    }
    const ticket = await ticketschema.create({
      wallet,
      raffeltype,
      ticketcount,
      time,
      hash,
      giveawayhash,
      network,
    });
    return { durum: true, user: ticket };
  } catch (error) {
    return { durum: false, error: error.message };
  }
};

module.exports = createTicket;
