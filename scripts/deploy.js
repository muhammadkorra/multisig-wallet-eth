const { ethers, network, artifacts } = require("hardhat");
const path = require("path");

function saveServerFiles(multiSigAddress){
    const fs = require("fs");
    const contractsDir = path.join(__dirname, "..", "api", "contracts");

    if(!fs.existsSync(contractsDir))
        fs.mkdirSync(contractsDir)

    fs.writeFileSync(
        path.join(contractsDir, "contract-address.json"),
        JSON.stringify({ MultiSig: multiSigAddress }, undefined, 2)
    );

    const MultiSigArtifacts = artifacts.readArtifactSync("MultiSig");

    fs.writeFileSync(
        path.join(contractsDir, "MultiSig.json"),
        JSON.stringify(MultiSigArtifacts, null, 2)
    );
}

async function main() {
    const [owner, signer1, signer2] = await ethers.getSigners();
    const REQUIRED_QUORUM = 2;

    console.log(
        "Deploying the contracts with the account: ", 
        owner.address
    );

    console.log(
        "Assigning authorized signers: \n",
        `Signer1: ${signer1.address}\n`,
        `Signer2: ${signer2.address}\n`,
        `Required Quorum: ${REQUIRED_QUORUM}\n`
    );
    
    const multiSig = await ethers.deployContract("MultiSig", [[signer1, signer2], REQUIRED_QUORUM]);
    await multiSig.waitForDeployment();

    console.log(`MultiSig contract deployed to address: ${await multiSig.getAddress()}`)

    const testContract = await ethers.deployContract("Test");
    await testContract.waitForDeployment();

    console.log(`Test contract deployed to address: ${await testContract.getAddress()}`)

    saveServerFiles(await multiSig.getAddress());
}

main()
.then(() => process.exit(0))
.catch((err) => {
    console.error(err);
    process.exit(1);
});