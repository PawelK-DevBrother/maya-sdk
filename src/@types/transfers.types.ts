import {CryptoAddressTagType} from './crypto-deposit-address.types';
import {NetworkObject} from './payments.types';
import {EstimateNetworkFeeResult} from './fees.types';
import {Transfer} from './transfers/transfer.model';

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

export class GetTransferArgs {
    transfer_id: string;
}
