import {CryptoAddressTagType} from '../crypto-deposit-address.types';
import {TransferType, TransferScope, TransferDirection, TransferStatusType, CryptoNetworkSpeed, PspServiceStatus} from '../transfers.types';
import {ActionTrigger} from '../utils.types';

export const transferString = `
type
scope
direction
status
user_id
transfer_id
reference_nr
counterparty_first_name
counterparty_last_name
currency_id
amount
fiat_amount
network_fee
internal_fee
crypto_address_value
crypto_address_tag_type
crypto_address_tag_value
crypto_network
crypto_network_speed
crypto_address_wallet
transaction_hash
ex_transfer_txid
ex_body_amount
ex_fee_amount
ex_refund_txid
ex_refund_body_amount
ex_refund_fee_amount
notes
message
error_message
psp_service_id
psp_service_status
psp_service_trigger
psp_service_message
psp_service_error_message
created_at
updated_at
`;

export interface Transfer {
    transfer_id: string;
    reference_nr: string;
    type: TransferType;
    scope: TransferScope;
    direction: TransferDirection;
    status: TransferStatusType;
    user_id: string;
    counterparty_first_name?: string;
    counterparty_last_name?: string;
    currency_id: string;
    amount: number;
    fiat_amount: number;
    network_fee: number;
    internal_fee: number;
    crypto_address_value?: string;
    crypto_address_tag_type?: CryptoAddressTagType;
    crypto_address_tag_value?: string;
    crypto_network?: string;
    crypto_network_speed?: CryptoNetworkSpeed;
    crypto_address_wallet?: string;
    transaction_hash?: string;
    ex_transfer_txid?: string;
    ex_body_amount?: number;
    ex_fee_amount?: number;
    ex_refund_txid?: string;
    ex_refund_body_amount?: number;
    ex_refund_fee_amount?: number;
    notes?: string;
    message?: string;
    error_message?: string;
    psp_service_id?: string;
    psp_service_status?: PspServiceStatus;
    psp_service_trigger?: ActionTrigger;
    psp_service_message?: string;
    psp_service_error_message?: string;
    created_at: string;
    updated_at: string;
}
