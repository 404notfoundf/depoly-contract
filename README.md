# depoly-contract
自动化部署Uniswap相关合约

#### 如何启动
注意修改hardhat.config.js配置文件,networks部分可以填写自己配置的网络,修改enviorment.sh文件配置（注:linux下可以执行脚本,windows下可以手动set设置）
```shell
cd depoly-contract
npm install
source enviorment.sh
npx hardhat compile
npx hardhat run scripts/deploy.ts --network private_network
```