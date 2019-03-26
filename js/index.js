const graphQLClient = require("./graphQLClient");
const functions = require("./functions");
const { createWallet, nonce, signing } = require("../helpers/ecdsa");
const message = require("../message/message");
const {
  persistWallet,
  getSqliteMaster,
  getWalletsCreatedOnNodeClient
} = require("../db/store");
const knex = require("../knex/knex.js");
var fs = require("fs");
global.appdir = __dirname;

class Monetrum {
  constructor(opts) {
    if (opts) {
      if (opts.uri) {
        this.uri = opts.uri;
      } else {
        throw new Error(message.uriMandatory);
      }
    }
    this.contract_id = opts.contract_id;
    this.account_id = opts.account_id;
  }

  graphQLErrorCallback(e) {
    if (e.networkError) {
      e.networkError.result.errors.forEach(element => {
        throw new Error(element.message);
      });
    }

    if (e.graphQLErrors.length > 0) {
      e.graphQLErrors.forEach(element => {
        throw new Error(element.message);
      });
    }
  }
  /**
   * @description connect() is the function used to connect to the Monetrum Masternode API.
   */
  async connect() {
    try {
      const client = new graphQLClient(this.uri, false);
      client.setErrorCallback(this.graphQLErrorCallback);
      await client.connect();
      this.client = client;
      await this.initDatabase();
    } catch (error) {
      throw new Error(error);
    }
  }

