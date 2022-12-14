export const operationsLimitsString = `
limit_group_id
buy_option
sell_option
send_option
receive_option
buy_limit
sell_limit
send_limit
receive_limit
`;

export enum OperationOption {
    disabled = 'disabled',
    enabled = 'enabled',
    unlimited = 'unlimited',
}

export interface OperationsLimits {
    limit_group_id: string;
    buy_option: OperationOption;
    sell_option: OperationOption;
    send_option: OperationOption;
    receive_option: OperationOption;
    buy_limit: number;
    sell_limit: number;
    send_limit: number;
    receive_limit: number;
}

export interface GetOperationsLimits {
    limit_group_id: string;
}

export interface UserLimitGroup {
    user_id: string;
    limit_group_id: string;
}

export const UserLimitGroupString = `
user_id
limit_group_id
`;
