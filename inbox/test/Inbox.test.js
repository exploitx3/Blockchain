const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3('http://localhost:8545')
const compileFile = require('../compile')
const {abi, evm} = compileFile
const INITIAL_MESSAGE = 'Hi there!'

let accounts
let inbox
beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()

  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: '0x' + evm.bytecode.object,
      arguments: [
        INITIAL_MESSAGE
      ]
    })
    .send({
      from: accounts[0],
      gas: 1000000
    })

  inbox.setProvider(web3.currentProvider)

  console.log(accounts)
})

describe('Inbox', () => {
  it('Deploys a contract ', function () {
    // console.log(inbox)

    assert.ok(inbox.options.address)
  })

  it('has a default message', async function () {
    const msg = await inbox.methods.message().call({from: accounts[0]})

    assert.equal(msg, INITIAL_MESSAGE)
  })

  it('can change message', async function () {
    let txn = await inbox.methods.setMessage('bye').send({from: accounts[0]})
    let message = await inbox.methods.message().call()

    assert.equal(message, 'bye')
  })
})