export const dynamic = 'force-dynamic' // defaults to auto
const fs = require('fs');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_TOKEN);

const checkUser = require('./dbmanager');

export async function GET(request) {

    return Response.json({ message: 'Hello World'})
  }

  export async function POST(req, res) {

    const body = await req.json()
    const {wallet} = body
    const cuser = await checkUser(wallet);

    console.log(cuser);
    if (cuser.durum) {
        return Response.json({durum:true ,user: cuser.user });
    } else {
        return Response.json({durum:false, error: cuser.error });
    }
  }