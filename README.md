
# Monetrum Node Client 




## Install

    npm install monetrum-node-client

## Usage
    var Monetrum = require("monetrum-node-client");
	(async function call() {
	  try {
	    let monetrum = new Monetrum({
	      uri: "http://192.192.192.192/graphql",
	      account_id: "5c12ed220b33ecae4f23268579"
	    });
	    await monetrum.connect();
	    //save() is the service used to create a wallet and save it to the network.The created wallet is also saved in the local database.
	    //The following two lines run the same service.
	    let result1 = await monetrum.save({});
	    let result2 = await monetrum.call("save", {});
	    console.log("result1 : " + JSON.stringify(result1));
	  } catch (e) {
	    console.error(e);
	  }
	})();   
     
## Monetrum Node Client Commands
## getBalance
>   ***`getBalance()`*** is the service that brings balance information according to the wallet address.

    getBalance({address})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`address`   | Monetrum wallet adress |`String`| required

> Example Usage:
> 

    >let  result1  =  await  monetrum.getBalance({address:"90x1HVAJRIZCWSLORDGUOPWHIM6TG62BQRWGX"});
    >let  result2  =  await  monetrum.call("getBalance", {address:"90x1HVAJRIZCWSLORDGUOPWHIM6TG62BQRWGX"});

## getBalancesByAccount  

> ***`getBalanceByAccount()`*** is the service that brings balance informations to the account.


    getBalancesByAccount({assets, cursor});

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`assets`   | Asset list | `Array`|optional
|`cursor`   | Pagination cursor |`String`| optional

> Example Usage:

    >let result1 = await monetrum.getBalancesByAccount({assets:[], cursor:""});
    >let result2 = await monetrum.call("getBalancesByAccount ",{assets:[], cursor:""});

   

## getWallets 

> ***`getWallets()`*** is the service that brings wallet information according to the account.
> 
     getWallets({cursor:""})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`cursor`   | Pagination cursor |`String`| optional


> Example Usage:



     >let result= await monetrum.getWallets({cursor:""});
     >let result= await monetrum.call("getWallets", {cursor:""});

  
   

## getWallet
   >    ***`getWallet()`*** is the service that brings wallet information according to the public key of the wallet.
  
     getWallet({public_key:""})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`public_key`   | Public key of Monetrum wallet |`String`| required

> Example Usage:

    >let result1= await monetrum.getWallet({public_key:"2vFbqa96uv4u7KVouxkVxAf3176AvEUYeemicxrGEyRsHJ3jNgDmLdJMMy5WsKkPCHVe1J7VN3Csx88rHof3DRvf"});
    >let result2 = await monetrum.call("getWallet", {public_key:"2vFbqa96uv4u7KVouxkVxAf3176AvEUYeemicxrGEyRsHJ3jNgDmLdJMMy5WsKkPCHVe1J7VN3Csx88rHof3DRvf"});

   


## getWalletInfo
   >***`getWalletInfo()`*** is the service that brings wallet information according to the private key of the wallet.
  
     getWalletInfo({private_key:""})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`private_key`   | Private key of Monetrum wallet|`String`| required

> Example Usage:

    >let result1= await monetrum.getWalletInfo({private_key:"G9xLYLSXZz4ebHdahhMAANWKK4rUY2rvbdAKQYBqE6NC"});
    >let result2= await monetrum.call("getWalletInfo",{private_key:"G9xLYLSXZz4ebHdahhMAANWKK4rUY2rvbdAKQYBqE6NC"});

## getTxList
   >***`getTxList()`*** is the service that fetches the tx list by filter, sorting, cursor, limit fields.
 
     monetrum.getTxList({filter:{}, sorting:{}, cursor:"", limit:100})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`filters`   | Filter criteria|`Object`| required
| >         | `asset`: Asset type|`String`| optional
|>|`type` : tx type|`Integer`| optional
|>| `seq`:  tx sequence number|`Integer`| optional
|>|`from` :Wallet address|`String`| optional
|>|`action_time`: Action time|`Timestamp`| optional
|>|`complete_time`: Action completion time|`Timestamp`| optional
|>|`my_tx` : Your own transactions |`Boolean`| optional
|>|`account_id`  Account id|`String`| `my_tx` kullanılırsa zorunlu
|`sorting`   | Sorting criteria|`Object`| required
|>| `seq` :  tx sequence number|`String` ("ASC" or"DESC")| optional
|>|`_id`: tx id|`String` ("ASC" or "DESC")| optional
|`cursor`   | pagination cursor|`String`| optional
|`limit`   | tx number per page(default:100)|`Int`|optional

> Example Usage:

    >let result1= await monetrum.getTxList({filters:{}, sorting:{}, cursor:"", limit:100});
    >let result2= await monetrum.call("getTxList", {filters:{}, sorting:{}, cursor:"", limit:100});
   
 

## getTx
   >***`getTx()`*** is the service used to fetch only one TX process based on hash and seq fields.
   >
     monetrum.getTx({hash:"", seq:""})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`hash`| hash value of tx |`String`| optional
|`seq`   | sequence value of tx |`String`| optional

> Example Usage:

    >let result = await monetrum.getTx({hash:"", seq""});
    >let result = await monetrum.call("getTx", {hash:"", seq:""});


## save
   >***`save()`*** is the service used to create a wallet and save it to the network.The created wallet is also saved in the local database.
   >
     monetrum.save({})


> Example Usage:

    >let result1 = await monetrum.save({});
    >let result2 = await monetrum.call("save",{});


