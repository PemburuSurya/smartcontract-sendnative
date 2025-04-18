const { Web3 } = require('web3');
require('dotenv').config();

async function sendNative() {
  try {
    // Validasi environment variables
    const requiredEnvVars = ['RPC_URL', 'PRIVATE_KEY', 'CONTRACT_ADDRESS', 'RECIPIENT', 'AMOUNT'];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Environment variable ${envVar} is required`);
      }
    }

    // Inisialisasi Web3
    const web3 = new Web3(process.env.RPC_URL);
    
    // Setup akun
    const account = web3.eth.accounts.privateKeyToAccount('0x' + process.env.PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);

    // ABI Contract
    const ABI = [{
      "inputs": [{"internalType": "address payable","name": "_recipient","type": "address"}],
      "name": "sendETH",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }];

    // Kirim transaksi
    const contract = new web3.eth.Contract(ABI, process.env.CONTRACT_ADDRESS);
    const value = web3.utils.toWei(process.env.AMOUNT, 'ether');

    // Dapatkan nonce terbaru
    const nonce = await web3.eth.getTransactionCount(account.address, 'pending');
    console.log(`ℹ️ Menggunakan nonce: ${nonce}`);

    const txData = {
      from: account.address,
      to: process.env.CONTRACT_ADDRESS,
      data: contract.methods.sendETH(process.env.RECIPIENT).encodeABI(),
      value: value,
      gas: process.env.GAS_LIMIT || 500000, // Gas lebih tinggi
      gasPrice: process.env.GAS_PRICE || await web3.eth.getGasPrice(),
      nonce: nonce, // Menggunakan nonce yang sudah diambil
      type: '0x0'
    };

    console.log('🔄 Menandatangani transaksi...');
    const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.PRIVATE_KEY);
    
    console.log('🚀 Mengirim transaksi...');
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`
      ✅ Transfer berhasil!
      📌 Tx Hash: ${receipt.transactionHash}
      🔗 Explorer: ${process.env.EXPLORER_URL || 'https://testnet.0g.ai'}/tx/${receipt.transactionHash}
      💸 Amount: ${process.env.AMOUNT} ETH/SWAN
      🏦 Recipient: ${process.env.RECIPIENT}
      ⛽ Gas Used: ${receipt.gasUsed}
    `);
  } catch (error) {
    console.error('❌ Gagal:', error.message);
    if (error.receipt) {
      console.error('📄 Receipt error:', error.receipt);
    }
    process.exit(1);
  }
}

sendNative();
