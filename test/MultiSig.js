const { expect } = require('chai');
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require('hardhat');

const REQUIRED_QUORUM = 2;

describe("MultiSig Contract", function() {

    async function deployContractFixture() {
        const [owner, signer1, signer2] = await ethers.getSigners();

        const multiSig = await ethers.deployContract("MultiSig", [[signer1.address, signer2.address], REQUIRED_QUORUM])

        return { owner, multiSig, signer1, signer2 }
    }

    describe("Deployment", function() {

        it("Should set the right owner", async function() {
            const { multiSig, owner } = await loadFixture(deployContractFixture);

            // verify the owner from the contract state
            expect(await multiSig.owner()).to.equal(owner.address);
        })

        it("Should set the right number of quorum", async function() {
            const { multiSig } = await loadFixture(deployContractFixture);
            
            // verify the required quorum from the contract state
            expect(await multiSig.requiredQuorum()).to.equal(REQUIRED_QUORUM);
        })

        it("Should set the right signers", async function() {
            const { multiSig, signer1, signer2 } = await loadFixture(deployContractFixture);

            // verify the first signer
            expect(await multiSig.authorizedSigners(0)).to.equal(signer1.address);

            // verify the second signer
            expect(await multiSig.authorizedSigners(1)).to.equal(signer2.address);
        })
    })
})