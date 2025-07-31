import {ethers} from "ethers";
console.log("Ethers version:", ethers.version);

window.userAddress = null;
window.connected = false;
window.signer = null;
document.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById("connectButton");
  const walletDisplay = document.getElementById("walletAddress");

  connectButton.addEventListener("click", async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install it first.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      window.signer = await provider.getSigner();
      window.userAddress = accounts[2];
      console.log(window.signer.address);
      window.connected = true;
      walletDisplay.textContent = `Connected wallet: ${window.signer.address}`;
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      alert("Failed to connect to wallet");
    }
  });
});