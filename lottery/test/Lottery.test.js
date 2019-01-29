const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3('http://localhost:8545')
const compileFile = require('../compile')
const {abi, evm} = compileFile
const INITIAL_MESSAGE = 'Hi there!'

let accounts
let lottery
beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()

  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: '0x' + evm.bytecode.object
    })
    .send({
      from: accounts[0],
      gas: 1000000
    })

  lottery.setProvider(web3.currentProvider)

  console.log(accounts)
})

describe('Lottery Contract', () => {
  it('Deploys a contract ', function () {
    // console.log(inbox)

    assert.ok(lottery.options.address)
  })

  it('allows one account to enter', async function () {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.011', 'ether')
    })

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    })

    assert.equal(accounts[0], players[0])
    assert.equal(1, players.length)
  })

  it('allows multiple account to enter', async function () {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.011', 'ether')
    })

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.011', 'ether')
    })

    await lottery.methods.enter().send({
      from: accounts[3],
      value: web3.utils.toWei('0.011', 'ether')
    })

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    })

    assert.equal(accounts[1], players[0])
    assert.equal(accounts[2], players[1])
    assert.equal(accounts[3], players[2])
    assert.equal(3, players.length)
  })

  it('requires a minimum ammount of ether to enter', async function () {
    try {

      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.00011', 'ether')
      })

      assert(false)

    } catch (err) {
      assert.ok(err)
    }


  })

  it('only manager can call pickWinner', async function () {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      })

      assert(false)

    } catch (error) {
      assert.ok(error)
    }
  })

  it('send money to the winner and reset the players array', async function () {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    })


    const initialBalance = await web3.eth.getBalance(accounts[0])
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })
    const finalBalance = await web3.eth.getBalance(accounts[0])
    const difference = finalBalance - initialBalance


    assert(difference > web3.utils.toWei('1.8', 'ether'))
  })


})