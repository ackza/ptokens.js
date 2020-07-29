import pTokens from '../src/index'
import { pBTC } from 'ptokens-pbtc'
import { pLTC } from 'ptokens-pltc'
import { constants } from 'ptokens-utils'
import { expect } from 'chai'

test('Should init pTokens correctly with 1 instance of pBTC', () => {
  const ptokens = new pTokens({
    pbtc: {
      blockchain: constants.blockchains.Ethereum,
      network: constants.networks.Testnet
    }
  })
  expect(ptokens.pbtc).to.be.an.instanceof(pBTC)
})

test('Should init pTokens correctly with 2 instance of pBTC', () => {
  const ptokens = new pTokens({
    pbtc: [
      {
        blockchain: constants.blockchains.Ethereum,
        network: constants.networks.Testnet
      },
      {
        blockchain: constants.blockchains.Eosio,
        network: constants.networks.Testnet
      }
    ]
  })
  expect(ptokens.pbtc).to.be.an.instanceof(Array)
  expect(ptokens.pbtc).to.have.lengthOf(2)
})

test('Should init pTokens correctly with 2 instance of pLTC', () => {
  const ptokens = new pTokens({
    pltc: [
      {
        blockchain: constants.blockchains.Ethereum,
        network: constants.networks.Testnet
      },
      {
        blockchain: constants.blockchains.Ethereum,
        network: constants.networks.Mainnet
      }
    ]
  })
  expect(ptokens.pltc).to.be.an.instanceof(Array)
  expect(ptokens.pltc).to.have.lengthOf(2)
})

test('Should init pTokens correctly with 1 instance of pBTC and 1 of pLTC', () => {
  const ptokens = new pTokens({
    pbtc: {
      blockchain: constants.blockchains.Ethereum,
      network: constants.networks.Testnet
    },
    pltc: {
      blockchain: constants.blockchains.Ethereum,
      network: constants.networks.Testnet
    }
  })
  expect(ptokens.pbtc).to.be.an.instanceof(pBTC)
  expect(ptokens.pltc).to.be.an.instanceof(pLTC)
})
