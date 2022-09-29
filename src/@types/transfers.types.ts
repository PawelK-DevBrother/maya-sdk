import {ActionTrigger} from './utils.types';
import {CryptoAddressTagType} from './deposit.address.crypto.types';

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
