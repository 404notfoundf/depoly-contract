import UniV2Factory from "../contracts/contractBuild/UniV2Factory/UniV2Factory.json"
import Weth from "../contracts/contractBuild/Weth/Weth.json"
import Dai from "../contracts/contractBuild/Dai/Dai.json"
import UniV2Router from "../contracts/contractBuild/UniV2Router/UniV2Router.json"

export default {
    UniV2Factory: {
        abi: UniV2Factory.abi,
        bytecode: UniV2Factory.bytecode
    },
    WETH: {
        abi: Weth.abi,
        bytecode: Weth.bytecode
    },
    DAI: {
        abi: Dai.abi,
        bytecode: Dai.bytecode
    },
    UniV2Router: {
        abi: UniV2Router.abi,
        bytecode: UniV2Router.bytecode
    }
}