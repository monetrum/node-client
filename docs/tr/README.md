# Monetrum Node Client 




## Kurulum

    npm install monetrum-node-client

## Kullanımı
    var Monetrum = require("monetrum-node-client");
	(async function call() {
	  try {
	    let monetrum = new Monetrum({
	      uri: "http://192.192.192.192/graphql",
	      account_id: "5c12ed220b33ecae4f23268579"
	    });
	    await monetrum.connect();
	    //The following two lines run the same service.
	    let result1 = await monetrum.save({});
	    let result2 = await monetrum.call("save", {});
	    console.log("result1 : " + JSON.stringify(result1));
	  } catch (e) {
	    console.error(e);
	  }
	})();   
     
     
   ## Monetrum Node Client Komutları
   

   ## getBalance

>   ***`getBalance()`*** servisi, cüzdan adresine göre bakiye bilgisi getirir.


    getBalance({address})

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`address`   | Monetrum cüzdan adresi |`String`| zorunlu

> Örnek Kullanım:
> 

    >let  result1  =  await  monetrum.getBalance({address:"90x1HVAJRIZCWSLORDGUOPWHIM6TG62BQRWGX"});
    >let  result2  =  await  monetrum.call("getBalance", {address:"90x1HVAJRIZCWSLORDGUOPWHIM6TG62BQRWGX"});

## getBalancesByAccount  

> ***`getBalanceByAccount()`*** servisi hesap id ye göre cüzdanların bakiye bilgisini getirir.


    getBalancesByAccount({assets, cursor});

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`assets`   | Asset listesi | `Array`|isteğe bağlı
|`cursor`   | Cursor |`String`| isteğe bağlı

> Örnek Kullanım:

    >let result1 = await monetrum.getBalancesByAccount({assets:[], cursor:""});
    >let result2 = await monetrum.call("getBalancesByAccount ",{assets:[], cursor:""});

   

## getWallets 

> ***`getWallets()`*** servisi hesap id ye göre cüzdanları getirir.

     getWallets({cursor:""})

|Parametre|Açıklama |Veri Tipi |Zorunluluk
|--|--|--|--|
|`cursor`   | Cursor |`String`| isteğe bağlı


> Örnek Kullanım:



     >let result= await monetrum.getWallets({cursor:""});
     >let result= await monetrum.call("getWallets", {cursor:""});

  
   

## getWallet
   >    ***`getWallet()`*** servisi, cüzdan açık anahtarına(public key) göre cüzdan bilgisi getirir.
  
     getWallet({public_key:""})

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`public_key`   | Monetrum cüzdan public key'i |`String`| zorunlu

> Örnek Kullanım:

    >let result1= await monetrum.getWallet({public_key:"2vFbqa96uv4u7KVouxkVxAf3176AvEUYeemicxrGEyRsHJ3jNgDmLdJMMy5WsKkPCHVe1J7VN3Csx88rHof3DRvf"});
    >let result2 = await monetrum.call("getWallet", {public_key:"2vFbqa96uv4u7KVouxkVxAf3176AvEUYeemicxrGEyRsHJ3jNgDmLdJMMy5WsKkPCHVe1J7VN3Csx88rHof3DRvf"});

   


## getWalletInfo
   >***`getWalletInfo()`*** servisi, cüzdanın gizli anahtarına(private key) göre cüzdan bilgisi getirir.
  
     getWalletInfo({private_key:""})

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`private_key`   | Monetrum cüzdan private key'i|`String`| zorunlu

> Örnek Kullanım:

    >let result1= await monetrum.getWalletInfo({private_key:"G9xLYLSXZz4ebHdahhMAANWKK4rUY2rvbdAKQYBqE6NC"});
    >let result2= await monetrum.call("getWalletInfo",{private_key:"G9xLYLSXZz4ebHdahhMAANWKK4rUY2rvbdAKQYBqE6NC"});

