const monetrumQueries = {};

monetrumQueries.getBalance = {
  query: `
    query($address: String!, $assets: [String!]) {
      wallet {
        getBalanceByWallet(address: $address, assets: $assets) {
          asset
          balance
        }
      }
    }
  `,
  type: 1
};

monetrumQueries.getBalancesByAccount = {
  query: `
    query($account_id: ObjectID!, $assets: [String!], $cursor: String) {
      wallet {
        getBalancesByAccount(
          account_id: $account_id
          assets: $assets
          cursor: $cursor
        ) {
          wallets {
            address
            balances {
              asset
              balance
            }
          }
          count
          next_cursor
        }
      }
    }
  `,
  type: 1
};

monetrumQueries.getWallets = {
  query: `
    query($account_id: ObjectID!, $cursor: String) {
      wallet {
        getWallets(account_id: $account_id, cursor: $cursor) {
          wallets {
            address
            balances {
              asset
              balance
            }
          }
          count
          next_cursor
        }
      }
    }
  `,
  type: 1
};

monetrumQueries.getWallet = {
  query: `
    query($public_key: String!) {
      wallet {
        getWallet(public_key: $public_key) {
          public_key
          contract_id
          asset
          address
          wallet_data
        }
      }
    }
  `,
  type: 1
};

monetrumQueries.getWalletInfo = {
  query: `
    query($private_key: String!) {
      wallet {
        getWalletInfo(private_key: $private_key) {
          public_key
          private_key
          address
        }
      }
    }
  `,
  type: 1
};

monetrumQueries.getTxList = {
  query: `
    query(
      $filters: TxListFilters!
      $sorting: TxSorting!
      $cursor: String
      $limit: Int
    ) {
      tx {
        getTxList(
          filters: $filters
          sorting: $sorting
          cursor: $cursor
          limit: $limit
        ) {
          transactions {
            _id
            action_time
            asset
            complete_time
            hash
            nonce
            prev_hash
            seq
            type
            from
            fee_from
            fee_asset
            to
            amount
            desc
            contract_id
            confirm_rate
            data
            forms
          }
          count
          next_cursor
        }
      }
    }
  `,
  type: 1
};

monetrumQueries.getTx = {
  query: `
    query($filters: TxFilters!) {
      tx {
        getTx(filters: $filters) {
          _id
          action_time
          asset
          complete_time
          hash
          nonce
          prev_hash
          seq
          type
          from
          fee_from
          fee_asset
          to
          amount
          desc
          contract_id
          confirm_rate
          data
          forms
        }
      }
    }
  `,
  type: 1
};

monetrumQueries.update = {
  query: `
    mutation($public_key: String!, $contract_id: ObjectID, $wallet_data: JSON) {
      wallet {
        update(
          public_key: $public_key
          contract_id: $contract_id
          wallet_data: $wallet_data
        ) {
          public_key
          contract_id
          asset
          address
          wallet_data
        }
      }
    }
  `,
  type: 1
};

monetrumQueries.save = {
  query: `
    mutation(
      $account_id: ObjectID
      $contract_id: ObjectID
      $public_key: String!
      $address: String!
      $wallet_data: JSON
    ) {
      wallet {
        save(
          account_id: $account_id
          contract_id: $contract_id
          public_key: $public_key
          address: $address
          wallet_data: $wallet_data
        ) {
          account_id
          contract_id
          address
          public_key
          wallet_data
        }
      }
    }
  `,
  type: 1
};

monetrumQueries.send = {
  query: `
    mutation(
      $keys: SendKeysInput!
      $from: String!
      $to: String!
      $amount: Float!
      $asset: String!
      $nonce: String!
      $fee_amount: Float
      $fee_from: String
      $desc: String
      $data: JSON
      $forms: JSON
    ) {
      tx {
        send(
          parameters: {
            keys: $keys            
            from: $from
            to: $to
            amount: $amount
            asset: $asset
            nonce: $nonce
            fee_amount: $fee_amount
            fee_from: $fee_from
            desc: $desc
            data: $data
            forms: $forms
          }
        ) {
          _id
          action_time
          amount
          asset
          confirm_rate
          desc
          data
          fee
          fee_asset
          fee_from
          hash
          nonce
          prev_hash
          seq          
          type
          from
          to
          sign
          complete_time
          forms
        }
      }
    }
  `,
  type: 2
};

monetrumQueries.deleteTxData = {
  query: `
    mutation($hash: String!, $public_key: String!) {
      tx {
        deleteTxData(hash: $hash, public_key: $public_key)
      }
    }
  `,
  type: 2
};

monetrumQueries.getAssets = {
  query: `
    query(
      $filters: GetAssetsFilters!
      $sorting: GetAssetsSorting!
      $cursor: String
    ) {
      assets {
        getAssets(filters: $filters, sorting: $sorting, cursor: $cursor) {
          assets {
            _id
            owner
            genesis_wallet
            genesis_block
            name
            symbol
            supply
            contract_id
            date
            icon
          }
          count
          next_cursor
        }
      }
    }
  `,
  type: 1
};

monetrumQueries.getAsset = {
  query: `
    query($filters: GetAssetFilters!) {
      assets {
        getAsset(filters: $filters) {
          _id
          owner
          genesis_wallet
          genesis_block
          name
          symbol
          supply
          contract_id
          date
          icon
        }
      }
    }
  `,
  type: 1
};

monetrumQueries.getContract = {
  query: `
    query($account_id: ObjectID, $contract_id: ObjectID!) {
      smartContractCrud {
        getContract(contract_id: $contract_id, account_id: $account_id) {
          _id
          account_id
          name
          code
          desc
          detail
          image
          created_date
          updated_date
        }
      }
    }
  `,
  type: 1
};
monetrumQueries.getContractByAddress = {
  query: `
    query($address: String!) {
      smartContractCrud {
        getContractByAddress(address: $address) {
          _id
          account_id
          name
          code
          desc
          detail
          image
          created_date
          updated_date
        }
      }
    }
  `,
  type: 1
};

monetrumQueries.getContracts = {
  query: `
    query(
      $filters: GetContractsFilter
      $sorting: GetContractsSorting!
      $cursor: String
    ) {
      smartContractCrud {
        getContracts(
          filters: $filters
          sorting: $sorting
          cursor: $cursor
        ) {
          contracts {
            _id
            account_id
            name
            code
            desc
            detail
            image
            created_date
            updated_date
          }
          count
          next_cursor
        }
      }
    }
  `,
  type: 1
};
monetrumQueries.createSmartContract = {
  query: `
    mutation(
      $account_id: ObjectID
      $name: String
      $code: String!
      $desc: String
      $detail: String
      $image: String
    ) {
      smartContractCrud {
        create(
          parameters: {
            account_id: $account_id
            name: $name
            code: $code
            desc: $desc
            detail: $detail
            image: $image
          }
        ) {
          _id
          account_id
          name
          code
          detail
          desc
          image
          created_date
          updated_date
        }
      }
    }
  `,
  type: 1
};

module.exports = monetrumQueries;
