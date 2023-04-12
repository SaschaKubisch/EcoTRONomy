module.exports = {
    networks: {
      development: {
        from: '045252E459B528F05D9B5E316D5D57CCE50E551E3C0DF167E1FBBA3C54525E8B5A24CCF2567263169C49AE513914E8581F226849629F4961C2AE3B2DCA3EA745A5', // Your local Tron address
        privateKey: 'B2A37364D85C03708EDA275FE2CF4EF48E77C354CAC5CDD43EE64B46C90803D6', // Your local Tron private key
        consume_user_resource_percent: 30,
        fee_limit: 100000000,
        host: '127.0.0.1', // Local Tron node
        port: 9090, // The port that your local Tron node is running on
        network_id: '*', // Match any network id
      },
    },
    compilers: {
        solc: {
          version: "0.5.4", // update to the version specified in the error message
        },
      },
  };
