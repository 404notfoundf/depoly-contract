const env = {
    CHAIN_ID: parseInt(process.env.CHAIN_ID || ""),
    RPC_URL: process.env.RPC_URL || "",
    ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY || "",
    USER_PRIVATE_KEY: process.env.USER_PRIVATE_KEY || ""
}

export default env