## getTxList
   >***`getTxList()`*** servisi; filtre, sıralama ve cursor kriterine göre tx listesi getirir.
  
     monetrum.getTxList({filter:{}, sorting:{}, cursor:"", limit:100})

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`filters`   | Filtreleme kriteri|`Object`| zorunlu
|  | `asset`: Asset tipi|`String`| isteğe bağlı
|  |`type` : tx tipi|`Integer`| isteğe bağlı
| | `seq`:  tx sequence numarası|`Integer`| isteğe bağlı
|   |`from` :Cüzdan adresi|`String`| isteğe bağlı
|   |`action_time`: İşlem tarihi|`Timestamp`| isteğe bağlı
|  |`complete_time`: İşlem tamamlanma tarihi|`Timestamp`| isteğe bağlı
|  |`my_tx`  Kendi cüzdan tx leriniz|`Boolean`| isteğe bağlı
|  |`account_id`  Hesap id|`String`| `my_tx` kullanılırsa zorunludur
|`sorting`   | Sıralama kriteri|`Object`| zorunlu
| | `seq` :  tx sequence numarası|`String` ("ASC" veya "DESC")| isteğe bağlı
|   |`_id`: tx id|`String` ("ASC" veya "DESC")| isteğe bağlı
|`cursor`   | Sayfalama cursor|`String`| isteğe bağlı
|`limit`   | Sayfa başı tx sayısı(varsayılan:100|`Int`| isteğe bağlı

> Örnek Kullanım:

    >let result1= await monetrum.getTxList({filters:{}, sorting:{}, cursor:"", limit:100});
    >let result2= await monetrum.call("getTxList", {filters:{}, sorting:{}, cursor:"", limit:100});
   
 

## getTx
   >***`getTx()`*** servisi, tx'in hash ve sequence değerine göre yalnızca bir tane tx getirir.
   >
     monetrum.getTx({hash:"", seq:""})

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`hash`| tx'in hash değeri |`String`| isteğe bağlı
|`seq`   | tx'in sequence değeri |`String`| isteğe bağlı

> Örnek Kullanım:

    >let result = await monetrum.getTx({hash:"", seq""});
    >let result = await monetrum.call("getTx", {hash:"", seq:""});


## save
   >***`save()`*** servisi cüzdan yaratıp ağa kaydetmeyi sağlar. Bu yaratılan cüzdan aynı zamanda local veritabanına kaydedilir.

     monetrum.save({})


> Örnek Kullanım:

    >let result1 = await monetrum.save({});
    >let result2 = await monetrum.call("save",{});


## update
   >***`update()`*** servisi, cüzdan açık anahtarına(public key) göre cüzdan datasını güncellemeyi sağlar.
   >
     monetrum.update({public_key:"", contract_id:"", wallet_data:{}})

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`public_key`| Monetrum cüzdanın public key'i |`String`| zorunlu
|`contract_id`   | Akıllı sözleşme id'si |`String`| isteğe bağlı
|`wallet_data`   | Cüzdan data'sı |`String`| isteğe bağlı

> Örnek Kullanım:

    >let result1 = await monetrum.update({public_key:"", contract_id"", wallet_data:{}});
    >let result2 = await monetrum.call("update", {public_key:"", contract_id:"", wallet:data:{}});


## send
   >***`send ()`*** servisi transfer işlemi yapmayı ssağlar.
   
     monetrum.send({from:"", to:"", amount:100, asset:"", private_key:"", public_key:"", fee_amount:1, fee_from:"", desc:"", data:{}, forms:{} })

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`from`| Gönderen cüzdan adresi |`String`| zorunlu
|`to`| Alıcı cüzdan adresi |`String`| zorunlu
|`amount`| Gönderilecek miktar
 |`Float`| zorunlu
|`asset`| Gönderilecek asset tipi |`String`| zorunlu
|`private_key`| Gönderen cüzdan private key'i |`String`| zorunlu
|`public_key`| Gönderen cüzdan public key'i |`String`| zorunlu
|`fee_amount`| Kesilecek ücret miktarı |`Float`|isteğe bağlı
|`fee_from`| Ücret kesilmek istenen cüzdanın public adresi |`String`| isteğe bağlı
|`desc`| tx açıklaması |`String`| isteğe bağlı
|`data`| Tx e eklenecek data |`JSON`| isteğe bağlı
|`forms`| Tx e eklenecek form datası |`JSON`| isteğe bağlı

> Örnek Kullanım:

    let result = await monetrum.send({from:"", to:"", amount:100, asset:"", private_key:"", public_key:""});
    let result = await monetrum.call("send", {from:"", to:"", amount:100, asset:"", private_key:"", public_key:""});


## deleteTxData
   >***`deleteTxData()`*** is the service that allows you to delete tx data according to hash and public_key.
   >
     monetrum.deleteTxData({public_key:"", hash:""})

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`public_key`| Monetrum cüzdanın public key'i |`String`| zorunlu
|`hash`   | tx'in hash değeri |`String`| zorunlu

> Örnek Kullanım:
    let result = await monetrum.deleteTxData({hash:"", public_key:""});
    let result = await monetrum.call("deleteTxData", {hash:"", public_key:""});


## getAssets
   >***`getAssets()`*** is the service that brings the information of multiple asset according to filters, sorting and cursor fields.
   >
     monetrum.getAssets({filters:{}, sorting:{}, cursor:""})

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`filters`| Filtreleme kriteri|`Object`|zorunlu
|| `name`: Asset adı|`String`|isteğe bağlı
|| `symbol`: Asset sembolü|`String`|isteğe bağlı
|`sorting`| Sıralama kriteri|`Object`|zorunlu
|| `_id` Asset id sıralama|`String`("ASC" veya "DESC")|isteğe bağlı
|`cursor`   | Sayfalama cursor'u |`String`| isteğe bağlı

> Örnek Kullanım:

    let result1 = await monetrum.getAssets({filters:{name:"", symbol:""}, sorting:{_id:""}, cursor:""});
    let result2= await monetrum.call("getAssets", {filters:{name:"", symbol:""}, sorting:{_id:""}, cursor:""});

## getAsset
   >***`getAsset()`*** is the service that brings the information of only one asset according to name, symbol, and _id.
   >
     monetrum.getAsset({filters:{name:"", symbol:"", _id:""}})

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`filters`| Filtreleme kriteri|`Object`|zorunlu
|| `name`: Asset adı|`String`|isteğe bağlı
|| `symbol`: Asset sembolü|`String`|isteğe bağlı
|| `_id` Asset id sıralama|`String`("ASC" veya "DESC")|isteğe bağlı

> Örnek Kullanım:

    let result1 = await monetrum.getAsset({filters:{name:"", symbol:"", _id:""}});
    let result2= await monetrum.call("getAsset", {filters:{name:"", symbol:"", _id:""}});


## getContract
   >***`getContract()`*** is the service that brings smart contract information according to contact_id and account_id fields.
   >
     monetrum.getContract({contract_id:""})

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`contract_id`| Akıllı sözleşme id'si|`String`|zorunlu

> Örnek Kullanım:

    >let result1 = await monetrum.getContract({contract_id:""});
    >let result2= await monetrum.call("getContract", {contract_id:""});

## getContractByAddress
   >***`getContractByAddress()`*** is the service that fetches the smart contract information for the given wallet address.
   >
     monetrum.getContract({address:""})

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`address`| Monetrum cüzdan adresi|`String`|zorunlu

> Örnek Kullanım:

    let result1 = await monetrum.getContractByAddress({address:""})
    let result2= await monetrum.call("getContractByAddress", {address:""})

## getContracts
   >***`getContracts()`*** is the service that brings smart contracts by filters, sorting, and cursor fields.
   >
     monetrum.getContracts({sorting:{}, cursor:""})

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`sorting`| Sıralama kriteri|`Object`|zorunlu
|| `updated_time`: Güncellenme tarihi|`String`("ASC" veya "DESC")|isteğe bağlı
|`cursor`| Sayfalama cursor'u|`String`|isteğe bağlı

> Örnek Kullanım:

    let result1 = await monetrum.getContracts({sorting:{updated_time:""}, cursor:""});
    let result2= await monetrum.call("getContracts", {sorting:{updated_time:""}, cursor:""});



## createSmartContract
   >***`createSmartContract()`*** is the service used to create smart contracts.
   >
     monetrum.createSmartContract({code:"", name:"", desc:"", detail:"", image:""})

|Parametre|Açıklama  |Veri Tipi|Zorunluluk
|--|--|--|--|
|`code`| Akıllı sözleşme kodu|`String`|zorunlu
|`name`| Akıllı sözleşme adı|`String`|isteğe bağlı
|`desc`| Akıllı sözleşme açıklaması|`String`|isteğe bağlı
|`detail`| Akıllı sözleşme detayı|`String`|isteğe bağlı
|`image`| Akıllı sözleşme resmi|`String(Base64)`|isteğe bağlı

> Örnek Kullanım:

    let result1 = await monetrum.createSmartContract({code:"", name:"", desc:"", detail:"", image:""});
    let result2= await monetrum.call("createSmartContract", {code:"", name:"", desc:"", detail:"", image:""});
