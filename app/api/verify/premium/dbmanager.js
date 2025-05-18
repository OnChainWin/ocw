const mongoose = require("mongoose");
const userschema = require("./userschema");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkUser = async (wallet) => {
  try {
    const userExists = await userschema.findOne({ wallet });
    console.log(userExists);

    if (userExists) {
      if (userExists.premium === true) {
        console.log("Already a premium member");
        return { durum: false, error: "You are already a premium member!" };
      } else {
        console.log("Adding premium status");
        userExists.premium = true;
        await userExists.save();

        return { durum: true, user: userExists };
      }
    } else {
      return { durum: false, error: "User not found!" };
    }
  } catch (error) {
    console.error(error.message);
    return { durum: false, error: error.message };
  }
};

module.exports = checkUser;
