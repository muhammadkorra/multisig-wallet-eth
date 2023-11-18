// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MultiSig {
    // list of authorized signers
    address[] public authorizedSigners;

    // required quorum
    uint256 public requiredQuorum;

    // wallet owner
    address public owner;

    // event emitted when a new transaction is proposed
    event TransactionProposed(uint256 trxnId, address proposedBy);

    // event emitted when a signer confirms a transaction
    event TransactionConfirmed(int256 trxnId, address confirmedBy);

    // event emitted when the no. of approvals reaches the required quorum
    event TransactionApproved(uint256 trxnId, uint256 quorum);

    // event emitted when a transaction is executed
    event TransactionExecuted(uint256 trxnId, address destination, address executedBy, uint256 value, bool success);

    // error when failing to confirm transaction
    error FailedToConfirmTransaction(string reason);

    // error when failing to execute a transaction
    error FailedToExecuteTransaction(string reason);


    constructor(address[] memory _signers, uint256 _requiredQuorum) {
        owner = msg.sender;
        authorizedSigners = _signers;
        requiredQuorum = _requiredQuorum;
    }
    
    function proposeTransaction(address destination, uint256 _value, bytes memory _data) external {}

    function approveTransaction(uint256 _trxnId) external {}

    function executeTransaction(uint256 _trxnId) external {}
}