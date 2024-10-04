type Txn = {
    hash: string;
    blockNumber: string;
    timeStamp: string;
    feeInUSDT: number;
    feeInETH: number;
    eth_to_usdt_rate: number;
};

type Pagination = {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
};
