export const dynamic = 'force-dynamic' // defaults to auto
const fs = require('fs');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_TOKEN);

const checkWallet = require('./dbmanager');

export async function GET(request) {
  const url = new URL(request.url);
  const wallet = url.searchParams.get('wallet');
  
  if (!wallet) {
      return new Response(JSON.stringify({ error: 'Wallet query parameter is required' }), { status: 400 });
  }

  const vstatus = await checkWallet(wallet);

  return new Response(JSON.stringify({ durum: vstatus }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}