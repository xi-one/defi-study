// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log(
    "Deploy Start ======================================================"
  );
  const ethers = hre.ethers;

  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();
  const gasPriceData = await ethers.provider.getGasPrice();
  console.log("Deployer :", deployer.address);
  console.log("Balance :", balance);
  console.log("Gas Price :", ethers.utils.formatUnits(gasPriceData, "gwei"));

  const contractNames = "SwapExamples";

  const Base = await ethers.getContractFactory(contractNames);
  const base = await Base.deploy();
  const result = await base.deployed();

  console.log(
    "Deploy Success ===================================================="
  );
  const deployedJson = {};
  deployedJson[contractNames] = result.address;

  fs.writeFileSync("deployed-swap-address.json", JSON.stringify(deployedJson));

    const usedData = await deployer.getBalance();
    console.log("Gas Used:", ethers.utils.formatEther(`${balance - usedData}`));
    console.log("Balance :", usedData);
    console.log(
        "Deploy Over ======================================================="
    );
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
