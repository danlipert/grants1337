// import BigNumber from "bignumber.js";
const BigNumber = require("bignumber.js");
const Web3 = require("web3");
const ABIDecoder = require("abi-decoder");

BigNumber.config({  EXPONENTIAL_AT: 1000  });

const SubscriptionContract = artifacts.require("./Subscription.sol");

// Initialize ABI Decoder for deciphering log receipts
ABIDecoder.addABI(SubscriptionContract.abi);

contract("SubscriptionContract", async ACCOUNTS => {

    const OWNER = ACCOUNTS[0];
    const USER_1 = ACCOUNTS[1];
    const USER_2 = ACCOUNTS[2];

    const PERIOD = 2592000;
    const PAYMENT = 10;
    const GASPRICE = 1;
    const VERSION = 2;

    let instance;

    const DAI = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';

    const deploySubscriptionContract = async () => {
        instance =
            await SubscriptionContract.new(USER_1, DAI, PAYMENT, PERIOD, GASPRICE, VERSION, USER_1, { from: OWNER, gas: 40000000 });
    };

      it("should return correct requiredToAddress", async () => {
        await deploySubscriptionContract();
        assert.equal(JSON.stringify(await instance.requiredToAddress.call()).toLowerCase(), JSON.stringify(USER_1).toLowerCase());
      });

      it("should return correct requiredTokenAddress", async () => {
        assert.equal(JSON.stringify(await instance.requiredTokenAddress.call()).toLowerCase(), JSON.stringify(DAI));
      });

      it("should return correct requiredTokenAmount", async () => {
        assert.equal(await instance.requiredTokenAmount.call(), PAYMENT);
      });

      it("should return correct requiredPeriodSeconds", async () => {
        assert.equal(await instance.requiredPeriodSeconds.call(), PERIOD);
      });

      it("should return correct requiredGasPrice", async () => {
        assert.equal(await instance.requiredGasPrice.call(), GASPRICE);
      });

      it("should return correct Subscription Hash", async () => {
        // we use 'result' because the contract address is different each test, and result allow us to see if the subscriptionHash is reproduceable
        let result = await instance.getSubscriptionHash.call(USER_2, USER_1, DAI, PAYMENT, PERIOD, GASPRICE, 1)
        assert.equal(await instance.getSubscriptionHash.call(USER_2, USER_1, DAI, PAYMENT, PERIOD, GASPRICE, 1), result);
      });
});
