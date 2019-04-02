"use strict";

const messages = {};
//----------------------------------------------------------------------------------------------------------------------

messages.privateKeyMandatory = `Private key was not found. Please fill in the 'private_key' field.`;
messages.publicKeyMandatory = `Public key was not found. Please fill in the 'public_key' field.`;
messages.senderWalletMandatory = `Sender wallet was not found. Please fill in the 'from' field.`;
messages.recipientWalletMandatory = `The recipient wallet was not found. Please fill in the 'to' field.`;
messages.amountMandatory = `The balance was not found. Please fill in the 'amount' field.`;
messages.assetMandatory = `Asset not found. Please fill in the 'asset' field.`;
messages.walletMandatory = `Wallet address was not found. Please fill in the 'address' field.`;
messages.accountIDMandatory = `No Account ID was found. Please fill in the 'account_id' field.`;
messages.contractIDMandatory = `Contract ID was not found. Please fill in the 'contract_id' field.`;
messages.functionNotFound = `Command was not found.`;
messages.connectionNotFound = `Connection not found.`;
messages.hashMandatory = `Hash not found. Please fill in the 'hash' field.`;
messages.seqMandatory = `Sequence number not found. Please fill in the 'seq' field.`;
messages.uriMandatory = `URI not found. Please fill in the 'uri' field.`;
messages.smartContractMandatory = `No smart contract code found. Please fill in the 'code' field.`;
messages.filtersMandatory = `Filtering criteria is mandatory. Please fill in the 'filters' field.`;
messages.sortingMandatory = `Sorting criteria is mandatory. Please fill in the 'sorting' field.`;

module.exports = messages;
