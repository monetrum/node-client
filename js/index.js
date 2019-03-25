const graphQLClient = require("./graphQLClient");
const commands = require("./commands");
const functions = require("./functions");
const { createWallet, nonce, signing } = require("../helpers/ecdsa");
const message = require("../message/message");
const { persistWallet, getSqliteMaster } = require("../db/store");
const knex = require("../knex/knex.js");
var fs = require("fs");

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
      if (fs.statSync("db/monetrum.sqlite")) {
        if (result.length == 0) {
          console.log("result : " + result);
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
   * @description hdsjhgklsdh
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
   */

  async getTxList(params) {
    try {
      return await this.client.query(functions["getTxList"].query, params);
    } catch (error) {
      throw new Error(error);
    }
  }
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
 sonra dön
 */
  async getAssets(params) {
    try {
      this.checkConnection();
      return await this.client.query(functions["getAssets"].query, params);
    } catch (error) {
      throw new Error(error);
    }
  }

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
  /***
   * @description Monetrum Smart Contract yaratmak için kullanılır.
   */
  async create(params) {
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
      return await this.client.query(functions["create"].query, {
        parameter: parameter
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Monetrum;
