const aWallet = new Map();
const walletChoice = document.getElementById('walletChoices');
const connectWallet = document.getElementById('connectWallet');
const walletStatus = document.getElementById('walletStatus');


// Function to identify and connect to a wallet
window.addEventListener("eip6963:annouceProvider", (event) => {
    const pInfo = event.detail;
    const id = pInfo.info.uuid;
    console.log(event);
    if(!aWallet.has(id)){
        aWallet.set(id,pInfo);
        const option = document.createElement('option');
        option.value = id;
        option.textContent = pInfo.info.name;
        walletChoice.appendChild(option);
        console.log("Discovered New Wallet: ",pInfo.info.name);
    }
});

//Asking wallets to announce themselves
window.dispatchEvent(new Event("eip6963:requestProviders"));

// Connect to the selected wallet
connectWallet.addEventListener('click',async()=>{
    const ch = walletChoice.value;
    const sWallet = aWallet.get(ch);
    console.log("Selected Wallet: ",sWallet);
if(!sWallet){
    alert("Please select a wallet to connect.");
}

try{
    const acc = await sWallet.provider.request({method: "eth_requestAccounts"});
    walletStatus.textContent = `Connected to ${sWallet.info.name} with account: ${acc[0]}`;

} catch(error){
    console.log("Unable to connect to wallet: ", error);
    walletStatus.textContent = `Error connecting to wallet: ${error.message}`;
}
});

