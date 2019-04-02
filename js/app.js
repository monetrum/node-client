var Monetrum = require("./index");
(async function call() {
  try {
    let monetrum = new Monetrum({
      uri: "http://185.195.255.172/graphql",
      account_id: "5c9f46c7a6bea52dcf0895a6"
    });
    await monetrum.connect();

    //The following two lines run the same service.
    /*let result1 = await monetrum.getBalance({
      address: "90x1F2WYHPTZFWAVCNR42AAVYBETVPGDNST3K",
      assets:["MNT","MSM"]
    });*/

    /*let result1 = await monetrum.getBalancesByAccount({});*/
    /*let result1 = await monetrum.getWallets({});*/
    /*let result1 = await monetrum.getWallet({
      public_key:
        "3JiZQP8wKVyxdPxAhQGQZrYgD9RHaeA74Kt8rB8hvDiEsRPtH24ehGhZAPhGncgnGJ1JoQhKa9RQRQD7etV2setM"
    });*/
    /*let result1 = await monetrum.getWalletInfo({
      private_key: "AjfYQX1HFVaHTGcVuy1xW8mLXvJy2XFYtaRKKDMmoKva"
    });*/

    let result1 = await monetrum.getTxList({
      filters: { my_tx: true },
      sorting: { seq: "ASC", _id: "ASC" }
    });

    /*let result1 = await monetrum.getTx({ seq: 1448 }); */
    /*let result1 = await monetrum.update({
      public_key:
        "5uD8VZry9s6dytwKKbUbNW74BGpW8WRiiEBqwhyEDppVDBYaZXqQeYGeEfAiTyVBFPWvFxyvrRRUjwYkPmZwx6ny",
      wallet_data: { asd: "def" }
    });*/

    /*let result1 = await monetrum.send({
      from: "90x1F2WYHPTZFWAVCNR42AAVYBETVPGDNST3K",
      to: "90x1EJBNIBNOHD73AQ2QBDM1TEAWJZXZ7NSWO",
      amount: 20,
      asset: "MNT",
      private_key: "AjfYQX1HFVaHTGcVuy1xW8mLXvJy2XFYtaRKKDMmoKva",
      public_key:
        "3JiZQP8wKVyxdPxAhQGQZrYgD9RHaeA74Kt8rB8hvDiEsRPtH24ehGhZAPhGncgnGJ1JoQhKa9RQRQD7etV2setM",
      fee_amount: 1
    });*/

    /*let result1 = await monetrum.deleteTxData({
      hash: "6dc1b5eefe899ae7b6d4ff46de1a1f50f0350f7877904e68c734beb5b2fa25cd",
      public_key:
        "3JiZQP8wKVyxdPxAhQGQZrYgD9RHaeA74Kt8rB8hvDiEsRPtH24ehGhZAPhGncgnGJ1JoQhKa9RQRQD7etV2setM"
    });*/

    /*let result1 = await monetrum.getAssets({filters:{name:"Monetrum", symbol:"MNT"}, sorting:{_id:"ASC"}});*/

    /* let result1 = await monetrum.getAsset({
      filters: {
        name: "Monetrum",
        symbol: "MNT"
      }
    });
    */
    /*
    let result1 = await monetrum.getContract({
      contract_id: "5c765b8c96180e2993d2c61e"
    });*
    /*
    let result1 = await monetrum.getContractByAddress({
      address: "90x1F2WYHPTZFWAVCNR42AAVYBETVPGDNST3K"
    });
*/

    /* let result1 = await monetrum.getWallets({});*/
    /*
    let result1 = await monetrum.createSmartContract({
      name: "Monetrum Contracts",
      code: "dfskjskdfkjdsfkjdsgfıksdgf"
    });*/

    /*let result1 = await monetrum.call("update", {
      public_key:
        "4Vg6bv378RN4pRSbVvzKJ5hAmbC7etp8jR7M7zyX3NDuvgRUqg2FBTayW5SGdkdNrAHfUkdMhjg2GM6CDQVxi88a"
    });
    */

    /* let result1 = await monetrum.getWalletInfo({
      private_key: "DGgV6kWL8jJznPT5uBJ7L2tJ8fRTjkqzu7TuKC8p5xCb"
    });*/

    console.log("result1 : " + JSON.stringify(result1));
  } catch (e) {
    console.error(e);
  }
})();