## update
   >***`update()`*** is the service that allows you to update wallet_data according to public key.
   >
     monetrum.update({public_key:"", contract_id:"", wallet_data:{}})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`public_key`| Public key of Monetrum wallet |`String`| required
|`contract_id`   | Smart contract id |`String`| optional
|`wallet_data`   | Monetrum wallet data |`String`| optional

> Example Usage:

    >let result1 = await monetrum.update({public_key:"", contract_id"", wallet_data:{}});
    >let result2 = await monetrum.call("update", {public_key:"", contract_id:"", wallet:data:{}});


## send
   >send () is the service that enables you to transfer.
   
   
     monetrum.send({from:"", to:"", amount:100, asset:"", private_key:"", public_key:"", fee_amount:1, fee_from:"", desc:"", data:{}, forms:{} })

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`from`| Address of sender wallet |`String`| required
|`to`| Address of receiver wallet  |`String`| required
|`amount`| Amount to be sent |`Float`| required
|`asset`| Asset type to be sent |`String`| required
|`private_key`| Private key of sender wallet |`String`| required
|`public_key`| Public key of receiver wallet |`String`| required
|`fee_amount`| Fee amount|`Float`|optional
|`fee_from`| Public key of wallet to be cut fee  |`String`| optional
|`desc`| Description of tx|`String`| optional
|`data`| data to be added tx |`JSON`| optional
|`forms`| Form data to be added tx |`JSON`| optional

> Example Usage:

    let result = await monetrum.send({from:"", to:"", amount:100, asset:"", private_key:"", public_key:""});
    let result = await monetrum.call("send", {from:"", to:"", amount:100, asset:"", private_key:"", public_key:""});


## deleteTxData
   >***`deleteTxData()`*** is the service that allows you to delete tx data according to hash and public_key.
   >
     monetrum.deleteTxData({public_key, hash})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`public_key`| Public key of Monetrum wallet |`String`| required
|`hash`   | Hash value of tx  |`String`| required

> Example Usage:
    let result = await monetrum.deleteTxData({hash:"", public_key:""});
    let result = await monetrum.call("deleteTxData", {hash:"", public_key:""});


## getAssets
   >***`getAssets()`*** is the service that brings the information of multiple asset according to filters, sorting and cursor fields.
 >
     monetrum.getAssets({filters:{}, sorting:{}, cursor:""})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`filters`| Filtering criteria|`Object`|required
| > | `name`: Asset name|`String`|optional
| > | `symbol`: Asset symbol|`String`|optional
|`sorting`| Sorting criteria|`Object`|required
|  >| `_id`: Asset id sorting|`String`("ASC" or "DESC")|optional
|`cursor`   | Pagination cursor |`String`| optional

> Example Usage:

    let result1 = await monetrum.getAssets({filters:{name:"", symbol:""}, sorting:{_id:""}, cursor:""});
    let result2= await monetrum.call("getAssets", {filters:{name:"", symbol:""}, sorting:{_id:""}, cursor:""});


## getAsset
   >***`getAsset()`*** is the service that brings the information of only one asset according to name, symbol, and _id.
  
>
     monetrum.getAsset({filters:{name:"", symbol:"", _id:""}})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`filters`| Filter criteria|`Object`|required
| > | `name`: Asset name|`String`|optional
| >| `symbol`: Asset symbol|`String`|optional
| > | `_id`: Asset id sorting|`String`("ASC" or "DESC")|optional


> Example Usage:

    let result1 = await monetrum.getAsset({filters:{name:"", symbol:"", _id:""}});
    let result2= await monetrum.call("getAsset", {filters:{name:"", symbol:"", _id:""}});


## getContract
   >***`getContract()`*** is the service that brings smart contract information according to contact_id and account_id fields.
   >
     monetrum.getContract({contract_id:""})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`contract_id`| Smart contract id|required

> Example Usage:

    >let result1 = await monetrum.getContract({contract_id:""});
    >let result2= await monetrum.call("getContract", {contract_id:""});

## getContractByAddress
   >***`getContractByAddress()`*** is the service that fetches the smart contract information for the given wallet address.
   >
     monetrum.getContract({address:""})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`address`| Address of Monetrum  wallet|`String`|required

> Example Usage:

    let result1 = await monetrum.getContractByAddress({address:""})
    let result2= await monetrum.call("getContractByAddress", {address:""})

## getContracts
   >***`getContracts()`*** is the service that brings smart contracts by filters, sorting, and cursor fields.
  
 >
     monetrum.getContracts({sorting:{}, cursor:""})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`sorting`| Sorting criteria|`Object`|required
| > | `created_date`:Created date of smart contract|`String`("ASC" or "DESC")|optional
|`cursor`|Pagination cursor|`String`|optional

> Örnek Kullanım:

    let result1 = await monetrum.getContracts({sorting:{}, cursor:""});
    let result2= await monetrum.call("getContracts", {sorting:{}, cursor:""});



## createSmartContract
   >***`createSmartContract()`*** is the service used to create smart contracts.
   >
     monetrum.createSmartContract({code:"", name:"", desc:"", detail:"", image:""})

|Paramater|Description  |Data Type|Obligation
|--|--|--|--|
|`code`| Code of smart contract|`String`|required
|`name`| Name of smart contract|`String`|optional
|`desc`| Description of smart contract|`String`|optional
|`detail`| Detail of smart contract|`String`|optional
|`image`| Image of smart contract|`String(Base64)`|optional

> Example Usage:

    let result1 = await monetrum.createSmartContract({code:"", name:"", desc:"", detail:"", image:""});
    let result2= await monetrum.call("createSmartContract", {code:"", name:"", desc:"", detail:"", image:""});
