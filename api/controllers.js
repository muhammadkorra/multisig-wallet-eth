const { ethers } = require("ethers");
const rpcUrl = "http://127.0.0.1:8545/";

BigInt.prototype.toJSON = function() {
    return this.toString();
}

async function Initialize(contractAddress, abi, testAddress, testAbi) {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const runner = await provider.getSigner(0);

    const multiSig = new ethers.Contract(
        contractAddress,
        abi,
        runner
    );

    const test = new ethers.Contract(
        testAddress,
        testAbi,
        runner
    );

    async function getTransactions(req, res, next) {
        const transactions = (await multiSig.getTransactions()).map((result, index) => {
            const [destination, value, data, executed, quorum] = result;
            return {
                id: index,
                destination,
                value,
                data,
                executed,
                quorum
            };
        });

        res.status(200).send({
            transactions
        });
    }

    async function getAuthorizedSigners(req, res, next) {
        const signers = await multiSig.getAuthorizedSigners();

        res.status(200).send({
            signers
        });
    }
    
    async function proposeTransaction(req, res, next) {
        const { destination, value } = req.body;
        let {data} = req.body;

        const signer3 = await provider.getSigner(3);

        if(!ethers.isAddress(destination)){
            next(new Error("provided destination is an invalid address"));
            return;
        }

        if (data === undefined || data == null) 
            data = "0x";

        // propose a transaction from signer3
        await multiSig.connect(signer3).proposeTransaction(destination, value, data);

        res.status(201).send();
    }

    async function getSampleCallData(req, res, next) {
        const increment = await test.increment.populateTransaction();
        const decrement = await test.decrement.populateTransaction();

        res.status(200).send({
            increment,
            decrement
        });
    }

    async function getCounterValue(req, res, next) {
        const counter = await test.counter();

        res.status(200).send({
            counter
        })
    }

    async function approveTransaction(req, res, next) {
        const { trxnId, signerId } = req.body;
        const signer = await provider.getSigner(signerId);

        try {
            await multiSig.connect(signer).approveTransaction(trxnId);
        } catch (err) {
            // pass to global error handler
            next(new Error(err.revert.args[0]))
        }

        res.status(201).send()
    }

    async function executeTransaction(req, res, next) {
        const { trxnId, signerId } = req.body;
        const signer = await provider.getSigner(signerId);

        try {
            await multiSig.connect(signer).executeTransaction(trxnId);
        } catch (err) {
            // pass to global error handler
            next(new Error(err.revert.args[0]))
        }

        res.status(201).send();
    }

    return Object.freeze({
        getTransactions,
        proposeTransaction,
        getAuthorizedSigners,
        getSampleCallData,
        getCounterValue,
        approveTransaction,
        executeTransaction
    });
}


module.exports = {
    Initialize
}