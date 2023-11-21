# depoly-contract
自动化部署Uniswap相关合约

#### 如何启动
注意修改hardhat.config.js配置文件,networks部分可以填写自己配置的网络,accounts部分填入自己的私钥
```shell
cd depoly-contract
npm install 
npx hardhat compile
npx hardhat run scripts/deploy.ts --network private_network
```