import {CryptoAddressTagType} from './crypto-deposit-address.types';
import {EstimateNetworkFeeResult} from './fees.types';
import {NetworkObject} from './payments.types';
import {ActionTrigger, DateRangeInput, PagerSortDateRange} from './utils.types';

export enum PspSourceType {
    VAULT_ACCOUNT = 'VAULT_ACCOUNT',
    EXCHANGE_ACCOUNT = 'EXCHANGE_ACCOUNT',
    FIAT_ACCOUNT = 'FIAT_ACCOUNT',
    GAS_STATION = 'GAS_STATION',
    UNKNOWN = 'UNKNOWN',
}

export enum PspDestinationType {
    VAULT_ACCOUNT = 'VAULT_ACCOUNT',
    EXCHANGE_ACCOUNT = 'EXCHANGE_ACCOUNT',
    INTERNAL_WALLET = 'INTERNAL_WALLET',
    EXTERNAL_WALLET = 'EXTERNAL_WALLET',
    ONE_TIME_ADDRESS = 'ONE_TIME_ADDRESS',
    NETWORK_CONNECTION = 'NETWORK_CONNECTION',
    FIAT_ACCOUNT = 'FIAT_ACCOUNT',
    COMPOUND = 'COMPOUND',
    UNKNOWN = 'UNKNOWN',
}

export enum PspServiceStatus {
    FAILED = 'FAILED',
    BLOCKED = 'BLOCKED',
    CANCELLED = 'CANCELLED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING',
    CONFIRMING = 'CONFIRMING',
    COMPLETED = 'COMPLETED',
    PENDING_AML_SCREENING = 'PENDING_AML_SCREENING',
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
    //* Success
    approved_auto = 'approved_auto',
    approved_manual = 'approved_manual',
    //* Pending
    pending = 'pending',
    more_information_required = 'more_information_required',
    //* Rejected
    rejected_auto = 'rejected_auto',
    rejected_manual = 'rejected_manual',
    rejected_bsp = 'rejected_bsp',
}

export interface CreateExternalTransferArgs
    extends Pick<Transfer, 'amount' | 'currency_id' | 'notes' | 'direction' | 'counterparty_first_name' | 'counterparty_last_name'> {
    network: string;
    destination_address: string;
    network_speed: CryptoNetworkSpeed;
    destination_wallet?: string;
    address_tag_value?: string;
    address_tag_type?: CryptoAddressTagType;
    is_total_amount?: boolean;
    is_send_to_self?: boolean;
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

export interface ExternalTransferFormDetails {
    currency_id: string;
    network: string;
    address_tag_type?: CryptoAddressTagType;
    psp_service_id: string;
    networks: NetworkObject[];
    internal_fee_value: number;
    network_fees: EstimateNetworkFeeResult;
    min_amount: number;
}

export interface GetExternalTransferFormDetailsArgs {
    currency_id: string;
    network: string;
    address_tag_type?: CryptoAddressTagType;
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
export class ExternalTransferUpdateOriginatorTravelRuleDetails {
    transfer_id: string;
    originatorFirstName?: string;
    originatorLastName?: string;
    originatorVasp?: string;
    originatorGeographicAddress?: TravelRuleGeographicAddress;
}

export class ExternalTransferUpdateBeneficiaryTravelRuleDetails {
    transfer_id: string;
    beneficiaryFirstName?: string;
    beneficiaryLastName?: string;
    beneficiaryVasp?: string;
    beneficiaryGeographicAddress?: TravelRuleGeographicAddress;
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
psp_source_type
psp_source_id
psp_destination_type
psp_destination_id
tr_status
tr_requestReferenceNo
tr_withdrawalId
tr_requirments
tr_requirments_parsed{
    name
    value
}
tr_message
created_at
updated_at
`;

export interface GetTransfersArgs extends PagerSortDateRange {
    search?: string;
    filters?: GetTransfersFilter[];
}

export interface GetTotalCostTransfersArgs {
    date_range: DateRangeInput;
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

export class TravelRuleGeographicAddress {
    addressType: string;
    streetName: string;
    buildingNumber: string;
    buildingName: string;
    postcode: string;
    townName: string;
    countrySubDivision: string;
    country: string;
}

export class TravelRuleRequirements {
    name: string;
    value: string;
}

export interface Transfer {
    transfer_id: string;
    reference_nr: string;
    type: TransferType;
    scope: TransferScope;
    direction: TransferDirection;
    status: TransferStatusType;
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
    ex_body_amount: number;
    ex_fee_amount: number;
    //
    crypto_address_value?: string;
    crypto_address_tag_type?: CryptoAddressTagType;
    crypto_address_tag_value?: string;
    crypto_network?: string;
    crypto_network_label?: string;
    crypto_network_speed?: CryptoNetworkSpeed;
    //* Vasps
    crypto_address_wallet?: string;
    crypto_address_wallet_did?: string;
    crypto_address_wallet_id?: string;
    transaction_hash?: string;
    remote_txid?: string;
    confirmations?: number;
    //* Accounts transactions
    ex_transfer_txid?: string;
    ex_refund_txid?: string;
    //*
    ex_refund_body_amount?: number;
    ex_refund_fee_amount?: number;
    notes?: string;
    message?: string;
    error_message?: string;
    //* Admin approve fields - internal validation
    trigger_by?: string;
    trigger_reason?: string;
    trigger_ts?: string;
    //* Psp service
    psp_service_id?: string;
    psp_service_status?: PspServiceStatus;
    psp_service_message?: string;
    psp_service_error_message?: string;
    //* Admin approve fields - psp service
    psp_service_trigger_type?: ActionTrigger;
    psp_service_trigger_by?: string;
    psp_service_trigger_ts?: string;
    psp_service_trigger_reason?: string;
    psp_source_type?: PspSourceType;
    psp_source_id?: string;
    psp_destination_type?: PspDestinationType;
    psp_destination_id?: string;
    //* Travel rule
    tr_status?: TravelRuleStatus;
    tr_requestReferenceNo?: string;
    tr_withdrawalId?: string;
    tr_requirments?: string;
    tr_requirments_parsed?: TravelRuleRequirements[];
    tr_message?: string;
    //* Dates
    created_at: string;
    updated_at: string;
}
