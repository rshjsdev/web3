export interface TransactionResponse {
    hash: string
    from: string
    to: string
    value: string
    txreceipt_status: string
    isError: string
}

export interface Transaction {
    hash: string
    to: string
    value: string
    status: 'pending' | 'success' | 'fail'
}