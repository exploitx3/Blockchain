const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const {abi, evm} = require('./compile')

const provider = new HDWalletProvider(
  'move mixed adjust village siege theory short cricket brave home category agree',
  'https://rinkeby.infura.io/v3/9e811542f63144d29a3f2e9ee3a92499'
)

const web3 = new Web3(provider)

const deploy = async () => {
  const accounts = await web3.eth.getAccounts()

  console.log('Attempting to deploy from account ' + accounts[0])

  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: '0x' + evm.bytecode.object
    })
    .send({
      from: accounts[0],
      gas: 1000000
    })

  console.log(JSON.stringify(abi))
  console.log('Contract deployed at ', result.options.address)
}

deploy()