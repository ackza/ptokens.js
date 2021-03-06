import { pERC20 } from '../src/index'
import { expect } from 'chai'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'
import { constants, eth } from 'ptokens-utils'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'

// prettier-ignore
const ETH_TESTING_ADDRESS = ''
// prettier-ignore
const ETH_TESTING_PRIVATE_KEY = ''
// prettier-ignore
const WEB3_PROVIDER = ''
// prettier-ignore
const EOS_TESTING_PRIVATE_KEY = ''
const EOS_TESTING_NODE_ENDPOINT = ''
const EOS_TESTING_ACCOUNT_NAME = ''

jest.setTimeout(3000000)

let pnt = null
beforeEach(() => {
  pnt = new pERC20({
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Mainnet,
    ethPrivateKey: ETH_TESTING_PRIVATE_KEY,
    ethProvider: WEB3_PROVIDER,
    eosRpc: new JsonRpc(EOS_TESTING_NODE_ENDPOINT, { fetch }),
    eosPrivateKey: EOS_TESTING_PRIVATE_KEY,
    pToken: constants.pTokens.PNT
  })
})

test('Should not issue less than 1000000000 pNT', async () => {
  const amountToIssue = BigNumber('900000000')
  try {
    await pnt.issue(amountToIssue, EOS_TESTING_ACCOUNT_NAME)
  } catch (_err) {
    expect(_err).to.be.equal('Impossible to issue less than 1000000000')
  }
})

test('Should issue 0.00002 pNT using ETH', async () => {
  const amountToIssue = BigNumber('20000000000000')
  let ethTxBrodcasted = 2
  let ethTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let eosTxIsConfirmed = false

  await pnt.select()
  const { native_vault_address } = await pnt.selectedNode.getInfo()

  const web3 = new Web3(WEB3_PROVIDER)
  web3.eth.defaultAccount = ETH_TESTING_ADDRESS
  await eth.sendSignedMethodTx(
    web3,
    'approve',
    {
      privateKey: ETH_TESTING_PRIVATE_KEY,
      abi: [
        {
          constant: false,
          inputs: [
            {
              name: '_spender',
              type: 'address'
            },
            {
              name: '_value',
              type: 'uint256'
            }
          ],
          name: 'approve',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      gas: 200000,
      gasPrice: 75e9,
      contractAddress: constants.tokens.PNT,
      value: 0
    },
    [eth.addHexPrefix(native_vault_address), BigNumber('20000000000000')]
  )

  const start = () =>
    new Promise(resolve => {
      pnt
        .issue(amountToIssue, EOS_TESTING_ACCOUNT_NAME, {
          gasPrice: 75e9,
          gas: 200000
        })
        .once('nativeTxBroadcasted', e => {
          console.log(e)
          ethTxBrodcasted = true
        })
        .once('nativeTxConfirmed', e => {
          console.log(e)
          ethTxIsConfirmed = true
        })
        .once('nodeReceivedTx', e => {
          console.log(e)
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', e => {
          console.log(e)
          nodeHasBroadcastedTx = true
        })
        .once('hostTxConfirmed', e => {
          console.log(e)
          eosTxIsConfirmed = true
        })
        .then(() => resolve())
    })
  await start()
  expect(ethTxBrodcasted).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(eosTxIsConfirmed).to.equal(true)
})

test('Should redeem 0.00002 pNT on EOS', async () => {
  const amountToRedeem = 0.00002
  let eosTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let ethTxIsConfirmed = false
  const start = () =>
    new Promise((resolve, reject) => {
      pnt
        .redeem(amountToRedeem, ETH_TESTING_ADDRESS)
        .once('hostTxConfirmed', e => {
          console.log(e)
          eosTxIsConfirmed = true
        })
        .once('nodeReceivedTx', e => {
          console.log(e)
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', e => {
          console.log(e)
          nodeHasBroadcastedTx = true
        })
        .once('nativeTxConfirmed', e => {
          console.log(e)
          ethTxIsConfirmed = true
        })
        .then(() => resolve())
        .catch(_err => reject(_err))
    })
  await start()
  expect(eosTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
})
