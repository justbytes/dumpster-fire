const hre = require("hardhat");

async function main() {
  const DumpsterFire = await hre.ethers.getContractFactory("DumpsterFire");
  const dumpsterFire = await DumpsterFire.deploy(100000000, 50);
  await dumpsterFire.deployed();

  console.log(`Dumpster Fire deployed at:${dumpsterFire.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
