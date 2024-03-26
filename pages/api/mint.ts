import bs58 from 'bs58';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';

import {
  keypairIdentity,
  Metaplex,
} from '@metaplex-foundation/js';
import { StakePoolInstruction } from '@solana/spl-stake-pool';
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js';

import mintsOnSale from '../../data/onsale';
import { FanoutClient } from '../../sdk';

type Data = {
  acct?: string
  error?: string
}

const verifyTx = async(connection: Connection, signature: string) => {
  console.log('verifying tx')

  let txResult = null
  let max = 3
  let i = 0
  do {
    txResult = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0
    })
    if (txResult != null) break
  } while (i < max)

  return (txResult)
}

const verifyTill = () => {}

const verifyAccounts = () => {}

const refund = () => {}



export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  console.log("=======event======");
  console.log(req.body)

  if (req.method != 'POST') {
    console.log("Not a post request")
    return  res.status(200).send({ error: 'Not a post request' })
  }

  const paramters = Object.keys(req.body)

  if (!paramters.includes("signature") || !paramters.includes("address") || !paramters.includes("index") || !paramters.includes("receiver")) {
    console.log("Missing paramters");
    return res.status(200).send({ error: 'Missing parameters' })
  }


  const saleItem = mintsOnSale[req.body.index]


  const connection = new Connection(process.env.NEXT_PUBLIC_RPC!)
  const slot = await connection.getSlot()
  
  // // verify the tx
  const txResult = await verifyTx(connection, req.body.signature)
  if (!txResult) return res.status(200).send({ error: 'couldnt confirm tx' })

  console.log('loaded tx')

  // check against slot
  console.log('checking slot')

  if (slot - 100 > txResult.slot) res.status(200).send({ error: 'old tx' })
  console.log('slot ok')

  // console.log('checking paid amount')

  // const t1 =
  // txResult!.meta?.postTokenBalances?.at(1)?.uiTokenAmount.uiAmount || txResult!.meta?.postBalances?.at(1)
    
  // const t0 =
  // txResult!.meta?.preTokenBalances?.at(1)?.uiTokenAmount.uiAmount || txResult!.meta?.preBalances?.at(1)
    
  // console.log(t0, t1)

  // console.log('t0: ', t0)
  // console.log('t1: ', t1)
  // console.log('diff: ', Math.abs(Number(Number(t1! - t0!).toPrecision(2))))
  // console.log(Math.abs(Number(mintsOnSale[req.body.index].price * LAMPORTS_PER_SOL)))

  // if (Math.abs(Number(Number(t1! - t0!).toPrecision(2))) != Math.abs(Number(mintsOnSale[req.body.index].price * LAMPORTS_PER_SOL)))
  //   return res.status(200).send({ error: 'bad till' })

  // console.log('correct payment')
  console.log('checking keys')

  // const acctKeys = txResult?.transaction.message.getAccountKeys()
  // const sender = acctKeys?.get(0)?.toBase58()
  // const reciever = acctKeys?.get(1)

  //if (sender != req.body.address && (reciever?.toBase58() != mintsOnSale[req.body.index].bank || reciever?.toBase58() != mintsOnSale[req.body.index].bankAta))
    //return res.status(200).send({ error: 'bad accts' })

  console.log('accounts are good')

  // load wallet from env
  const SK = process.env.SK!
  const SKua = bs58.decode(SK)
  const keypair = Keypair.fromSecretKey(SKua)
  const metaplex = new Metaplex(connection).use(keypairIdentity(keypair))

  // load the master edition to
  console.log('loading the nft')

  const nft = await metaplex
    .nfts()
    .findByMint({ mintAddress: new PublicKey(saleItem.mint) })
    
  console.log('we found the nft')
  console.log(nft.name)

  const newOwner = new PublicKey(req.body.address)
  console.log('printing')
  try {
    const useNewMint = Keypair.generate()
  const newNft = await metaplex
    .nfts().builders()
    .createSft({
      tokenOwner: newOwner,
      name: nft.name,
      collection: new PublicKey("2Wk8BXWZMxNUicxpD44YPznr4W78kaQhFfyfB6tqm53b"),
      uri: nft.uri,
      symbol: nft.symbol,
      sellerFeeBasisPoints: 666,
      useNewMint
      
    })
console.log(1)
    const fanoutSdk = new FanoutClient(
      connection,
      keypair
    );
    console.log(2)
    console.log(123)
    const deposit = await StakePoolInstruction.depositSol({
     stakePool: new PublicKey("9jpeBtbarFDfihjb9Nu1cxzRTGcsTUE4P8kf8NFzgYbG"),
    withdrawAuthority: new PublicKey("CgoAbZdf56KijoSuuXNtnrRnkasqEgCDnoVdywH7XgoW"),
    reserveStake: new PublicKey("H2TQjaRNCmRjLd83sgnAohLGjtDuAsprtPbt7P7fyfdu"),
    fundingAccount: keypair.publicKey,
    destinationPoolAccount: new PublicKey("8XgQNYQCun7xBcr2nqXxVdavFkmjdWBNnDhmP75oxq4e"),
    managerFeeAccount: new PublicKey("8XgQNYQCun7xBcr2nqXxVdavFkmjdWBNnDhmP75oxq4e"),
    referralPoolAccount: new PublicKey("8XgQNYQCun7xBcr2nqXxVdavFkmjdWBNnDhmP75oxq4e"),
    poolMint: new PublicKey("FvT3wHWcA726A9E7YDcct2Rr9cdNYgZhezdAPrWB1eRt"),
    lamports:       Number(req.body.shares) - 69000
})
console.log(3)
    const stakeOnBehalfOf = await fanoutSdk.stakeForTokenMemberInstructions({

      shares: Number(req.body.shares) - 69000,
      fanout: new PublicKey("Ga2hNS3RY2tv3AckaNceMMX5G9L4qUQdKpJARzcTaLg"),
      member: newOwner,
      payer: keypair.publicKey
    })
    console.log(4)
    const tx = new Transaction().add(ComputeBudgetProgram.setComputeUnitPrice({microLamports: 62000}), 
    ...newNft.getInstructions(),deposit,...stakeOnBehalfOf.instructions)
    tx.recentBlockhash = (await connection.getLatestBlockhash("finalized")).blockhash
    tx.feePayer = keypair.publicKey
    // @ts-ignore
    tx.sign(...[keypair, ...newNft.getSigners(),...stakeOnBehalfOf.signers])
    console.log(...tx.signatures)
    const signature = await connection.sendRawTransaction(tx.serialize())
    console.log('tx sent ', signature)
  console.log('printed!')

  return res.status(200).send({ acct: useNewMint.publicKey.toBase58()})
  }catch(e:any){
    console.log(e)
    // metaplex print failed
    // process refunds here
    // possible reasons: 
    // at NFT Supply limit
    // ...?
    res.status(200).send({ error: "Printing failed, please contact support!" })
  //   const tx = new Transaction()
  //   const source = mintsOnSale[req.body.index].bankAta
  //   const receiver = req.body.receiver
    
  //   // return funds to user
  //   if ( mintsOnSale[req.body.index].mint != NATIVE_MINT.toBase58()) {
  //     const ixSendMoney = createTransferInstruction(
  //       new PublicKey(source),
  //       new PublicKey(receiver),
  //       keypair.publicKey,
  //       mintsOnSale[req.body.index].price * LAMPORTS_PER_SOL
  //     )
  //     tx.add(ixSendMoney)
  //   } else {
  //     tx.add(
  //       SystemProgram.transfer({
  //         fromPubkey: keypair.publicKey,
  //         toPubkey: new PublicKey(receiver),
  //         lamports: mintsOnSale[req.body.index].price * LAMPORTS_PER_SOL
  //       })
  //     )
  //   }
  //   // get recent blockhash
  //   tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

  //   // set whos paying for the tx
  //   tx.feePayer = keypair.publicKey

  //   try {
  //     const signature = await connection.sendTransaction(tx, [keypair])
  //     const latestBlockHash = await connection.getLatestBlockhash()
  //     await connection.confirmTransaction({
  //       blockhash: latestBlockHash.blockhash,
  //       lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //       signature
  //     })
  //   }catch{
  //     console.log('couldnt refund user')
  //     console.log(req.body);
  //   }
  }
}
