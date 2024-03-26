import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

import { NextPage } from 'next';
import Head from 'next/head';
import Confetti from 'react-confetti';
import Slider from 'react-slick';
import { toast } from 'react-toastify';

import { NATIVE_MINT } from '@solana/spl-token';
import {
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

import {
  Edition,
  priceTag,
} from '../components/edition';
import Footer from '../components/Footer';
import mintsOnSale from '../data/onsale';
import styles from '../styles/Home.module.css';

const CLOSED = false

const Home: NextPage = () => {
  const { publicKey, connected, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [error, setError] = useState<boolean>(false)
  const [confetti, setConfetti] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
const [shares, theSetShares] = useState<number>(1.1)
// use preventDefault to prevent the page from reloading, function setShares
// will be called when the slider is moved
const setShares = (value: number) => {
  theSetShares(value);
};
const sliderSettings = {
  dots: true, // Show dot indicators at the bottom
  infinite: false, // Do not loop back to the beginning/end
  speed: 500, // Animation speed in milliseconds
  slidesToShow: 1, // Show one slide at a time
  slidesToScroll: 1, // Scroll one slide at a time
  initialSlide: 0, // Start with the first slide
  step: 0.1, // The step with which the slider moves - Not a default react-slick prop
  beforeChange: (current: any, next: any) => setShares(Number(next+1) * 0.1) // Update the shares state; customize this as needed
};
  const doIt = async (priceTags: priceTag[], _index: number) => {
    if (!publicKey) return

    let tx = new Transaction()

    let destination
    for (var i = 0; i < priceTags.length; i++) {
      console.log('Lets do setup some instructions')
      console.log('Cost: ', shares)
      console.log('SplToken: ', priceTags[i].splToken)
      console.log('Reciever: ', priceTags[i].bank)
      console.log('Sender: ', publicKey?.toBase58())

      if (priceTags[i].splToken == NATIVE_MINT.toBase58()) {
        destination = new PublicKey(priceTags[i].bank)
      } else {
        destination = new PublicKey(priceTags[i].bankAta!)
      }

        // send me SOLANA
        tx.add(
          SystemProgram.transfer({
            fromPubkey: publicKey!,
            toPubkey: new PublicKey(priceTags[i].bank),
            lamports: shares * LAMPORTS_PER_SOL
          })
        )
      }

    // get recent blockhash
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

    // set whos paying for the tx
    tx.feePayer = publicKey!

    try {
      const signature = await sendTransaction(tx, connection)
      const latestBlockHash = await connection.getLatestBlockhash()
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature
      })

      toast('Payment successful, minting edition...')
      console.log('calling new mint')
      try {
        const newMint = await fetch('api/mint', {
          body: JSON.stringify({
            signature: signature,
            address: publicKey!.toBase58(),
            index: _index,
            receiver: destination,
            shares: shares * LAMPORTS_PER_SOL
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf8'
          },
          method: 'POST'
        })
        const repJson = await newMint.json()
        console.log(repJson)

        toast('Minting successful!')
        setConfetti(true)
        setTimeout(()=>{
          setConfetti(false)
        },10000)
      } catch (e) {
        toast(
          'There was an error, please contact support with your payment transaction id'
        )
        setError(true)
        setErrorMessage(signature)
      }
    } catch (e) {
      toast('Payment cancelled')
      console.log(e)
    }
  }

  const grids = 'grid grid-cols-1'
      mintsOnSale[0].priceTags[0][0].price = shares
  return (
    <div className='flex flex-col min-h-screen'>
      {confetti && <Confetti className='w-screen h-screen' />}
      <Head>
        <title>Open Editions - Home</title>
        <meta
          name='description'
          content='Open Editions from 0xBanana and friends'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <WalletMultiButton />

        <h1 className='py-4 text-6xl font-extrabold tracking-tighter text-center transition-transform ease-in-out bg-transparent sm:leading-4 md:text-8xl text-gradient bg-clip-text animated hover:scale-105 hover:skew-y-6 hover:-skew-x-6'>
          Open Editions
        </h1>
        {error && (
          <>
            <div className='relative flex flex-col items-center justify-center w-full my-4 overflow-hidden sm:py-12 lg:pb-8'>
              {/* <h2 className='text-lg font-extrabold tracking-wider text-center uppercase sm:text-2xl font-plex'>
              <span className='pb-1 sm:pb-2 whitespace-nowrap'>
                open edition mints
              </span>
            </h2> */}

              <h2 className='mx-4 my-4 tracking-wider text-center bg-yellow-200 border-yellow-300 border-dashed sm:text-2xl font-plex'>
                <span className='pb-1 sm:pb-2 whitespace-nowrap'>
                  {errorMessage}
                </span>
              </h2>
            </div>
          </>
        )}
        {connected && (
          
          <div className={`${grids}`}>
             {mintsOnSale.map((saleItem, index) => (
                <div className='' key={'mintsonsale-' + saleItem.mint}>
              <h3 className='text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500'>
    this is what we do. You contribute as much as you want, 0.015 mints yo nft, the shares you choose are staked into a liquid staking token <br />
    and then immediately staked on your behalf on a hydra fanout wallet. You can unstake at any point, get ur LSTs back
  <h2>seriously. check this out<br/></h2>
  </h3><p style={{textAlign: 'center'}}>https://solscan.io/tx/4LKw3AvEVDPbD6q45LcRnBpBmaBatnHhXw38RGH7EaB5GJkMzmgBsk5i95eFqnLfcZqqAsYU3Q9e7jNuDFAs4FwM</p>
  <Slider {...sliderSettings} >
  {/* Generate slides based on the range you want, start from 1 to avoid a 0 value */}
  {[...Array(1000).keys()].slice(1).map(index => (
    <div key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h3 style={{ color: 'inherit', textAlign: 'center' }}> {/* Use the color of the parent h3 elements */}
        {((index) * 0.1).toFixed(1)} {/* Customize this to represent each step/value */}
      </h3>
    </div>
  ))}
</Slider>

                  <Edition
                    index={index}
                    connected={connected}
                    doIt={doIt}
                    priceTags={saleItem.priceTags}
                    creator={saleItem.creator}
                    mint={saleItem.mint}
                    open={saleItem.open}
                  />
                </div>
              )
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Home
