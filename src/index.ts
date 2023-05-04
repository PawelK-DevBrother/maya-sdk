import {
    OperationsLimits,
    operationsLimitsString,
    UserLimitGroup,
    UserLimitGroupString,
} from './@types/operations-limits.types';
import {FindSystemSettingsArgs, Setting, SettingString} from './@types/settings.types';
import {
    Asset,
    GetPaymentsRoutesArgs,
    PaymentRoute,
    PaymentRouteNetwork,
    CreatePaymentRouteArgs,
    UpdatePaymentRouteArgs,
    DeletePaymentRouteArgs,
    paymentRouteString,
    AddCurrencyNetworksArgs,
    NetworkObjectString,
    RemoveCurrencyNetworks,
    NetworkObject,
    VaspString,
    Vasp,
    VaspAlpha,
} from './@types/payments.types';
import {
    CreateExternalTransferArgs,
    ExternalEstimation,
    ExternalTransferFormDetails,
    ExternalTransferUpdateOriginatorTravelRuleDetails,
    ExternalTransferUpdateBeneficiaryTravelRuleDetails,
    GetExternalTransferFormDetailsArgs,
    GetTransferArgs,
    GetTransferResult,
    GetTransfersArgs,
    ProvideTransferMoreInfoArgs,
    UpdateTrStatusArgs,
    AdminApproveTransferArgs,
    ExternalTransferUpdateBeneficiaryTravelRuleDetails_2,
    ExternalTransferUpdateOriginatorTravelRuleDetails_2,
} from './@types/transfers.types';
// Tools
import {GraphQlCustomError} from './utils';
import {gql, GraphQLClient, Variables} from 'graphql-request';
// Types
import {HealthCheck, HealthCheckString, UserIdOptional, UserIdArgs, DateRange} from './@types/utils.types';
import {
    CreateCryptoDepositAddressArgs,
    CryptoDepositAddress,
    FindCryptoDepositAddressesArgs,
    CryptoDepositAddressString,
    DeleteCryptoDepositAddressArgs,
    UpdateCryptoDepositAddressArgs,
} from './@types/crypto-deposit-address.types';
import {
    Transfer,
    transferString,
    SendOTPArgs,
    GetTotalCostTransfersArgs,
    GetExternalTransferFormDetailsByRouteArgs,
} from './@types/transfers.types';
import {
    GetCurrenciesPropertiesArgs,
    CurrencyProperty,
    CurrencyPropertyString,
    NetworkFeesString,
    EstimateAmountsResult,
    EstimateNetworkFeeArgs,
} from './@types/fees.types';
import {CreateTransactionArgs, RevertAccountTransactionArgs} from './@types/accounts-transactions.types';
import {User, UserString} from './@types/user.types';

export type HeadersType = {[x: string]: string};

export class Maya_Sdk {
    private gql_client: GraphQLClient;
    private global_headers: {[x: string]: string} = {};

    //* Internal auth
    x_api_key = 'x-api-key';
    x_admin_sub = 'x-admin-sub';
    //* User info required
    x_user_id = 'x-user-id';
    //* User info optional
    x_username = 'x-username';
    x_user_mobile_nr = 'x-user-mobile-nr';
    //* Maya auth tokens
    x_connect_access_token = 'x-connect-access-token';
    x_open_platform_customer_access_token = 'x-open-platform-customer-access-token';

    constructor(endpoint: string) {
        this.gql_client = new GraphQLClient(endpoint);
    }

    setGlobalCustomHeader(header_name: string, value: any): void {
        this.global_headers[header_name] = value;
    }

    setGlobalAuthToken(token: string): void {
        this.global_headers['authorization'] = `Bearer ${token}`;
    }
    setGlobalApiKey(value: string): void {
        this.setGlobalCustomHeader(this.x_api_key, value);
    }

    setGlobalXUserId(value: any): void {
        this.setGlobalCustomHeader(this.x_user_id, value);
    }

    getGlobalHeaders() {
        return this.global_headers;
    }

