const {ethers} = require("hardhat");

async function main() {
    const nft = await ethers.getContractFactory("NFT");
    const cnft = await nft.deploy();
    console.log("NFT contract deployed to:", cnft.address); 
}
 main()
.catch((error) => {
    console.error(error);
    process.exitCode = 1;
});