import {ethers} from "ethers";
import {abi} from "./NFT.json";
const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlYTZlZDJiNS0wOWFhLTQ0YzMtYjkxNi04ZTYxN2U0ZTljODEiLCJlbWFpbCI6InRvbW9uaXNoc2hhaEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiODYyZmYxY2ViZmRmMzJhYmJjYTEiLCJzY29wZWRLZXlTZWNyZXQiOiI0NmU3MGVlOTY3NmU2ZWZjNTI3NzAzMDc2NThiYTZkYzFhZjI2ZDMyZTMzYjdkMjk2MzI4YjQyMjI1MmMyNTM5IiwiZXhwIjoxNzg1MjM0MjA4fQ.B6pLauCLeVYLkSmpLBFKtG8hEqM_Zl8yd2vAOOhLoeo"

//contract details and user address
const contractABI = abi;
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const userAddress = window.userAddress;


document.addEventListener("DOMContentLoaded", () => {
  //getting the elements from the DOM
const fInput = document.getElementById("fileInput");
const nftName = document.getElementById("fileName");
const nftDescription = document.getElementById("fileDescription");
const uploadButton = document.getElementById("uploadButton");
const uploadStatus = document.getElementById("uploadStatus");
const preview = document.getElementById("preview");
const tokenId = document.getElementById("tokenId");
const owner = document.getElementById("owner");
const owned = document.getElementById("owned");
const nftUrl = document.getElementById("nftUrl");
let url;
let cnft;
let token
//ensuring the required params are present
uploadButton.addEventListener("click", async () => {
if(!fInput.files.length||!nftName.value.trim()){
  uploadStatus.textContent = "Please select a file and enter NFT name.";
  return;
}

//checking if the wallet is connected
if(!window.connected){
  uploadStatus.textContent = "Please connect your wallet first.";
  return;
}


//adding to the preview and starting the upload
console.log("Upload button clicked");
const img = fInput.files[0];
preview.src = URL.createObjectURL(img);
preview.style.display = "block";
uploadStatus.textContent = "Uploading...";

//uploading to Pinata
try{
const image = fInput.files[0];
const fData = new FormData();
fData.append("file", image);
fData.append("name", nftName.value);
fData.append("description", nftDescription.value);
fData.append("network","public");
const request = await fetch("https://uploads.pinata.cloud/v3/files", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${JWT}`,
    },
  body: fData,
});


//retrieving from pinata
const response = await request.json();
console.log("Response from Pinata:", response);
const cid =  response.data.cid;
const gateway = "beige-rational-wildcat-456.mypinata.cloud";
url = `https://${gateway}/ipfs/${cid}`;
uploadStatus.innerHTML=`NFT URL: <a href="${url}" target="_blank">${url}</a>`;
} 
catch(error) {
uploadStatus.textContent = `Error uploading NFT: ${error.message}`;
}

//uploading to the blockchain
try{
  cnft = new ethers.Contract(contractAddress, contractABI, window.signer);
  cnft.on("whatsTheTokenId", (tokenNo) => {
    console.log("Token ID event received:", tokenNo);
    token = tokenNo.toString();
    tokenId.textContent = `Token ID: ${token}`;
    console.log("NFT minted with token ID:", token);
  });

  const transaction = await cnft.mint(url, window.signer.address);
  const receipt = await transaction.wait();

}
catch(error) {
  console.error("Error minting NFT:", error);
  tokenId.textContent = `Error minting NFT: ${error.message}`;
}

//Retrieve NFT URL from token
try{
  const details = await cnft.viewNFT(token);
  nftUrl.innerHTML = `NFT URL: <a href="${details[2]}" target="_blank">${details[2]}</a>`;
  owner.textContent = `Owner: ${details[0]}`;
  owned.textContent = `Total tokens owned by ${details[0]}: ${details[1]}`;
}
catch(error) {
  console.error("Error retrieving NFT details:", error);
  nftUrl.textContent = "Error retrieving NFT details.";
}

}); 
});