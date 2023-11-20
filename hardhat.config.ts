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
      accounts: ["287382dfcde5d17400ac3c575aef32807c7b0a5fe40524bda8139ed9bcebe6f6",
      "b378399337d883857e4d5ce84b0e8803c6e0380271464c71e1cd100d1511202b"
      ],
      gasPrice: 3000000
    }
  },
  mocha: {
    timeout: 20000
  }
};

export default config;