    async gql_request(body: string | any, variables: Variables = undefined, headers?: HeadersType) {
        return this.gql_client.request(body, variables, {...this.global_headers, ...headers}).catch((e) => {
            try {
                const error_body = {
                    message: e.response.errors[0].message,
                    statusCode: e.response.status,
                    query: e.request.query,
                    variables: e.request.variables,
                };
                throw new GraphQlCustomError(error_body);
            } catch (error) {
                if (error instanceof GraphQlCustomError) throw error;
            }
            throw e;
        });
    }

    async healthcheck(headers?: HeadersType): Promise<HealthCheck> {
        const query = gql`
            query {
                healthcheck {
                    ${HealthCheckString}
                }
            }
        `;
        const result = await this.gql_request(query);
        return result.healthcheck;
    }

    async add_currency_networks(args: AddCurrencyNetworksArgs, headers?: HeadersType): Promise<NetworkObject[]> {
        const query = gql`
            mutation ($currency_id: String!, $networks: [NetworkObjectArgs!]!) {
                add_currency_networks(currency_id: $currency_id, networks: $networks) {
                    ${NetworkObjectString}
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.add_currency_networks;
    }

    async remove_currency_networks(args: RemoveCurrencyNetworks, headers?: HeadersType): Promise<NetworkObject[]> {
        const query = gql`
            mutation ($currency_id: String!, $values: [String!]!) {
                remove_currency_networks(currency_id: $currency_id, values: $values) {
                    ${NetworkObjectString}
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.remove_currency_networks;
    }

    async currencies_properties(
        args?: GetCurrenciesPropertiesArgs,
        headers?: HeadersType,
    ): Promise<CurrencyProperty[]> {
        const query = gql`
            query ($currency_id: String, $properties: [String!]) {
                currencies_properties(currency_id: $currency_id, properties: $properties) {
                    ${CurrencyPropertyString}
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.currencies_properties;
    }

    async getAsset(symbol: string, headers?: HeadersType): Promise<Asset> {
        const query = gql`
            query ($symbol: String!) {
                asset(symbol: $symbol) {
                    symbol
                    price(quote_asset_symbol: "PHP")
                    price_decimals
                    color
                    name
                }
            }
        `;
        const result = await this.gql_request(query, {symbol}, headers);
        return result.asset;
    }

    async system_settings(args?: FindSystemSettingsArgs, headers?: HeadersType): Promise<Setting[]> {
        const query = gql`
            query ($search: String, $pager: PagerInput, $sort: SortInput) {
                system_settings(search: $search, pager: $pager, sort: $sort) {
                    ${SettingString}
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.system_settings;
    }

    async payments_routes(args?: GetPaymentsRoutesArgs, headers?: HeadersType): Promise<PaymentRoute[]> {
        const query = gql`
            query (
                $currency_id: String
                $payment_route_id: String
                $psp_service_id: String
                $crypto_network: String
                $is_active: ToggleSwitch
                $pager: PagerInput
            ) {
                payments_routes(
                    currency_id: $currency_id
                    payment_route_id: $payment_route_id
                    psp_service_id: $psp_service_id
                    crypto_network: $crypto_network
                    is_active: $is_active
                    pager: $pager
                ) {
                    ${paymentRouteString}
                }
            }
        `;

        const result = await this.gql_request(query, args, headers);
        return result.payments_routes;
    }

    async payments_routes_with_networks(
        args?: GetPaymentsRoutesArgs,
        headers?: HeadersType,
    ): Promise<PaymentRouteNetwork[]> {
        const query = gql`
            query (
                $currency_id: String
                $payment_route_id: String
                $psp_service_id: String
                $crypto_network: String
                $is_active: ToggleSwitch
                $pager: PagerInput
            ) {
                payments_routes_networks(
                    currency_id: $currency_id
                    payment_route_id: $payment_route_id
                    psp_service_id: $psp_service_id
                    crypto_network: $crypto_network
                    is_active: $is_active
                    pager: $pager
                ) {
                    ${paymentRouteString}
                    network {
                        ${NetworkObjectString}
                    }
                }
            }
        `;

        const result = await this.gql_request(query, args, headers);
        return result.payments_routes_networks;
    }

    async create_crypto_deposit_address(
        args: CreateCryptoDepositAddressArgs,
        headers?: HeadersType,
    ): Promise<CryptoDepositAddress> {
        const query = gql`
            mutation ($currency_id: String!, $network: String!) {
                create_crypto_deposit_address(currency_id: $currency_id, network: $network) {
                    ${CryptoDepositAddressString}
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.create_crypto_deposit_address;
    }

    async update_crypto_deposit_address(args: UpdateCryptoDepositAddressArgs, headers?: HeadersType): Promise<boolean> {
        const query = gql`
            mutation ($crypto_deposit_address_id: String!, $address: String, $currency_id: String) {
                update_crypto_deposit_address(
                    crypto_deposit_address_id: $crypto_deposit_address_id
                    address: $address
                    currency_id: $currency_id
                )
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.update_crypto_deposit_address;
    }

    async crypto_deposit_addresses(
        args?: FindCryptoDepositAddressesArgs,
        headers?: HeadersType,
    ): Promise<CryptoDepositAddress[]> {
        const query = gql`
            query ($currency_id: String, $network: String, $pager: PagerInput) {
                crypto_deposit_addresses(currency_id: $currency_id, network: $network, pager: $pager) {
                    ${CryptoDepositAddressString}
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.crypto_deposit_addresses;
    }

    async delete_crypto_deposit_address(args: DeleteCryptoDepositAddressArgs, headers?: HeadersType): Promise<boolean> {
        const query = gql`
            mutation ($crypto_deposit_address_id: String!) {
                delete_crypto_deposit_address(crypto_deposit_address_id: $crypto_deposit_address_id)
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.delete_crypto_deposit_address;
    }

    async external_transfer_form_details_by_route(
        args: GetExternalTransferFormDetailsByRouteArgs,
        headers?: HeadersType,
    ): Promise<ExternalTransferFormDetails> {
        const query = gql`
            query ($payment_route_id: String!) {
                external_transfer_form_details_by_route(payment_route_id: $payment_route_id) {
                    currency_id
                    network
                    address_tag_type
                    psp_service_id
                    internal_fee_value
                    min_amount
                    threshold
                    networks {
                        ${NetworkObjectString}
                        label
                        value
                        notes
                    }
                    network_fees {
                        ${NetworkFeesString}
                    }
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.external_transfer_form_details_by_route;
    }

    async external_transfer_form_details(
        args: GetExternalTransferFormDetailsArgs,
        headers?: HeadersType,
    ): Promise<ExternalTransferFormDetails> {
        const query = gql`
            query ($currency_id: String!, $network: String!, $address_tag_type: CryptoAddressTagType) {
                external_transfer_form_details(currency_id: $currency_id, network: $network, address_tag_type: $address_tag_type) {
                    currency_id
                    network
                    address_tag_type
                    psp_service_id
                    internal_fee_value
                    min_amount
                    threshold
                    networks {
                        ${NetworkObjectString}
                        label
                        value
                        notes
                    }
                    network_fees {
                        ${NetworkFeesString}
                    }
                    wallet_options{
                        name
                        value
                    }
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.external_transfer_form_details;
    }

    async external_transfer_estimate_network_fee(
        args: EstimateNetworkFeeArgs,
        headers?: HeadersType,
    ): Promise<EstimateAmountsResult> {
        const query = gql`
            query(
                $amount: Float!
                $network: String!
                $currency_id: String!
                $destination_address: String
                $address_tag_value: String
                $address_tag_type: CryptoAddressTagType
                $is_total_amount: Boolean
                $force_clean: Boolean
            ) {
                external_transfer_estimate_network_fee(
                    amount: $amount
                    currency_id: $currency_id
                    network: $network
                    destination_address: $destination_address
                    address_tag_value: $address_tag_value
                    address_tag_type: $address_tag_type
                    is_total_amount: $is_total_amount
                    force_clean: $force_clean
                ) {
                    ${NetworkFeesString}
                    ex_fee_amount
                    ex_body_amount
                    network_fee
                    internal_fee
                    amount
                    fees_error
                    address_error
                    address_error_message
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.external_transfer_estimate_network_fee;
    }

    async estimate_validate_external_transfer(
        args: CreateExternalTransferArgs,
        headers?: HeadersType,
    ): Promise<ExternalEstimation> {
        const query = gql`
            mutation (
                $amount: Float!
                $currency_id: String!
                $network: String!
                $destination_address: String!
                $direction: TransferDirection!
                $network_speed: CryptoNetworkSpeed!
                $address_tag_value: String
                $address_tag_type: CryptoAddressTagType
                $notes: String
                $destination_wallet: String
                $counterparty_first_name: String
                $counterparty_last_name: String
                $is_total_amount: Boolean
                $is_send_to_self: Boolean
                $wallet_type: String
            ) {
                estimate_validate_external_transfer(
                    amount: $amount
                    currency_id: $currency_id
                    network: $network
                    direction: $direction
                    notes: $notes
                    counterparty_first_name: $counterparty_first_name
                    counterparty_last_name: $counterparty_last_name
                    destination_address: $destination_address
                    network_speed: $network_speed
                    destination_wallet: $destination_wallet
                    address_tag_value: $address_tag_value
                    address_tag_type: $address_tag_type
                    is_total_amount: $is_total_amount
                    is_send_to_self: $is_send_to_self
                    wallet_type: $wallet_type
                ) {
                    amount
                    currency_id
                    direction
                    amount
                    fiat_amount
                    ex_body_amount
                    ex_fee_amount
                    internal_fee
                    network_fee
                    psp_service_id
                    destination_address
                    price
                    network
                    address_tag_value
                    address_tag_type
                    network_speed
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.estimate_validate_external_transfer;
    }

    async create_external_transfer(args: CreateExternalTransferArgs, headers?: HeadersType): Promise<Transfer> {
        const query = gql`
            mutation (
                $amount: Float!
                $currency_id: String!
                $network: String!
                $destination_address: String!
                $direction: TransferDirection!
                $network_speed: CryptoNetworkSpeed!
                $address_tag_value: String
                $address_tag_type: CryptoAddressTagType
                $notes: String
                $destination_wallet: String
                $counterparty_first_name: String
                $counterparty_last_name: String
                $is_total_amount: Boolean
                $is_send_to_self: Boolean
                $wallet_type: String
            ) {
                create_external_transfer(
                    amount: $amount
                    currency_id: $currency_id
                    network: $network
                    direction: $direction
                    notes: $notes
                    counterparty_first_name: $counterparty_first_name
                    counterparty_last_name: $counterparty_last_name
                    destination_address: $destination_address
                    network_speed: $network_speed
                    destination_wallet: $destination_wallet
                    address_tag_value: $address_tag_value
                    address_tag_type: $address_tag_type
                    is_total_amount: $is_total_amount
                    is_send_to_self: $is_send_to_self
                    wallet_type: $wallet_type
                ) {
                    ${transferString}
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.create_external_transfer;
    }

    async provide_transfer_more_info(args: ProvideTransferMoreInfoArgs, headers?: HeadersType): Promise<boolean> {
        const query = gql`
            mutation (
                $transfer_id: String!
                $destination_wallet: String!
                $counterparty_first_name: String!
                $counterparty_last_name: String!
            ) {
                provide_transfer_more_info(
                    transfer_id: $transfer_id
                    counterparty_first_name: $counterparty_first_name
                    counterparty_last_name: $counterparty_last_name
                    destination_wallet: $destination_wallet
                )
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.provide_transfer_more_info;
    }

    async admin_approve_incoming_transfer(args: AdminApproveTransferArgs, headers?: HeadersType): Promise<boolean> {
        const query = gql`
            mutation ($transfer_id: String!, $reason: String!) {
                admin_approve_incoming_transfer(transfer_id: $transfer_id, reason: $reason)
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.admin_approve_incoming_transfer;
    }

    async admin_approve_outgoing_transfer(args: AdminApproveTransferArgs, headers?: HeadersType): Promise<boolean> {
        const query = gql`
            mutation ($transfer_id: String!, $reason: String!) {
                admin_approve_outgoing_transfer(transfer_id: $transfer_id, reason: $reason)
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.admin_approve_outgoing_transfer;
    }

    async transfer(args: GetTransferArgs, headers?: HeadersType): Promise<Transfer> {
        const query = gql`
            query ($transfer_id: String!) {
                transfer(transfer_id: $transfer_id){
                    ${transferString}
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.transfer;
    }

    async operations_limits(args?: UserIdArgs, headers?: HeadersType): Promise<OperationsLimits> {
        const query = gql`
            query{
                operations_limits{
                    ${operationsLimitsString}
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.operations_limits;
    }

    async create_payment_route(args: CreatePaymentRouteArgs, headers?: HeadersType): Promise<PaymentRoute> {
        const query = gql`
            mutation (
                $currency_id: String!
                $psp_service_id: String!
                $crypto_network: String!
                $crypto_address_tag_type: CryptoAddressTagType
                $is_active: ToggleSwitch!
            ) {
                create_payment_route(
                    currency_id: $currency_id
                    psp_service_id: $psp_service_id
                    crypto_network: $crypto_network
                    crypto_address_tag_type: $crypto_address_tag_type
                    is_active: $is_active
                ){
                    ${paymentRouteString}
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.create_payment_route;
    }

    async update_payment_route(args: UpdatePaymentRouteArgs, headers?: HeadersType): Promise<boolean> {
        const query = gql`
            mutation (
                $payment_route_id: String!
                $currency_id: String
                $psp_service_id: String
                $crypto_network: String
                $crypto_address_tag_type: CryptoAddressTagType
                $is_active: ToggleSwitch
            ) {
                update_payment_route(
                    payment_route_id: $payment_route_id
                    currency_id: $currency_id
                    psp_service_id: $psp_service_id
                    crypto_network: $crypto_network
                    crypto_address_tag_type: $crypto_address_tag_type
                    is_active: $is_active
                )
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.update_payment_route;
    }

    async delete_payment_route(args: DeletePaymentRouteArgs, headers?: HeadersType): Promise<boolean> {
        const query = gql`
            mutation ($payment_route_id: String!) {
                delete_payment_route(payment_route_id: $payment_route_id)
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.delete_payment_route;
    }

    async create_defualt_user_limit_group(headers?: HeadersType): Promise<UserLimitGroup> {
        const query = gql`
            mutation {
                create_default_user_limit_group{
                    ${UserLimitGroupString}
                }
            }
        `;
        const result = await this.gql_request(query, headers);
        return result.create_default_user_limit_group;
    }

    async user_limit_group(headers?: HeadersType): Promise<UserLimitGroup> {
        const query = gql`
        query{
            user_limit_group{
                ${UserLimitGroupString}
            }
        }`;
        const result = await this.gql_request(query, headers);
        return result.user_limit_group;
    }

    async delete_user_limit_group(headers?: HeadersType): Promise<boolean> {
        const query = gql`
            mutation {
                delete_user_limit_group
            }
        `;
        const result = await this.gql_request(query, headers);
        return result.delete_user_limit_group;
    }

    async create_account_transactions(args: CreateTransactionArgs, headers?: HeadersType): Promise<string> {
        const query = gql`
            mutation ($items: [CreateTransactionItem!]!) {
                createAccountTransactions(items: $items)
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.createAccountTransactions;
    }

    async revert_account_transaction(args: RevertAccountTransactionArgs, headers?: HeadersType): Promise<string> {
        const query = gql`
            mutation ($secretKey: String!, $parent_transaction_id: String!) {
                revertAccountTransaction(secretKey: $secretKey, parent_transaction_id: $parent_transaction_id)
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.revertAccountTransaction;
    }

    async user(headers?: HeadersType): Promise<User> {
        const query = gql`
            query {
                user{
                ${UserString}
                }
            }
        `;
        const result = await this.gql_request(query, undefined, headers);
        return result.user;
    }

    async destinations_wallets(headers?: HeadersType): Promise<Vasp[]> {
        const query = gql`
        query {
            destinations_wallets {
                ${VaspString}
            }
        }
        `;
        const result = await this.gql_request(query, undefined, headers);
        return result.destinations_wallets;
    }

    async destinations_wallets_alpha(headers?: HeadersType): Promise<VaspAlpha[]> {
        const query = gql`
            query {
                destinations_wallets {
                    did
                    name
                    featured
                }
            }
        `;
        const result = await this.gql_request(query, undefined, headers);
        return result.destinations_wallets;
    }

    async admin_transfers(args?: GetTransfersArgs, headers?: HeadersType): Promise<GetTransferResult> {
        const query = gql`
            query ($search: String, $filters: [GetTransfersFilter!], $pager: PagerInput, $sort: SortInput,$date_range: DateRangeInput) {
                admin_transfers(search: $search, filters:$filters, sort: $sort, date_range: $date_range, pager: $pager){
                    pager_total_rows
                    pager_has_next_page
                    response_id
                    items {
                        ${transferString}
                    }
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.admin_transfers;
    }

    async transfers(args?: GetTransfersArgs, headers?: HeadersType): Promise<GetTransferResult> {
        const query = gql`
            query ($search: String, $filters: [GetTransfersFilter!], $pager: PagerInput, $sort: SortInput,$date_range: DateRangeInput) {
                transfers(search: $search, filters:$filters, sort: $sort, date_range: $date_range, pager: $pager){
                    pager_total_rows
                    pager_has_next_page
                    response_id
                    items {
                        ${transferString}
                    }
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.transfers;
    }

    async total_cost_transfers(args: GetTotalCostTransfersArgs, headers?: HeadersType): Promise<Transfer[]> {
        const query = gql`
            query ($currency_id: String!, $date_range: DateRangeInput) {
                total_cost_transfers(currency_id: $currency_id,date_range: $date_range){
                    ${transferString}
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.total_cost_transfers;
    }

    async verify_outgoing_external_transfer_otp(args: SendOTPArgs, headers?: HeadersType): Promise<Transfer> {
        const query = gql`
            mutation ($code: String!, $transfer_id: String!) {
                verify_outgoing_external_transfer_otp(code: $code, transfer_id: $transfer_id){
                    ${transferString}
                }
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.verify_outgoing_external_transfer_otp;
    }

    async resend_transfer_otp(args: GetTransferArgs, headers?: HeadersType): Promise<boolean> {
        const query = gql`
            mutation ($transfer_id: String!) {
                resend_transfer_otp(transfer_id: $transfer_id)
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.resend_transfer_otp;
    }

    async update_transfer_tr_status(args: UpdateTrStatusArgs, headers?: HeadersType): Promise<boolean> {
        const query = gql`
            mutation (
                $status: TravelRuleStatus!
                $requestReferenceNo: String!
                $xTransactionId: String!
                $withdrawalId: String
                $timestamp: String!
                $requirements: [String!]!
                $requirementsV2: [AdditionalRequirementItemInput!]!
                $message: String!
            ) {
                update_transfer_tr_status(
                    status: $status
                    requestReferenceNo: $requestReferenceNo
                    xTransactionId: $xTransactionId
                    withdrawalId: $withdrawalId
                    timestamp: $timestamp
                    requirements: $requirements
                    requirementsV2: $requirementsV2
                    message: $message
                )
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.update_transfer_tr_status;
    }

    async external_transfer_update_orignator_travel_rule_details(
        args: ExternalTransferUpdateOriginatorTravelRuleDetails,
        headers?: HeadersType,
    ): Promise<boolean> {
        const query = gql`
            mutation (
                $transfer_id: String!
                $originatorFirstName: String
                $originatorLastName: String
                $originatorVasp: String
                $originatorGeographicAddress: TravelRuleGeographicAddress
                $is_send_to_self: Boolean
                $wallet_type: String
            ) {
                external_transfer_update_originator_travel_rule_details(
                    transfer_id: $transfer_id
                    originatorFirstName: $originatorFirstName
                    originatorLastName: $originatorLastName
                    originatorVasp: $originatorVasp
                    originatorGeographicAddress: $originatorGeographicAddress
                    is_send_to_self: $is_send_to_self
                    wallet_type: $wallet_type
                )
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.external_transfer_update_originator_travel_rule_details;
    }

    async external_transfer_update_orignator_travel_rule_details_2(
        args: ExternalTransferUpdateOriginatorTravelRuleDetails_2,
        headers?: HeadersType,
    ): Promise<boolean> {
        const query = gql`
            mutation (
                $transfer_id: String!
                $originatorFirstName: String
                $originatorMiddleName: String
                $originatorLastName: String
                $originatorCountry: String
                $originatorVasp: String
                $originatorGeographicAddress: TravelRuleGeographicAddress
                $is_send_to_self: Boolean
                $wallet_type: String
                $originatorBirthInfo: TrBirthInfo
                $originatorNationalId: TrNationalId
            ) {
                external_transfer_update_originator_travel_rule_details_2(
                    transfer_id: $transfer_id
                    originatorFirstName: $originatorFirstName
                    originatorMiddleName: $originatorMiddleName
                    originatorLastName: $originatorLastName
                    originatorCountry: $originatorCountry
                    originatorVasp: $originatorVasp
                    originatorGeographicAddress: $originatorGeographicAddress
                    is_send_to_self: $is_send_to_self
                    wallet_type: $wallet_type
                    originatorBirthInfo: $originatorBirthInfo
                    originatorNationalId: $originatorNationalId
                )
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.external_transfer_update_originator_travel_rule_details_2;
    }

    async external_transfer_update_beneficiary_travel_rule_details(
        args: ExternalTransferUpdateBeneficiaryTravelRuleDetails,
        headers?: HeadersType,
    ): Promise<boolean> {
        const query = gql`
            mutation (
                $transfer_id: String!
                $beneficiaryFirstName: String
                $beneficiaryLastName: String
                $beneficiaryVasp: String
                $beneficiaryGeographicAddress: TravelRuleGeographicAddress
                $is_send_to_self: Boolean
                $wallet_type: String
            ) {
                external_transfer_update_beneficiary_travel_rule_details(
                    transfer_id: $transfer_id
                    beneficiaryFirstName: $beneficiaryFirstName
                    beneficiaryLastName: $beneficiaryLastName
                    beneficiaryVasp: $beneficiaryVasp
                    beneficiaryGeographicAddress: $beneficiaryGeographicAddress
                    is_send_to_self: $is_send_to_self
                    wallet_type: $wallet_type
                )
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.external_transfer_update_beneficiary_travel_rule_details;
    }

    async external_transfer_update_beneficiary_travel_rule_details_2(
        args: ExternalTransferUpdateBeneficiaryTravelRuleDetails_2,
        headers?: HeadersType,
    ): Promise<boolean> {
        const query = gql`
            mutation (
                $transfer_id: String!
                $beneficiaryFirstName: String
                $beneficiaryMiddleName: String
                $beneficiaryLastName: String
                $beneficiaryCountry: String
                $beneficiaryVasp: String
                $beneficiaryGeographicAddress: TravelRuleGeographicAddress
                $is_send_to_self: Boolean
                $wallet_type: String
                $beneficiaryBirthInfo: TrBirthInfo
                $beneficiaryNationalId: TrNationalId
            ) {
                external_transfer_update_beneficiary_travel_rule_details_2(
                    transfer_id: $transfer_id
                    beneficiaryFirstName: $beneficiaryFirstName
                    beneficiaryMiddleName: $beneficiaryMiddleName
                    beneficiaryLastName: $beneficiaryLastName
                    beneficiaryCountry: $beneficiaryCountry
                    beneficiaryVasp: $beneficiaryVasp
                    beneficiaryGeographicAddress: $beneficiaryGeographicAddress
                    is_send_to_self: $is_send_to_self
                    wallet_type: $wallet_type
                    beneficiaryBirthInfo: $beneficiaryBirthInfo
                    beneficiaryNationalId: $beneficiaryNationalId
                )
            }
        `;
        const result = await this.gql_request(query, args, headers);
        return result.external_transfer_update_beneficiary_travel_rule_details_2;
    }
}

export * from './utils';
export * from './@types/fees.types';
export * from './@types/utils.types';
export * from './@types/payments.types';
export * from './@types/crypto-deposit-address.types';
export * from './@types/settings.types';
export * from './@types/transfers.types';
export * from './@types/operations-limits.types';
export * from './@types/user.types';
export * from './@types/accounts-transactions.types';
