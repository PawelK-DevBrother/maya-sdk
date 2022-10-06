export interface AccountTransaction {
    serial_id: string;
    account_transaction_id: string;
    parent_transaction_id: string;
    client_transaction_id: string;
    user_id: string;
    account_id: string;
    type: AccountTransactionType;
    amount: number;
    comment: string;
    created_at: string;
    updated_at: string;
    is_replicated?: number;
}

export enum AccountTransactionType {
    debit = 'debit',
    credit = 'credit',
}

export interface CreateTransactionArgs {
    items: CreateTransactionItem[];
}

export interface CreateTransactionItem {
    user_id: string;
    currency_id: string;
    type: AccountTransactionType;
    amount: number;
    client_transaction_id?: string;
    comment?: string;
}

export interface RevertAccountTransactionArgs {
    secretKey: string;
    parent_transaction_id: string;
}