  async initDatabase() {
    try {
      let result = await getSqliteMaster();
      if (
        fs.existsSync(require.resolve(__dirname + "/../db/monetrum.sqlite"))
      ) {
        if (result.length == 0) {
          await knex.migrate.latest().then(function(data) {
            console.log("Database created successfully." + data);
            return;
          });
        }
      } else {
        console.log("elseeee");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *
   * @param {*} func
   * @param {*} params
   * @description cmd() is the function used to run the service by service name and by taking a parameter.
   */
  async cmd(func, params) {
    try {
      this.checkConnection();
      let object = functions[func];
      if (object) {
        let result = await this[func](params);
        return result;
      } else {
        console.log("message.functionNotFound : " + message.functionNotFound);
        throw new Error(message.functionNotFound);
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  checkConnection() {
    if (!this.client) {
      throw new Error(message.connectionNotFound);
    }
  }
  /**
   *
   * @param {*} params
   * @description getBalanceByWallet() is the service that brings balance information according to the wallet address.
   */
  async getBalanceByWallet(params) {
    try {
      this.checkConnection();
      if (params.address) {
        return await this.client.query(
          functions["getBalanceByWallet"].query,
          params
        );
      } else {
        throw new Error(message.walletMandatory);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *
   * @description getWalletsCreatedOnNodeClient() is the service that creates the wallets created in the node client.
   */
  async getWalletsCreatedOnNodeClient() {
    try {
      return await getWalletsCreatedOnNodeClient();
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *
   * @param {*} params
   * @description getBalanceByAccount() is the service that brings balance information to the account.
   */
  async getBalancesByAccount(params) {
    try {
      this.checkConnection();
      if (this.account_id) {
        params.account_id = account_id;
        return await this.client.query(
          functions["getBalancesByAccount"].query,
          params
        );
      } else {
        throw new Error(message.accountIDMandatory);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *
   * @param {*} params
   * @description getWallets() is the service that brings wallet information according to the account.
   */
  async getWallets(params) {
    try {
      this.checkConnection();
      if (this.account_id) {
        params.account_id = this.account_id;
        return await this.client.query(functions["getWallets"].query, params);
      } else {
        throw new Error(message.accountIDMandatory);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *
   * @param {*} params
   * @description getWallet() is the service that brings wallet information according to the public key of the wallet.
   */
  async getWallet(params) {
    try {
      this.checkConnection();
      if (params.public_key) {
        return await this.client.query(functions["getWallet"].query, params);
      } else {
        throw new Error(message.publicKeyMandatory);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *
   * @param {*} params
   * @description getWalletInfo() is the service that brings wallet information according to the private key of the wallet.
   */
  async getWalletInfo(params) {
    try {
      this.checkConnection();
      if (params.private_key) {
        return await this.client.query(
          functions["getWalletInfo"].query,
          params
        );
      } else {
        throw new Error(message.privateKeyMandatory);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *
   * @description beklesinn
   * @description getTxList() is the service that fetches the tx list by filter, sorting, cursor, limit fields.
   */

  async getTxList(params) {
    try {
      return await this.client.query(functions["getTxList"].query, params);
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *
   * @param {*} params
   * @description getTx() is the service used to fetch only one TX process based on hash and seq fields.
   */
  async getTx(params) {
    try {
      this.checkConnection();
      let filters = {};
      if (params) {
        filters.hash = params.hash;
        filters.seq = params.seq;
      }
      return await this.client.mutation(functions["getTx"].query, {
        filters: filters
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *
   * @param {*} params
   * @description save() is the service used to create a wallet and save it to the network.The created wallet is also saved in the local database.
   */
  async save(params) {
    try {
      this.checkConnection();
      if (this.account_id) {
        let walletInfo = createWallet();
        params.account_id = this.account_id;
        params.public_key = walletInfo.publicKey;
        params.private_key = walletInfo.privateKey;
        params.address = walletInfo.address;

        let result = await this.client.mutation(
          functions["save"].query,
          params
        );
        if (result) {
          await persistWallet(
            this.account_id,
            params.public_key,
            params.private_key,
            params.address
          );
        }
        return result;
      } else {
        throw new Error(message.accountIDMandatory);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *
   * @param {*} params
   * @description update() is the service that allows you to update wallet_data according to public key.
   */
  async update(params) {
    try {
      this.checkConnection();
      if (params.public_key) {
        return await this.client.mutation(functions["update"].query, params);
      } else {
        throw new Error(message.publicKeyMandatory);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *
   * @param {*} params
   * description send () is the service that enables you to transfer money(coin).
   */
  async send(params) {
    try {
      this.checkConnection();
      let keys = {};
      let { from, to, amount, asset, private_key, public_key } = params;

      if (!from) {
        throw new Error(message.senderWalletMandatory);
      }
      if (!to) {
        throw new Error(message.recipientWalletMandatory);
      }
      if (!amount) {
        throw new Error(message.amountMandatory);
      }
      if (!asset) {
        throw new Error(message.assetMandatory);
      }
      if (!private_key) {
        throw new Error(message.privateKeyMandatory);
      }
      if (public_key) {
        keys.public_key = public_key;
      } else {
        throw new Error(message.publicKeyMandatory);
      }
      let msg = `${from}__${to}__${amount}__${asset}__${nonce()}`;
      keys.sign = signing(private_key, msg);
      params.keys = keys;
      return await this.client.mutation(functions["send"].query, params);
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *
   * @param {*} params
   * @description deleteTxData() is the service that allows you to delete tx data according to hash and public_key.
   */
  async deleteTxData(params) {
    try {
      this.checkConnection();
      let parameter = {};
      if (params.hash) {
        parameter.hash = params.hash;
      } else {
        throw new Error(message.hashMandatory);
      }
      if (params.seq) {
        parameter.seq = params.seq;
      } else {
        throw new Error(message.seqMandatory);
      }
      return await this.client.mutation(
        functions["deleteTxData"].query,
        parameter
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *
   * @param {*} params
   * @description getAssets() is the service that brings the information of multiple asset according to filters, sorting and cursor fields.
   */
  async getAssets(params) {
    try {
      this.checkConnection();
      return await this.client.query(functions["getAssets"].query, params);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *
   * @param {*} params
   * @description getAsset() is the service that brings the information of only one asset according to name, symbol, and _id.
   */
  async getAsset(params) {
    try {
      this.checkConnection();
      let filters = {};
      let asd = {};
      asd.filters = filters;
      if (params) {
        filters.name = params.name;
        filters.symbol = params.symbol;
        filters._id = params._id;
      }
      return await this.client.query(functions["getAsset"].query, {
        filters: filters
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *
   * @param {*} params
   * @description getContract() is the service that brings smart contract information according to contact_id and account_id fields.
   */
  async getContract(params) {
    try {
      this.checkConnection();
      let parameter = {};
      if (this.account_id) {
        parameter.account_id = this.account_id;
        if (params.contract_id) {
          parameter.contract_id = params.contract_id;
        }
        return await this.client.query(
          functions["getContract"].query,
          parameter
        );
      } else {
        throw new Error(message.accountIDMandatory);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *
   * @param {*} params
   * @description getContractByAddress() is the service that fetches the smart contract information for the given wallet address.
   */
  async getContractByAddress(params) {
    try {
      this.checkConnection();
      if (params.address) {
        return await this.client.query(
          functions["getContractByAddress"].query,
          { address: params.address }
        );
      } else {
        throw new Error(message.walletMandatory);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *
   * @param {*} params
   * @description getContracts() is the service that brings smart contracts by filters, sorting, and cursor fields.
   */
  async getContracts(params) {
    try {
      this.checkConnection();
      let filters = {};
      let sorting = {};
      let cursor = params.cursor;

      if (this.account_id) {
        filters.account_id = this.account_id;
        if (params.sorting) {
          sorting = params.sorting;
        }
        return await this.client.query(functions["getContracts"].query, {
          filters,
          sorting,
          cursor
        });
      } else {
        throw new Error(message.accountIDMandatory);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *
   * @param {*} params
   * @description createSmartContract() is the service used to create smart contracts.
   */
  async createSmartContract(params) {
    try {
      this.checkConnection();
      let parameter = params;
      if (this.account_id) {
        parameter.account_id = this.account_id;
      } else {
        throw new Error(message.accountIDMandatory);
      }
      if (!parameters.code) {
        throw new Error(message.smartContractMandatory);
      }
      return await this.client.query(functions["createSmartContract"].query, {
        parameter: parameter
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Monetrum;
