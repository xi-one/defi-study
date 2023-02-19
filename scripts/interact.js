const { ethers } = require("ethers");
require("dotenv").config();
const fs = require("fs");

const provider = new ethers.providers.getDefaultProvider(
    "http://127.0.0.1:8545/"
);

// weth9 contract 
const weth_Addr = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const weth = require("./weth.json");
const weth_abi = weth.abi;
const weth9_contract = new ethers.Contract(weth_Addr, weth_abi, provider);

// dai contract 
const dai_Addr = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const dai = require("./dai.json");
const dai_abi = dai.abi;
const dai_contract = new ethers.Contract(dai_Addr, dai_abi, provider);
 

 // swap contract 
const data = require("../deployed-swap-address.json");
const swap_Addr = data.SwapExamples;
const swap_data = require("../artifacts/contracts/SwapExamples.sol/SwapExamples.json");
const swap_abi = swap_data.abi;
const swap_contract = new ethers.Contract(swap_Addr, swap_abi, provider);

// get signer
const private = process.env.LOCAL_SECRET;
const walletObj = new ethers.Wallet(private);
const wallet = walletObj.connect(provider);

async function main () {
    
    var option = {value: ethers.utils.parseEther("0.000000000000001000")};

    // change eth to weth
    const deposit = await weth9_contract.connect(wallet).deposit(option);
    await deposit.wait();

    // approve weth to swap contract
    const approve = await weth9_contract.connect(wallet).approve(swap_Addr, 10000);
    approve.wait();

    var weth_balance, dai_balance;

    console.log("-------------before swap-------------")
    weth_balance = await weth9_contract.balanceOf(wallet.address);
    dai_balance = await dai_contract.balanceOf(wallet.address);
    console.log("weth balance: ", weth_balance.toNumber());
    console.log("dai balance: ", dai_balance.toNumber());

    const tx = await swap_contract.connect(wallet).swapExactInputSingle(10);
    await tx.wait();


    console.log("-------------after swap-------------")
    weth_balance = await weth9_contract.balanceOf(wallet.address);
    dai_balance = await dai_contract.balanceOf(wallet.address);
    console.log("weth balance: ", weth_balance.toNumber());
    console.log("dai balance: ",wallet.address, dai_balance.toNumber());

}

main();