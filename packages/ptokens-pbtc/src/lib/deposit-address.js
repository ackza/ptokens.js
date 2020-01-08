import Web3PromiEvent from 'web3-core-promievent'
import * as bitcoin from 'bitcoinjs-lib'
import polling from 'light-async-polling'
import utils from 'ptokens-utils'
import {
  ESPLORA_POLLING_TIME,
  ENCLAVE_POLLING_TIME,
  ETH_NODE_POLLING_TIME_INTERVAL
} from '../utils/constants'

class DepositAddress {
  /**
   * @param {Object} _params
   */
  constructor(_params) {
    const {
      ethAddress,
      nonce,
      enclavePublicKey,
      value,
      btcNetwork,
      esplora,
      enclave
    } = _params

    this.ethAddress = ethAddress
    this.nonce = nonce
    this.enclavePublicKey = enclavePublicKey
    this._value = value
    this._btcNetwork = btcNetwork
    this._esplora = esplora
    this._enclave = enclave
  }

  toString() {
    return this._value
  }

  verify() {
    const network = this._btcNetwork === 'bitcoin'
      ? bitcoin.networks.bitcoin
      : bitcoin.networks.testnet

    const ethAddressBuf = Buffer.from(
      utils.eth.removeHexPrefix(this.ethAddress),
      'hex'
    )
    const nonceBuf = utils.converters.encodeUint64le(this.nonce)
    const enclavePublicKeyBuf = Buffer.from(this.enclavePublicKey, 'hex')

    const ethAddressAndNonceHashBuf = bitcoin.crypto.hash256(
      Buffer.concat([ethAddressBuf, nonceBuf])
    )

    const output = bitcoin.script.compile([].concat(
      ethAddressAndNonceHashBuf,
      bitcoin.opcodes.OP_DROP,
      enclavePublicKeyBuf,
      bitcoin.opcodes.OP_CHECKSIG
    ))

    const p2sh = bitcoin.payments.p2sh(
      {
        redeem: {
          output,
          network
        },
        network
      }
    )

    return p2sh.address === this._value
  }

  waitForDeposit() {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      if (!this._value)
        promiEvent.reject('Please provide a deposit address')

      let isBroadcasted = false
      let polledUtxo = null
      await polling(async () => {
        const txs = await this._esplora.makeApiCall(
          'GET',
          `/address/${this._value}/txs/mempool`
        )

        if (txs.length > 0) {
          isBroadcasted = true
          promiEvent.eventEmitter.emit('onBtcTxBroadcasted', txs[0].txid)
          return false
        }

        const utxos = await this._esplora.makeApiCall(
          'GET',
          `/address/${this._value}/utxo`
        )

        // NOTE: an user could make 2 payments to the same depositAddress -> utxos.length could become > 0 but with a wrong utxo

        if (utxos.length > 0) {
          if (!isBroadcasted)
            promiEvent.eventEmitter.emit('onBtcTxBroadcasted', utxos[0].txid)

          promiEvent.eventEmitter.emit('onBtcTxConfirmed', utxos[0].txid)
          polledUtxo = utxos[0].txid
          return true
        } else {
          return false
        }
      }, ESPLORA_POLLING_TIME)

      let broadcastedEthTx = null
      let isSeen = false
      await polling(async () => {
        const incomingTxStatus = await this._enclave.getIncomingTransactionStatus(polledUtxo)

        if (incomingTxStatus.broadcast === false && !isSeen) {
          promiEvent.eventEmitter.emit('onEnclaveReceivedTx', incomingTxStatus)
          isSeen = true
          return false
        } else if (incomingTxStatus.broadcast === true) {
          if (!isSeen)
            promiEvent.eventEmitter.emit('onEnclaveReceivedTx', incomingTxStatus)

          promiEvent.eventEmitter.emit('onEnclaveBroadcastedTx', incomingTxStatus)
          broadcastedEthTx = incomingTxStatus.eth_tx_hash
          return true
        } else {
          return false
        }
      }, ENCLAVE_POLLING_TIME)

      
      await polling(async () => {
        const ethTxReceipt = await this.web3.eth.getTransactionReceipt(broadcastedEthTx)

        if (!ethTxReceipt) {
          return false
        } else if (ethTxReceipt.status) {
          promiEvent.eventEmitter.emit('onEthTxConfirmed', ethTxReceipt)
          return true
        } else {
          return false
        }
      }, ETH_NODE_POLLING_TIME_INTERVAL)

      promiEvent.resolve() // TODO: choose params to return
    }

    start()
    return promiEvent.eventEmitter
  }
}

export default DepositAddress