# pTokens


This is the main module that allows you to instantiate an instance of all available pTokens.


&nbsp;

### Installation

```
npm install ptokens
```

&nbsp;

***

&nbsp;

### Usage

```js
import pTokens from 'ptokens'
import { HttpProvider } from 'ptokens-providers' 
import { Node } from 'ptokens-node'

const ptokens = new pTokens({
  pbtc: {
    blockchain: 'ETH', // or EOS
    network: 'testnet', // 'testnet' or 'mainnet', default 'testnet'

    // if you want to be more detailed
    hostBlockchain: 'ETH',
    hostNetwork: 'testnet_ropsten', // possible values are testnet_jungle2, testnet_ropsten and mainnet
    nativeBlockchain: 'BTC'
    nativeNetwork: 'testnet'

    // optionals
    ethPrivateKey: 'Eth private key',
    ethProvider: 'Eth provider', // or instance of Web3 provider
    eosPrivateKey: 'Eos Private Key',
    eosRpc: 'https:/...' // or also an instance of JsonRpc
    eosSignatureProvider: '....' // instance of JsSignatureProvider
    defaultNode: new Node({
    pToken: 'pBTC',
    blockchain: 'ETH',
    provider: new HttpProvider(
      'node endpoint',
      {
        'Access-Control-Allow-Origin': '*',
        ...
      }
    )
  })
  }
})
```

