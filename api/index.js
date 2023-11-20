const express = require("express");
const morgan = require("morgan")
const controllers = require("./controllers.js");
const contractAddress = require("./contracts/contract-address.json")
const MultiSigArtifact = require("./contracts/MultiSig.json");
const TestArtfifact = require("./contracts/Test.json")

const app = express();

app.use(morgan("tiny"))
// to parse request body
app.use(express.json())

controllers.Initialize(contractAddress.MultiSig, MultiSigArtifact.abi, contractAddress.Test, TestArtfifact.abi)
    .then(({ getTransactions, getAuthorizedSigners, proposeTransaction, getSampleCallData, approveTransaction, executeTransaction, getCounterValue }) => {

        app.get("/test/sampleData", getSampleCallData);
        app.get("/test/counter", getCounterValue);

        app.get("/transactions", getTransactions);
        app.get("/signers", getAuthorizedSigners);
        

        app.post("/transactions", proposeTransaction)
        app.post("/transactions/approve", approveTransaction)
        app.post("/transactions/execute", executeTransaction)
        
        app.use((err, req, res, next) => {
            console.log(err.message);
            res.status(400).send({ success: false, message: err.message });
        })
        
        app.listen(3000, () => {
            console.log("server is listening on port 3000..")
        })
    })

