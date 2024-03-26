import { NATIVE_MINT } from '@solana/spl-token';

// const mintsOnSale = []
const mintsOnSale = [
  {
    creator: "@staccoverflow",
    open: true,
    mint: 'BQtRK9xFWR8vnK28mX2W5uxGmtBqabrHi7D6JmgVijt5',
    priceTags: [
      [
        {
          splToken: NATIVE_MINT.toBase58(),
          bank: '7ihN8QaTfNoDTRTQGULCzbUT3PHwPDTu5Brcu4iT2paP',
          bankAta: '',
          price: 0.000069,
          symbol: 'SOL'
        },
      ]
    ]
  }
]

export default mintsOnSale
