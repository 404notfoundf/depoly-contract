import {Wallet} from "ethers";
import env from "./env";
import {ethers} from "hardhat";


export const getAdminWallet = () => new Wallet(env.ADMIN_PRIVATE_KEY)
export const getUserWallet = () => new Wallet(env.USER_PRIVATE_KEY)