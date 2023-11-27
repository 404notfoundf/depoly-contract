
export const getArgs = () => {
    let shouldDeploy = true
    let shouldMintTokens = true
    let shouldApproveTokens = true
    let shouldAddLiquid = true
    let shouldDeploySandwich = false
    let wethMint = '5'
    let daiMint = '5'
    let pairs = 1
    let wethMintAmountAdmin = 100
    let wethMintAmountUser = 5

    return {shouldDeploy, shouldMintTokens, shouldApproveTokens, shouldAddLiquid, shouldDeploySandwich, wethMint, daiMint}
}