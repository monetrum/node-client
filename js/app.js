var Monetrum = require("./index");
(async function call() {
  try {
    let monetrum = new Monetrum({
      uri: "http://185.195.255.172/graphql",
      account_id: "5c73ed220b7aec64f1b68579"
    });
    await monetrum.connect();
    //The following two lines run the same service.
    /*let result1 = await monetrum.getBalance({
      address: "90x188RA1CMSKRPWFSRVP6UUJHZ4E5EC4HE3U"
    });*/
    let result1 = await monetrum.call("update", {
      public_key:
        "4Vg6bv378RN4pRSbVvzKJ5hAmbC7etp8jR7M7zyX3NDuvgRUqg2FBTayW5SGdkdNrAHfUkdMhjg2GM6CDQVxi88a"
    });
    /* let result1 = await monetrum.getWalletInfo({
      private_key: "DGgV6kWL8jJznPT5uBJ7L2tJ8fRTjkqzu7TuKC8p5xCb"
    });*/

    console.log("result1 : " + JSON.stringify(result1));
  } catch (e) {
    console.error(e);
  }
})();
