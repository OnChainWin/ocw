const mongoose = require('mongoose');
const userschema = require('./userschema');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const checkUser = async (wallet) => {
    try {
        // Check if user exists
        const userExists = await userschema.findOne({ wallet });
        console.log(userExists);

        if (userExists) {
            if (userExists.premium === true) {
                console.log("Already a premium member");
                return { durum: false, error: 'You are already a premium member!' };
            } else {
                console.log("Adding premium status");
                // Set premium to true and save the user
                userExists.premium = true;
                await userExists.save(); // This will directly save the updated document

                return { durum: true, user: userExists };
            }
        } else {
            return { durum: false, error: 'User not found!' };
        }
    } catch (error) {
        console.error(error.message);
        return { durum: false, error: error.message };
    }
};

module.exports = checkUser;

