const mongoose = require("mongoose");
const userschema = require("./userschema");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createDbUser = async (wallet, email, usedrefcode) => {
  const randomToken = Math.floor(100000 + Math.random() * 900000);
  function generateReferralCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let referralCode = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      referralCode += characters[randomIndex];
    }
    return referralCode;
  }
  try {
    const refcodegen = generateReferralCode();
    const thecode = usedrefcode || "girilmedi"; // Ensure empty string instead of null
    console.log(refcodegen);
    // Check if user exists
    const userExists = await userschema.findOne({ email });
    if (userExists) {
      if (userExists.emailverified === false) {
        return {
          durum: false,
          error: "New verification code send to your mailbox",
          mail: true,
          user: userExists,
        };
      }
      return { durum: false, error: "It seems you have already registered!" };
    } else {
      const userExists2 = await userschema.findOne({ wallet });
      if (userExists2) {
        return { durum: false, error: "It seems you have already registered!" };
      }
    }
    // Log the data before creation for verification
    console.log({
      wallet,
      email,
      randomToken,
      refcodegen,
      premium: false,
      thecode,
    });

    // Create the user
    const user = await userschema.create({
      wallet,
      email,
      emailverified: false,
      emailverificationtoken: randomToken,
      refcode: refcodegen,
      premium: false,
      usedrefcode: thecode,
    });
    // Log the created user
    console.log("Created User:", user);
    return { durum: true, user: user };
  } catch (error) {
    return { durum: false, error: error.message };
  }
};

module.exports = createDbUser;
