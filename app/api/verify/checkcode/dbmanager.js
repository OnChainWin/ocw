const mongoose = require('mongoose');
const userschema = require('./userschema');


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const checkUser = async (email, emailverificationtoken) => {
    try {
        // Check if user exists
        const userExists = await userschema.findOne({ email });
        console.log(userExists);


        if (userExists) {
            if(userExists.emailverified){
                console.log("Already");
                return {durum: false, error: 'You have already verified your email'}
            }else{
                if(userExists.emailverificationtoken === emailverificationtoken){
                    console.log("Verified");
                    await userschema.updateOne({email : email}, {emailverified: true});
                    return {durum: true, user: userExists}
                 }else{
                    console.log("Wrong Code");
                    return {durum: false, error: 'The code you entered is incorrect!'}
                }
            }
        }


    } catch (error) {
        return {durum: false, error: error.message}
    }
};

module.exports = checkUser;