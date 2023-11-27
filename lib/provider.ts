import {JsonRpcProvider} from "ethers";

import env from "./env"

export const Provider = new JsonRpcProvider(env.RPC_URL)
