import {Pager, UserIdOptional} from './utils.types';

export enum CryptoAddressTagType {
    destination_tag = 'destination_tag',
    memo_id = 'memo_id',
    note = 'note',
    tag = 'tag',
}

export interface CryptoDepositAddress {
    crypto_deposit_address_id: string;
    user_id: string;
    currency_id: string;
    address?: string;
    network: string;
    address_tag_type?: CryptoAddressTagType;
    address_tag_value?: string;
    psp_message?: string;
    created_at: string;
    updated_at: string;
}
export const CryptoDepositAddressString = `
crypto_deposit_address_id
user_id
currency_id
address
network
address_tag_type
address_tag_value
psp_message
created_at
updated_at
`;

export interface CreateCryptoDepositAddressArgs extends Pick<CryptoDepositAddress, 'currency_id' | 'network'> {}

export interface FindCryptoDepositAddressesArgs extends Pick<CryptoDepositAddress, 'currency_id' | 'network'>, Pager, UserIdOptional {}

export interface DeleteCryptoDepositAddressArgs {
    crypto_deposit_address_id: string;
}

export interface UpdateCryptoDepositAddressArgs {
    crypto_deposit_address_id: string;
    currency_id?: string;
    address?: string;
    network?: string;
    address_tag_type?: string;
    address_tag_value?: string;
}
