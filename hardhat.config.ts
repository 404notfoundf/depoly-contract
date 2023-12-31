/** @type import('hardhat/config').HardhatUserConfig */
import "@nomicfoundation/hardhat-ethers"
import "@nomicfoundation/hardhat-toolbox"
import { HardhatUserConfig } from "hardhat/config";
const settings = {optimizer: {
    enabled: true,
    runs: 200
  }
}
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        // Weth
        version: "0.4.18",
        settings
      },
      {
        // Dai
        version: "0.5.12",
        settings
      },
      {
        // Sandwich
        version: "0.8.0",
        settings
      },
      {
        // UniswapFactory
        version: "0.5.16",
        settings
      },
      {
        // UniswapV2Router
        version:"0.6.6",
        settings
      }
    ],
    overrides: {
      "contracts/Weth.sol": {
        version: "0.4.18",
        settings
      },
      "contracts/Dai.sol": {
        version: "0.5.12",
        settings
      },
      "contracts/UniswapFactory.sol" : {
        version: "0.5.16",
        settings
      },
      "contracts/UniswapV2Router02.sol": {
        version: "0.6.6",
        settings
      },
      "contracts/Sandwich.sol": {
        version: "0.8.0",
        settings
      }
    }
  },
  networks: {
    private_network: {
      url: "http://18.162.116.194:8545",
      chainId: 32382,
      accounts: ["xxx",
      "xxx"
      ],
      gasPrice: 3000000
    }
  },
  mocha: {
    timeout: 20000
  }
};

export default config;