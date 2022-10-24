import {CryptoAddressTagType} from './crypto-deposit-address.types';
import {EstimateNetworkFeeResult} from './fees.types';
import {NetworkObject} from './payments.types';
import {ActionTrigger, DateRangeInput, PagerSortDateRange} from './utils.types';

export enum PspServiceStatus {
    FAILED = 'FAILED',
    BLOCKED = 'BLOCKED',
    CANCELLED = 'CANCELLED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING',
    CONFIRMING = 'CONFIRMING',
    COMPLETED = 'COMPLETED',
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
    // isSendToSelf: boolean;
}

export interface ExternalEstimation
    extends Pick<
        Transfer,
        'currency_id' | 'direction' | 'amount' | 'fiat_amount' | 'ex_body_amount' | 'ex_fee_amount' | 'internal_fee' | 'network_fee' | 'psp_service_id'
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
export interface GetTransfersFilter {
    table?: string;
    field: string;
    value: string;
}

export interface SendOTPArgs {
    transfer_id: string;
    code: string;
}

export interface UpdateTrStatusArgs {
    status: TravelRuleStatus;
    requestReferenceNo: string;
    xTransactionId: string;
    withdrawalId?: string | null;
    timestamp: string;
    requirements: string[];
    message: string;
}

export enum TravelRuleStatus {
    PENDING_TRAVEL_RULE_CHECKING = 'PENDING_TRAVEL_RULE_CHECKING',
    PENDING_ADDITIONAL_DETAILS_REQUIRED = 'PENDING_ADDITIONAL_DETAILS_REQUIRED',
    PENDING_VALID_TRAVEL_RULE = 'PENDING_VALID_TRAVEL_RULE',
    PENDING_TRAVEL_RULE_STARTED = 'PENDING_TRAVEL_RULE_STARTED',
    PENDING_MFA_REQUIRED = 'PENDING_MFA_REQUIRED',
    PENDING_MFA_STARTED = 'PENDING_MFA_STARTED',
    PENDING_MFA_VERIFICATION_FAILED = 'PENDING_MFA_VERIFICATION_FAILED',
    PENDING_MFA_VERIFIED = 'PENDING_MFA_VERIFIED',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    TRANSACTION_ERROR = 'TRANSACTION_ERROR',
}

export const transferString = `
type
scope
direction
status
trigger_by
trigger_reason
trigger_ts
user_id
user_mobile_nr
transfer_id
reference_nr
counterparty_first_name
counterparty_last_name
currency_id
currency_name
amount
fiat_amount
network_fee
internal_fee
crypto_address_value
crypto_address_tag_type
crypto_address_tag_value
crypto_network
crypto_network_label
crypto_network_speed
crypto_address_wallet
crypto_address_wallet_did
crypto_address_wallet_id
transaction_hash
remote_txid
confirmations
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
psp_service_trigger_type
psp_service_trigger_by
psp_service_trigger_reason
psp_service_trigger_ts
psp_service_message
psp_service_error_message
tr_status
tr_requestReferenceNo
tr_withdrawalId
tr_requirments
tr_message
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
    trigger_by?: string;
    trigger_reason?: string;
    trigger_ts?: string;
    user_id: string;
    user_mobile_nr?: string;
    counterparty_first_name?: string;
    counterparty_last_name?: string;
    currency_id: string;
    currency_name: string;
    amount: number;
    fiat_amount: number;
    network_fee: number;
    internal_fee: number;
    crypto_address_value?: string;
    crypto_address_tag_type?: CryptoAddressTagType;
    crypto_address_tag_value?: string;
    crypto_network?: string;
    crypto_network_label?: string;
    crypto_network_speed?: CryptoNetworkSpeed;
    crypto_address_wallet?: string;
    crypto_address_wallet_did?: string;
    crypto_address_wallet_id?: string;
    transaction_hash?: string;
    remote_txid?: string;
    confirmations?: number;
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
    psp_service_trigger_type?: ActionTrigger;
    psp_service_trigger_by?: string;
    psp_service_trigger_reason?: string;
    psp_service_trigger_ts?: string;
    psp_service_message?: string;
    psp_service_error_message?: string;
    //* Travel rule
    tr_status?: TravelRuleStatus;
    tr_requestReferenceNo?: string;
    tr_withdrawalId?: string;
    tr_requirments?: string;
    tr_message?: string;
    //* Dates
    created_at: string;
    updated_at: string;
}

export interface GetTransfersArgs extends PagerSortDateRange {
    search?: string;
    filters?: GetTransfersFilter[];
}

export class BeneficiaryGeographicAddress {
    addressType: string;
    streetName: string;
    buildingNumber: string;
    buildingName: string;
    postcode: string;
    townName: string;
    countrySubDivision: string;
    country: string;
}

export class ExternalTransferProvideTravelRuleDetailsArgs {
    transfer_id: string;
    beneficiaryFirstName?: string;
    beneficiaryLastName?: string;
    beneficiaryVaspId?: string;
    beneficiaryVaspName?: string;
    beneficiaryGeographicAddress?: BeneficiaryGeographicAddress;
}
