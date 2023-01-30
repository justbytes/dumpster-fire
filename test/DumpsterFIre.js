const { expect } = require("chai");
const hre = require("hardhat");

describe("Hows the Dumpster fire?", function () {
  // global vars
  let Token;
  let dumpsterFire;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 100000000;
  let tokenBlockReward = 50;

  beforeEach(async () => {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("DumpsterFire");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    dumpsterFire = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", () => {
    it("I am the owner", async () => {
      expect(await dumpsterFire.owner()).to.equal(owner.address);
    });

    it("Assigns total supply of tokens to me", async () => {
      const ownerBalance = await dumpsterFire.balanceOf(owner.address);
      expect(await dumpsterFire.totalSupply()).to.equal(ownerBalance);
    });

    it("Assings cap to total supply of tokens", async () => {
      const cap = await dumpsterFire.cap();
      expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
    });

    it("Can change blockReward ", async () => {
      const blockReward = await dumpsterFire.blockReward();
      expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(
        tokenBlockReward
      );
    });
  });

  describe("Transactions", () => {
    it("Transfers tokens between accounts", async () => {
      // Transfer 50 tokens from owner to addr1
      await dumpsterFire.transfer(addr1.address, 50);
      const addr1Balance = await dumpsterFire.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await dumpsterFire.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await dumpsterFire.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Fails if sender has insufficent funds", async () => {
      const initialOwnerBalance = await dumpsterFire.balanceOf(owner.address);
      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        dumpsterFire.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await dumpsterFire.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Updates balance after transfers", async () => {
      const initialOwnerBalance = await dumpsterFire.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await dumpsterFire.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await dumpsterFire.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await dumpsterFire.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await dumpsterFire.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await dumpsterFire.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
