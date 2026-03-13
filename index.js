const xrpl = require('xrpl');

async function main() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();

  const donorWallet = xrpl.Wallet.fromSeed('YOUR_DONOR_SEED_HERE');
  const ngoWallet = xrpl.Wallet.fromSeed('YOUR_NGO_SEED_HERE');

  // Create escrow (lock 100 XRP for 1 hour)
  const escrowTx = await client.submitAndWait({
    TransactionType: 'EscrowCreate',
    Account: donorWallet.address,
    Amount: xrpl.xrpToDrops(100), // 100 XRP
    Destination: ngoWallet.address,
    FinishAfter: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
  }, { wallet: donorWallet });
  console.log('Escrow created:', escrowTx);

  // To finish (release) after condition met (manual for prototype)
  // const finishTx = await client.submitAndWait({ TransactionType: 'EscrowFinish', ... }, { wallet: ngoWallet });

  await client.disconnect();
}

main().catch(console.error);
