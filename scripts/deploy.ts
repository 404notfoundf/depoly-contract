import {ethers} from "hardhat";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";
import {Dai, Dai__factory, UniswapV2Factory, UniswapV2Router02, WETH9} from "../typechain-types";
import {create} from "domain";
import {BigNumberish, Contract, Wallet} from "ethers";
import {Provider} from "../lib/provider";
import env from "../lib/env";
import {getAdminWallet, getUserWallet} from "../lib/wallet";
import {getArgs} from "../lib/args";
import readline from "readline-sync";

async function main(){
    // 获取
    try {
        await Provider.getBlockNumber()
    } catch (e) {
        console.log(`failed to connect to ${env.RPC_URL}`)
        process.exit(1)
    }
    const adminWallet = getAdminWallet().connect(Provider)

    let deployArgs = getArgs()

    let uniV2FactoryAddress: string = ""
    let wethFactoryAddress: string = ""
    let daiFactoryAddress: string = ""
    let uniV2RouterFactoryAddress: string = ""

    let uniV2Factory: UniswapV2Factory
    let wethFactory: WETH9
    let daiFactory: Dai
    let uniV2RouterFactory: UniswapV2Router02
    const DAI_MINT_AMOUNT = ethers.parseEther(deployArgs.daiMint)
    const WETH_MINT_AMOUNT = ethers.parseEther(deployArgs.wethMint)

    if (deployArgs.shouldDeploy) {
        let u = await createFactoryDeploy(adminWallet)
        console.log("univ2 factory address, ", u.address)
        uniV2FactoryAddress = u.address
        uniV2Factory = u.factory
        let initcodehash = await uniV2Factory.INIT_CODE_HASH.call(0);
        console.log("init code hash, ", initcodehash)
        readline.question("univ2Factory contract is deployed, press Enter to continue...")

        let w = await createWethDeploy(adminWallet)
        console.log("weth address, ", w.address)
        wethFactoryAddress = w.address
        wethFactory = w.factory
        readline.question("weth contract is deployed, press Enter to continue...")

        let d = await createDaiDeploy(adminWallet)
        console.log("dai address, ", d.address)
        daiFactoryAddress = d.address
        daiFactory = d.factory
        readline.question("dai contract is deployed, press Enter to continue...")

        let r = await createUniv2RouterDeploy(adminWallet, uniV2FactoryAddress, wethFactoryAddress)
        console.log("univ2 router address, ", r.address)
        readline.question("univ2Router02 contract is deployed, press Enter to continue...")
        uniV2RouterFactoryAddress = r.address
        uniV2RouterFactory = r.factory
    } else {
        //
    }
    if (deployArgs.shouldMintTokens) {
        console.log("5 admin nonce", await adminWallet.getNonce())
        // @ts-ignore
        let f1 = await wethFactory.connect(adminWallet).deposit({value: WETH_MINT_AMOUNT})
        await f1.wait()
        console.log("mint tx hash 1", f1.hash)
        readline.question("weth mint is success, press Enter to continue...")

        console.log("6 admin nonce", await adminWallet.getNonce())
        // @ts-ignore
        let f2 = await daiFactory.connect(adminWallet).mint(adminWallet.address, DAI_MINT_AMOUNT)
        await f1.wait()
        console.log("mint tx hash 2", f2.hash)
        readline.question("dai mint is success, press Enter to continue...")
    }

    if (deployArgs.shouldApproveTokens) {
        console.log("7 admin nonce", await adminWallet.getNonce())
        // @ts-ignore
        let m1 = await wethFactory.connect(adminWallet).approve(uniV2RouterFactoryAddress, WETH_MINT_AMOUNT)
        await m1.wait()
        console.log("approve tx hash 1", m1.hash)
        readline.question("weth approve is success, press Enter to continue...")

        console.log("8 admin nonce", await adminWallet.getNonce())
        // @ts-ignore
        let m2 = await daiFactory.connect(adminWallet).approve(uniV2RouterFactoryAddress, DAI_MINT_AMOUNT)
        await m2.wait()
        console.log("approve tx hash 2", m2.hash)
        readline.question("dai approve is success, press Enter to continue...")
    }

    if (deployArgs.shouldAddLiquid) {
        console.log("9 admin nonce", await adminWallet.getNonce())
        const deadline = Math.floor((new Date()).getTime() / 1000) + 60 * 60;

        // @ts-ignore
        let l1 = await uniV2RouterFactory.connect(adminWallet).addLiquidity(
            wethFactoryAddress, daiFactoryAddress, WETH_MINT_AMOUNT, DAI_MINT_AMOUNT, 0, 0, adminWallet.address, deadline
        )
        await l1.wait()
        console.log("add liquid tx hash, ", l1.hash)
        readline.question("add liquid is success, press Enter to continue...")
    }

    if (deployArgs.shouldDeploySandwich) {
        let userWallet = getUserWallet().connect(Provider)
        let s1 = await createSandwichDeploy(adminWallet, userWallet.address)
        console.log("sanwich address, ", s1.address)
    }
}

async function createFactoryDeploy(wallet: Wallet)  {
    console.log("1 admin nonce", await wallet.getNonce())
    let getContractFactory = await ethers.getContractFactory('UniswapV2Factory');
    let factory = await getContractFactory.connect(wallet).deploy(wallet.address)
    let address = await factory.getAddress();
    return {address, factory}
}

async function createWethDeploy(wallet: Wallet) {
    console.log("2 admin nonce", await wallet.getNonce())
    let getContractFactory = await ethers.getContractFactory('WETH9');
    let factory = await getContractFactory.connect(wallet).deploy()
    await factory.waitForDeployment()
    let address = await factory.getAddress();
    return {address, factory}
}

async function createDaiDeploy(wallet: Wallet) {
    console.log("3 admin nonce",await wallet.getNonce())
    let getContractFactory = await ethers.getContractFactory('Dai');
    let factory = await getContractFactory.connect(wallet).deploy(Provider._network.chainId)
    let address = await factory.getAddress();
    return {address,factory}
}

async function createUniv2RouterDeploy(wallet: Wallet, factoryAddress: string, wethAddress: string) {
    console.log("4 admin nonce",await wallet.getNonce())
    const getContractFactory = await ethers.getContractFactory('UniswapV2Router02')
    let factory = await getContractFactory.connect(wallet).deploy(factoryAddress, wethAddress)
    let address = await factory.getAddress();
    return {address, factory}
}


async function createSandwichDeploy(wallet: Wallet, owner: string) {
    console.log("10 admin nonce", await wallet.getNonce())
    let getContractFactory = await ethers.getContractFactory('Sandwich')
    let factory = await getContractFactory.connect(wallet).deploy(owner)
    let address = await factory.getAddress()
    return {address, factory}
}


main();