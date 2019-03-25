var Monetrum = require("./index");
var Functions = require("./functions");

async function call() {
  try {
    let monetrum = new Monetrum({
      uri: "http://185.195.255.172/graphql",
      account_id: "5c73ed220b7aec64f1b68579"
    });

    await monetrum.connect();
    /*
    let result = await monetrum.callFunction("getBalanceByWallet", {
      address: "90x1EJBNIBNOHD73AQ2QBDM1TEAWJZXZ7NSWO",
      assets: ["MNT"]
    });
*/
    /*
    let result2 = await monetrum.getBalanceByWallet({
      assets: ["MNT"]
    });*/

    let result = await monetrum.save({});

    //let result = await monetrum.cmd("save", {});
    console.log("RESULTTTT   :   " + JSON.stringify(result));
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
call();
