const graphQLClient = require("./graphQLClient");
const functions = require("./functions");
const { createWallet, getNonce, signing } = require("../helpers/ecdsa");
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
  async call(func, params) {
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
  async getBalance(params) {
    try {
      this.checkConnection();
      if (!params.address) {
        throw new Error(message.walletMandatory);
      }
      let result = await this.client.query(
        functions["getBalance"].query,
        params
      );
      if (result) {
        return result.wallet.getBalanceByWallet;
      }
      return;
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
      if (!this.account_id) {
        throw new Error(message.accountIDMandatory);
      }
      params.account_id = this.account_id;
      let result = await this.client.query(
        functions["getBalancesByAccount"].query,
        params
      );
      if (result) {
        return result.wallet.getBalancesByAccount.wallets;
      }
      return;
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
      let wallets = [];
      this.checkConnection();
      if (!this.account_id) {
        throw new Error(message.accountIDMandatory);
      }

      params.account_id = this.account_id;
      let result = await this.client.query(
        functions["getWallets"].query,
        params
      );
      let walletsFromApi = result.wallet.getWallets.wallets;
      let walletsFromLocal = await getWalletsCreatedOnNodeClient({
        account_id: this.account_id
      });
      if (walletsFromApi) {
        wallets.push(...walletsFromApi);
        if (walletsFromLocal) {
          walletsFromLocal.forEach(function(val) {
            var picked = wallets.find(x => x.address === val.address);
            if (picked) {
              picked.private_key = val.private_key;
              picked.public_key = val.public_key;
            }
          });
        }
      }
      return wallets;
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
      if (!params.public_key) {
        throw new Error(message.publicKeyMandatory);
      }

      let result = await this.client.query(
        functions["getWallet"].query,
        params
      );
      let walletsFromLocal = await getWalletsCreatedOnNodeClient({
        public_key: params.public_key
      });
      let walletsFromApi = result.wallet.getWallet;
      if (walletsFromApi && walletsFromLocal.length == 1) {
        let walletLocal = walletsFromLocal[0];
        if (walletsFromApi.address === walletLocal.address) {
          walletsFromApi.private_key = walletLocal.private_key;
          walletsFromApi.public_key = walletLocal.public_key;
        }
      }
      return walletsFromApi;
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
      if (!params.private_key) {
        throw new Error(message.privateKeyMandatory);
      }
      let result = await this.client.query(
        functions["getWalletInfo"].query,
        params
      );
      if (result) {
        return result.wallet.getWalletInfo;
      }
      return;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *1
   * @description beklesinn
   * @description getTxList() is the service that fetches the tx list by filter, sorting, cursor, limit fields.
   */

  async getTxList(params) {
    try {
      if (!params.filters) {
        throw new Error(message.filtersMandatory);
      }
      if (!params.sorting) {
        throw new Error(message.sortingMandatory);
      }

      let filters = {};
      let filter = params.filters;
      for (var key in filter) {
        if (filter.hasOwnProperty(key)) {
          if (key === "my_tx") {
            //account_id geçilecek
            filters[key] = filter[key];
          } else {
            filters[key] = { eq: filter[key] };
          }
        }
      }
      let parameter = { filters, sorting: params.sorting };
      if (params.cursor) {
        parameter.cursor = params.cursor;
      }
      if (params.limit) {
        parameter.limit = params.limit;
      }
      let result = await this.client.query(
        functions["getTxList"].query,
        parameter
      );
      if (result) {
        return result.tx.getTxList;
      }
      return;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *1
   * @param {*} params
   * @description getTx() is the service used to fetch only one TX process based on hash and seq fields.
   */
  async getTx(params) {
    try {
      this.checkConnection();
      let filters = {};
      if (params) {
        if (params.hash) {
          filters.hash = params.hash;
        }
        if (params.seq) {
          filters.seq = params.seq;
        }
      }
      return await this.client.query(functions["getTx"].query, { filters });
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
      if (!this.account_id) {
        throw new Error(message.accountIDMandatory);
      }
      let walletInfo = createWallet();
      params.account_id = this.account_id;
      params.public_key = walletInfo.publicKey;
      params.private_key = walletInfo.privateKey;
      params.address = walletInfo.address;
      let result = await this.client.mutation(functions["save"].query, params);
      if (result) {
        await persistWallet(
          this.account_id,
          params.public_key,
          params.private_key,
          params.address
        );
        return result.wallet.save;
      }
      return;
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

      if (!params.public_key) {
        throw new Error(message.publicKeyMandatory);
      }
      let result = await this.client.mutation(
        functions["update"].query,
        params
      );
      if (result) {
        return result.wallet.update;
      }
      return;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *1
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
      params.nonce = getNonce();
      params.fee_from = keys.public_key;
      let msg = `${from}__${to}__${amount}__${asset}__${params.nonce}`;
      keys.sign = signing(private_key, msg);
      params.keys = keys;
      params.public_key = undefined;
      params.private_key = undefined;
      let result = await this.client.mutation(functions["send"].query, params);
      if (result) {
        return result.tx.send;
      }
      return;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   *1
   * @param {*} params
   * @description deleteTxData() is the service that allows you to delete tx data according to hash and public_key.
   */
  async deleteTxData(params) {
    try {
      this.checkConnection();
      if (!params.hash) {
        throw new Error(message.hashMandatory);
      }
      if (!params.public_key) {
        throw new Error(message.publicKeyMandatory);
      }
      let result = await this.client.mutation(
        functions["deleteTxData"].query,
        params
      );
      if (result) {
        return result.tx.deleteTxData;
      }
      return;
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
      if (!params.filters) {
        throw new Error(message.filtersMandatory);
      }
      if (!params.sorting) {
        throw new Error(message.sortingMandatory);
      }

      let filters = {};
      let filter = params.filters;
      for (var key in filter) {
        if (filter.hasOwnProperty(key)) {
          filters[key] = { eq: filter[key] };
        }
      }

      let parameter = { filters, sorting: params.sorting };
      if (params.cursor) {
        parameter.cursor = params.cursor;
      }

      let result = await this.client.query(
        functions["getAssets"].query,
        parameter
      );
      if (result) {
        return result.assets.getAssets;
      }
      return;
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
      if (!params.filters) {
        throw new Error(message.filtersMandatory);
      }
      let result = await this.client.query(functions["getAsset"].query, params);
      if (result) {
        return result.assets.getAsset;
      }
      return;
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
      if (!this.account_id) {
        throw new Error(message.accountIDMandatory);
      }
      if (!params.contract_id) {
        throw new Error(message.contractIDMandatory);
      }
      params.account_id = this.account_id;
      let result = await this.client.query(
        functions["getContract"].query,
        params
      );
      if (result) {
        return result.smartContractCrud.getContract;
      }
      return;
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
      if (!params.address) {
        throw new Error(message.walletMandatory);
      }
      let result = await this.client.query(
        functions["getContractByAddress"].query,
        { address: params.address }
      );
      if (result) {
        return result.smartContractCrud.getContractByAddress;
      }
      return;
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
      if (!this.account_id) {
        throw new Error(message.accountIDMandatory);
      }
      if (!params.sorting) {
        throw new Error(message.sortingMandatory);
      }
      let parameters = { sorting: params.sorting };
      let filters = {};

      filters.account_id = this.account_id;
      parameters.filters = filters;
      if (params.cursor) {
        parameters.cursor = cursor;
      }
      let result = await this.client.query(
        functions["getContracts"].query,
        parameters
      );
      if (result) {
        return result.smartContractCrud.getContracts;
      }
      return;
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
      if (!this.account_id) {
        throw new Error(message.accountIDMandatory);
      }
      if (!params.code) {
        throw new Error(message.smartContractMandatory);
      }

      parameter.account_id = this.account_id;
      let result = await this.client.mutation(
        functions["createSmartContract"].query,
        {
          parameters: parameter
        }
      );
      if (result) {
        return result.smartContractCrud.createSmartContract;
      }
      return;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Monetrum;
