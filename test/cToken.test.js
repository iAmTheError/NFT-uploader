const {ethers} = require("hardhat");
const {expect} = require("chai");


describe(" Communtiy NFT creater", function () {
    let owner, addr1, cnft;
    beforeEach(async function () {
        [owner,addr1] = await ethers.getSigners();
        const nft = await ethers.getContractFactory("NFT");
        cnft = await nft.deploy();
    });
    it("Should mint a NFT and return the details of the NFT",async function(){
        await cnft.mint("https://images.dog.ceo/breeds/spaniel-sussex/n02102480_4392.jpg",owner.address);   
        const [addr,token,uri]=await cnft.viewNFT(1);
        console.log(addr,token,uri);
        expect(addr).to.equal(owner.address);
    });
    it("Should not mint as nft cannot have zero address owner", async function () {
        const zeroAddress = "0x0000000000000000000000000000000000000000";
        await expect(
            cnft.mint("https://images.dog.ceo/breeds/bullterrier-staffordshire/n02093256_3306.jpg", zeroAddress)
        ).to.be.revertedWith("Owner address cannot be zero");
    });
    it("Should not allow viewing as NFT does not exist", async function () {
        await expect(cnft.viewNFT(999)).to.be.revertedWith("Valid token ID required");
    });
});