// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MultiSig {

    // define a Transaction structure
    struct Transaction {
        // the destination address of the transaction
        address destination;

        // value of the transaction (in wei)
        uint256 value;

        // the transaction data
        bytes data;

        // whether the tansaction has been executed or not (to prevent re-execution)
        bool executed;

        // quorum received on this transaction (must be > requiredQuorum) for transaction to execute
        uint256 quorum;
    }

    // list of authorized signers
    address[] public authorizedSigners;

    // required quorum
    uint256 public requiredQuorum;

    // wallet owner
    address public owner;

    // to permit O(1) lookup for the signers, instead O(n) every time a function is called
    mapping(address => bool) public isSigner;

    // the list of transactions since contract deployment
    Transaction[] public transactions;

    // event emitted when a new transaction is proposed
    event TransactionProposed(uint256 trxnId, address proposedBy);

    // event emitted when a transaction reaches the no. of approvals required for execution
    event TransactionConfirmed(uint256 trxnId, uint256 quorum);

    // event emitted when a signer approves a transaction
    event TransactionApproved(uint256 trxnId, address approvedBy);

    // event emitted when a transaction is executed
    event TransactionExecuted(uint256 trxnId, address destination, address executedBy, uint256 value, bool success);

    // error when failing to execute a transaction
    error FailedToExecuteTransaction(string reason);

    // allows only authorized signers and owner to perform the action
    modifier onlySigners() {
        require(msg.sender == owner || isSigner[msg.sender] , "Only contract owner or authorized signers can perform this action");
        _;
    }


    constructor(address[] memory _signers, uint256 _requiredQuorum) {
        owner = msg.sender;
        // authorizedSigners = _signers;

        // perform this step to decrease lookup time for signers
        for (uint i = 0; i < _signers.length; i++) {
            address signer = _signers[i];

            require(!isSigner[signer], "signer already exists");

            isSigner[signer] = true;
            authorizedSigners.push(signer);
        }

        requiredQuorum = _requiredQuorum;
    }
    
    // this is not protected since "anyone" can propose a transaction
    function proposeTransaction(address _destination, uint256 _value, bytes memory _data) external{
        uint256 trxnId = transactions.length;

        // create a new transaction and push it to the transactions list
        transactions.push(Transaction({
            destination: _destination,
            value: _value,
            data: _data,
            executed: false,
            quorum: 0
        }));

        // emit the proposed event
        emit TransactionProposed(trxnId, msg.sender);
    }

    // only contract owner or authorized signers can perform this action
    function approveTransaction(uint256 _trxnId) external onlySigners {
        
        // make sure transaction exists
        require(transactions.length > _trxnId, "Transaction does not exist");

        // make sure that it is not already executed
        require(!transactions[_trxnId].executed, "Transaction already executed");

        Transaction storage trxn = transactions[_trxnId];

        // increment number of received confirmations
        trxn.quorum += 1;

        // emit the confirmed event
        emit TransactionApproved(_trxnId, msg.sender);

        // if transaction quorum is reached emit the approved event
        if(trxn.quorum >= requiredQuorum)
            emit TransactionConfirmed(_trxnId, trxn.quorum);
    }

    function executeTransaction(uint256 _trxnId) external {}
}