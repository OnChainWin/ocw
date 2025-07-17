const mongoose = require('mongoose');
const userschema = require('./userschema');
const { Resend } = require('resend');


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const resend = new Resend(process.env.RESEND_TOKEN);

const resendToken = async (mail) => {
    try {
        const userExists = await userschema.findOne({ mail });
        if(userExists){
            if(!userExists.emailverified){
                const { data, error } = await resend.emails.send({
                    from: 'OCW <onboarding@resend.dev>',
                    to: [mail],
                    subject: 'OCW || Your verification code',
                    html: `<strong>Your verification code is: ${userExists.emailverificationtoken}</strong>`,
                  });
                  if (error) {
                    return {status:false,error: error.message}
                  }else{
                    return {status:true}
                  }
            }
        }
    } catch (error) {

    }}

module.exports = resendToken;