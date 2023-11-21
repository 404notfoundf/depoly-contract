import {ethers} from "hardhat";
// import {ethersa} from "ethers"
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";
import {Dai, UniswapV2Factory, UniswapV2Router02, WETH9} from "../typechain-types";
import {create} from "domain";
import {BigNumberish} from "ethers";

async function main(){
    const accounts = await ethers.getSigners();

    const {wethAddress, daiAddress, weth, dai} = await deployTokens(accounts[1].address, accounts[0])
    console.log("weth address", wethAddress)
    console.log("dai address", daiAddress)

    const {UniFactoryAddress, UFactory} = await deployUniswapFactory(accounts[0].address, wethAddress, daiAddress);
    console.log("Uniswap Factory Address-", UniFactoryAddress);

    const {UniRouterAddress, URouter} = await deployUniswapV2Router(UniFactoryAddress, wethAddress);
    console.log("Uniswap Router Address--", UniRouterAddress);

    await createPairs(accounts[0], wethAddress, daiAddress, weth, dai, UFactory, URouter, UniRouterAddress)
    const {SandWichAddress} = await deploySandwich(accounts[1].address);
    console.log("SandWichAddress --", SandWichAddress)
}

async function deployTokens(dst: string, user: HardhatEthersSigner) {
    // 部署 Weth和Dai 两种代币合约
    console.log("---- enter deploy tokens ----");
    let WethFactory = await ethers.getContractFactory('WETH9');
    let DaiFactory = await ethers.getContractFactory('Dai');
    let weth = await WethFactory.connect(user).deploy();
    let dai = await DaiFactory.connect(user).deploy(32382);
    let wethAddress = await weth.getAddress();
    let daiAddress = await dai.getAddress();

    // 向对应的地方发钱
    let amount = ethers.parseEther('5')
    await weth.connect(user).deposit({value: amount})
    let wethBalance = await weth.balanceOf(user.address)
    console.log("weth balance--", wethBalance.toString())
    await dai.mint(dst, amount)
    let daiBalance = await dai.connect(user).balanceOf(dst)
    console.log("dai balance--", daiBalance.toString())
    return {wethAddress, daiAddress, weth, dai}
}

async function deployUniswapFactory(account: string, tokenA :string, tokenB: string) {
    console.log("--- enter deploy Uniswap Factory-----")
    console.log("--address--", account)

    const U = await ethers.getContractFactory('UniswapV2Factory');
    const [UFactory] = await Promise.all(
        [
            U.deploy(account)
        ]
    )
    let UniFactoryAddress = await UFactory.getAddress();
    return {UniFactoryAddress, UFactory}
}

async function deployUniswapV2Router(UniFactoryAddress: string, wethAddress: string) {
    console.log("-- enter uniswapR2Router02 ----")
    console.log("weth--", wethAddress, "--factory--", UniFactoryAddress)
    const U = await ethers.getContractFactory('UniswapV2Router02');
    const [URouter] = await Promise.all(
        [U.deploy(UniFactoryAddress, wethAddress)]
    )
    let UniRouterAddress = await URouter.getAddress();
    return {UniRouterAddress, URouter}
}

async function createPairs(user: HardhatEthersSigner, wethAddress: string, daiAddress: string, weth: WETH9, dai: Dai, uniFactory: UniswapV2Factory, uniRouter: UniswapV2Router02, uniRouterAddress: string) {
    console.log("---- create pairs -----")
    // 创建交易对
    let wethAmount: BigNumberish = ethers.parseEther('1')
    let daiAmount: BigNumberish = ethers.parseEther('1')
    await uniFactory.createPair(wethAddress, daiAddress)
    await weth.connect(user).approve(uniRouterAddress, wethAmount)
    await dai.connect(user).approve(uniRouterAddress, daiAmount)
    // 调用增加流动性
    await addLiquidity(user.address, wethAmount, wethAddress, daiAmount, daiAddress, uniRouter)
}

async function addLiquidity(dst: string, wethAmount: BigNumberish, wethAddress: string, daiAmount: BigNumberish, daiAddress: string, uniRouter: UniswapV2Router02) {
    const deadline = Math.floor((new Date()).getTime() / 1000) + 60 * 60;
    console.log("deadline--", deadline)
    let a = ethers.parseEther('0');
    let tx = await uniRouter.addLiquidity(wethAddress, daiAddress, wethAmount, daiAmount, a, a, dst, deadline);
    console.log("tx from", tx.from)
}

async function deploySandwich(owner: string) {
    console.log("-- sanwich contract---")
    console.log("owner--", owner)
    const S = await ethers.getContractFactory('Sandwich');
    const [Swich] = await Promise.all(
        [S.deploy(owner)]
    );
    let SandWichAddress = await Swich.getAddress();
    return {SandWichAddress}
}

main().then(() => console.log("123")).catch(console.error);