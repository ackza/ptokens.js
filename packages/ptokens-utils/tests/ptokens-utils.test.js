import utils from '../src'
import { expect } from 'chai'
import Web3 from 'web3'
import abi from './utils/exampleContractABI.json'

const testContractAddress = '0x15FA11dFB23eae46Fda69fB6A148f41677B4a090'
const ethPrivateKey = '422c874bed50b69add046296530dc580f8e2e253879d98d66023b7897ab15742'
const ethProvider = 'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6'
const eosPrivateKey = '5J9J3VWdCEQsShpsQScedL1debcBoecuSzfzUsvuJB14f77tiGv'
const eosProvider = 'https://ptoken-eos.provable.xyz:443'

jest.setTimeout(30000)

test('Should return the same 0x prefixed string', () => {
  const string0xPrefixed = '0xhello'
  const expectedString0xPrefixed = '0xhello'
  const result = utils.eth.alwaysWithPrefix(string0xPrefixed)
  expect(result)
    .to.be.equal(expectedString0xPrefixed)
})

test('Should return the 0x prefixed string', () => {
  const stringNot0xPrefixed = 'hello'
  const expectedString0xPrefixed = '0xhello'
  const result = utils.eth.alwaysWithPrefix(stringNot0xPrefixed)
  expect(result)
    .to.be.equal(expectedString0xPrefixed)
})

test('Should return the correct Ethereum offchain format', () => {
  const onChainAmount = 10000
  const decimals = 4
  const expectedOffChainAmount = 1
  const offChainAmount = utils.eth.correctFormat(onChainAmount, decimals, '/')
  expect(offChainAmount)
    .to.be.equal(expectedOffChainAmount)
})

test('Should return the correct Ethereum onchain format', () => {
  const offChainAmount = 1
  const decimals = 4
  const expectedOnChainAmount = 10000
  const onChainAmount = utils.eth.correctFormat(offChainAmount, decimals, '*')
  expect(onChainAmount)
    .to.be.equal(expectedOnChainAmount)
})

test('Should return the current Ethereum account with non injected Web3 instance', async () => {
  const web3 = new Web3(ethProvider)
  const isWeb3Injected = false
  const expectedEthereumAccount = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'

  const account = web3.eth.accounts.privateKeyToAccount(
    utils.eth.alwaysWithPrefix(ethPrivateKey)
  )
  web3.eth.defaultAccount = account.address
  const ethereumAccount = await utils.eth.getAccount(web3, isWeb3Injected)
  expect(ethereumAccount)
    .to.be.equal(expectedEthereumAccount)
})

test('Should return a valid Web3.eth.Contract instance', () => {
  const web3 = new Web3(ethProvider)
  const account = web3.eth.accounts.privateKeyToAccount(
    utils.eth.alwaysWithPrefix(ethPrivateKey)
  )
  const contract = utils.eth.getContract(
    web3,
    abi,
    testContractAddress,
    account.address
  )
  const expectedContract = new web3.eth.Contract(abi, testContractAddress, {
    defaultAccount: account.address
  })
  expect(JSON.stringify(contract))
    .to.be.equal(JSON.stringify(expectedContract))
})

test('Should return a valid gas limit', async () => {
  const web3 = new Web3(ethProvider)
  const gasLimit = await utils.eth.getGasLimit(web3)
  expect(gasLimit)
    .to.be.a('number')
})

test('Should return true since 0xhello is 0x prefixed', () => {
  const string0xPrefixed = '0xhello'
  const result = utils.eth.is0xPrefixed(string0xPrefixed)
  expect(result)
    .to.be.equal(true)
})

test('Should return false since hello is not 0x prefixed', () => {
  const string0xNotPrefixed = 'hello0x'
  const result = utils.eth.is0xPrefixed(string0xNotPrefixed)
  expect(result)
    .to.be.equal(false)
})

test('Should call an ETH contract call', async () => {
  const web3 = new Web3(ethProvider)
  const number = await utils.eth.makeContractCall(
    web3,
    'number',
    {
      isWeb3Injected: false,
      abi,
      contractAddress: testContractAddress
    }
  )
  const parsedResult = parseInt(number)
  expect(parsedResult).to.be.a('number')
})

test('Should make an ETH contract send correctly', async () => {
  const web3 = new Web3(ethProvider)
  const account = web3.eth.accounts.privateKeyToAccount(
    utils.eth.alwaysWithPrefix(ethPrivateKey)
  )
  web3.eth.defaultAccount = account.address
  const expectedNumber = 10

  await utils.eth.makeContractSend(
    web3,
    'setNumber',
    {
      isWeb3Injected: false,
      abi,
      contractAddress: testContractAddress,
      privateKey: utils.eth.alwaysWithPrefix(ethPrivateKey)
    },
    [
      expectedNumber
    ]
  )
  const number = await utils.eth.makeContractCall(
    web3,
    'number',
    {
      isWeb3Injected: false,
      abi,
      contractAddress: testContractAddress
    }
  )
  expect(parseInt(number)).to.be.equal(expectedNumber)
})

test('Should get the correct EOS account name', async () => {
  const eosjs = utils.eos.getApi(eosPrivateKey, eosProvider)
  const expectedAccountName = 'all3manfr4di'
  const publicKeys = await utils.eos.getAvailablePublicKeys(eosjs)
  const accountName = await utils.eos.getAccountName(eosjs, publicKeys)
  expect(accountName).to.be.equal(expectedAccountName)
})

test('Should get the list of public keys', async () => {
  const eosjs = utils.eos.getApi(eosPrivateKey, eosProvider)
  const publicKeys = await utils.eos.getAvailablePublicKeys(eosjs)
  expect(publicKeys).to.be.an('array')
})

test('Should be a valid EOS account name', () => {
  const validEosAccountName = 'all3manfr3di'
  const isValid = utils.eos.isValidAccountName(validEosAccountName)
  expect(isValid).to.be.equal(true)
})

test('Should not be a valid EOS account name', () => {
  const notValidEosAccountName = 'not valid eos account'
  const isValid = utils.eos.isValidAccountName(notValidEosAccountName)
  expect(isValid).to.be.equal(false)
})

test('Should transfer 1 eosio.token', async () => {
  const eosjs = utils.eos.getApi(eosPrivateKey, eosProvider)
  const sender = 'all3manfr3di'
  const receiver = 'all3manfr4di'
  const amountToSend = 1
  const memo = 'ptokens.js test'
  const expireSeconds = 30
  const blocksBehind = 3
  const receipt = await utils.eos.transferNativeToken(
    eosjs,
    sender,
    receiver,
    amountToSend,
    memo,
    blocksBehind,
    expireSeconds
  )
  expect(receipt).to.be.an('object')
})