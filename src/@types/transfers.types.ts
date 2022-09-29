import {CryptoAddressTagType} from './crypto-deposit-address.types';
import {EstimateNetworkFeeResult} from './fees.types';
import {NetworkObject} from './payments.types';
import {ActionTrigger} from './utils.types';

export enum PspServiceStatus {
    failed = 'failed',
    pending = 'pending',
    success = 'success',
}

export enum CryptoNetworkSpeed {
    slow = 'slow',
    medium = 'medium',
    fast = 'fast',
}

export enum TransferScope {
    internal = 'internal',
    external = 'external',
}

export enum TransferDirection {
    cryptoToFiat = 'cryptoToFiat',
    fiatToCrypto = 'fiatToCrypto',
}

export enum TransferType {
    incoming = 'incoming',
    outgoing = 'outgoing',
}

export enum TransferStatusType {
    success = 'success',
    to_approve = 'to_approve',
    failed = 'failed',
    //
    approved_auto = 'approved_auto',
    approved_manual = 'approved_manual',
    rejected_auto = 'rejected_auto',
    rejected_manual = 'rejected_manual',
    rejected_bsp = 'rejected_bsp',
    pending = 'pending',
    more_information_required = 'more_information_required',
}

export interface CreateExternalTransferArgs
    extends Pick<Transfer, 'amount' | 'currency_id' | 'notes' | 'direction' | 'counterparty_first_name' | 'counterparty_last_name'> {
    network: string;
    destination_address: string;
    network_speed: CryptoNetworkSpeed;
    destination_wallet?: string;
    address_tag_value?: string;
    address_tag_type?: CryptoAddressTagType;
}

export interface ExternalEstimation
    extends Pick<
        Transfer,
        | 'currency_id'
        | 'direction'
        | 'amount'
        | 'fiat_amount'
        | 'ex_body_amount'
        | 'ex_fee_amount'
        | 'internal_fee'
        | 'network_fee'
        | 'psp_service_id'
    > {
    destination_address: string;
    price: number;
    network: string;
    address_tag_value?: string;
    address_tag_type?: CryptoAddressTagType;
    network_speed: CryptoNetworkSpeed;
}

export interface GetExternalTransferFormDetailsArgs {
    currency_id: string;
    network: string;
    address_tag_type?: CryptoAddressTagType;
}

export interface ExternalTransferFormDetails {
    currency_id: string;
    network: string;
    address_tag_type?: CryptoAddressTagType;
    psp_service_id: string;
    networks: NetworkObject[];
    internal_fee_value: number;
    network_fees: EstimateNetworkFeeResult;
}

export interface GetTransferResult {
    pager_total_rows: number;
    response_id: string;
    items: Transfer[];
}

export interface ProvideTransferMoreInfoArgs {
    transfer_id: string;
    destination_wallet: string;
    counterparty_first_name: string;
    counterparty_last_name: string;
}

export interface GetTransferArgs {
    transfer_id: string;
}

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
    ex_body_amount: number;
    ex_fee_amount: number;
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
