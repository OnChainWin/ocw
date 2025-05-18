const mongoose = require("mongoose");
const userschema = require("./userschema");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkWallet = async (wallet) => {
  try {
    const userExists = await userschema.findOne({ wallet });
    if (userExists) {
      if (userExists.emailverified) {
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {}
};

module.exports = checkWallet;
