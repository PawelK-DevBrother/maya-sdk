import {NetworkObject} from './../dist/@types/payments.types.d';
import {GetOperationsLimits, OperationsLimits, operationsLimitsString} from './@types/operations-limits.types';
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
} from './@types/payments.types';
import {
    CreateExternalTransferArgs,
    ExternalEstimation,
    ExternalTransferFormDetails,
    GetExternalTransferFormDetailsArgs,
    GetTransferArgs,
    ProvideTransferMoreInfoArgs,
} from './@types/transfers.types';
// Tools
import {GraphQlCustomError} from './utils';
import {gql, GraphQLClient, Variables} from 'graphql-request';
// Types
import {HealthCheck, HealthCheckString} from './@types/utils.types';
import {
    CreateCryptoDepositAddressArgs,
    CryptoDepositAddress,
    FindCryptoDepositAddressesArgs,
    CryptoDepositAddressString,
    DeleteCryptoDepositAddressArgs,
    UpdateCryptoDepositAddressArgs,
} from './@types/crypto-deposit-address.types';
import {Transfer, transferString} from './@types/transfers.types';
import {GetCurrenciesPropertiesArgs, CurrencyProperty, CurrencyPropertyString, NetworkFeesString} from './@types/fees.types';

export class Maya_Sdk {
    private gql_client: GraphQLClient;
    private headers: {[x: string]: string} = {};

    constructor(endpoint: string) {
        this.gql_client = new GraphQLClient(endpoint);
    }

    setAuthToken(token: string): void {
        this.headers['authorization'] = `Bearer ${token}`;
    }
    setXUserId(value: any): void {
        this.headers['x-user-id'] = value;
    }
    setXUserLimitGroupId(value: any): void {
        this.headers['x-user-limit-group-id'] = value;
    }
    setCustomHeader(header_name: string, value: any): void {
        this.headers[header_name] = value;
    }
    getHeaders() {
        return this.headers;
    }

    private async gql_request(body: string, variables: Variables = undefined) {
        return this.gql_client.request(body, variables, this.headers).catch((e) => {
            try {
                console.log(e);
                const error_body = {
                    msg: e.response.errors[0].message,
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

    async healthcheck(): Promise<HealthCheck> {
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

    async add_currency_networks(args: AddCurrencyNetworksArgs): Promise<NetworkObject[]> {
        const query = gql`
            mutation ($currency_id: String!, $networks: [NetworkObjectArgs!]!) {
                add_currency_networks(currency_id: $currency_id, networks: $networks) {
                    ${NetworkObjectString}
                }
            }
        `;
        const result = await this.gql_request(query, args);
        return result.add_currency_networks;
    }

    async remove_currency_networks(args: RemoveCurrencyNetworks): Promise<NetworkObject[]> {
        const query = gql`
            mutation ($currency_id: String!, $labels: [String!]!) {
                remove_currency_networks(currency_id: $currency_id, labels: $labels) {
                    ${NetworkObjectString}
                }
            }
        `;
        const result = await this.gql_request(query, args);
        return result.remove_currency_networks;
    }

    async currencies_properties(args?: GetCurrenciesPropertiesArgs): Promise<CurrencyProperty[]> {
        const query = gql`
            query ($currency_id: String, $properties: [String!]) {
                currencies_properties(currency_id: $currency_id, properties: $properties) {
                    ${CurrencyPropertyString}
                }
            }
        `;
        const result = await this.gql_request(query, args);
        return result.currencies_properties;
    }

    async getAsset(symbol: string): Promise<Asset> {
        const query = gql`
            query ($symbol: String!) {
                asset(symbol: $symbol) {
                    symbol
                    price(quote_asset_symbol: "PHP")
                }
            }
        `;
        const result = await this.gql_request(query, {symbol});
        return result.asset;
    }

    async system_settings(args?: FindSystemSettingsArgs): Promise<Setting[]> {
        const query = gql`
            query ($search: String, $pager: PagerInput, $sort: SortInput) {
                system_settings(search: $search, pager: $pager, sort: $sort) {
                    ${SettingString}
                }
            }
        `;
        const result = await this.gql_request(query, args);
        return result.system_settings;
    }

    async payments_routes(args?: GetPaymentsRoutesArgs): Promise<PaymentRoute[]> {
        const query = gql`
            query ($currency_id: String, $pager: PagerInput) {
                payments_routes(currency_id: $currency_id, pager: $pager) {
                    ${paymentRouteString}
                }
            }
        `;

        const result = await this.gql_request(query, args);
        return result.payments_routes;
    }

    async payments_routes_with_networks(args?: GetPaymentsRoutesArgs): Promise<PaymentRouteNetwork[]> {
        const query = gql`
            query ($currency_id: String, $pager: PagerInput) {
                payments_routes_networks(currency_id: $currency_id, pager: $pager) {
                    ${paymentRouteString}
                    network {
                        ${NetworkObjectString}
                    }
                }
            }
        `;

        const result = await this.gql_request(query, args);
        return result.payments_routes_networks;
    }

    async create_crypto_deposit_address(args: CreateCryptoDepositAddressArgs): Promise<CryptoDepositAddress> {
        const query = gql`
            mutation ($currency_id: String!, $network: String!) {
                create_crypto_deposit_address(currency_id: $currency_id, network: $network) {
                    ${CryptoDepositAddressString}
                }
            }
        `;
        const result = await this.gql_request(query, args);
        return result.create_crypto_deposit_address;
    }

    async update_crypto_deposit_address(args: UpdateCryptoDepositAddressArgs): Promise<CryptoDepositAddress> {
        const query = gql`
            mutation ($crypto_deposit_address_id: String!, $address: String, $currency_id: String) {
                update_crypto_deposit_address(crypto_deposit_address_id: $crypto_deposit_address_id, address: $address, currency_id: $currency_id)
            }
        `;
        const result = await this.gql_request(query, args);
        return result.update_crypto_deposit_address;
    }

    async crypto_deposit_addresses(args?: FindCryptoDepositAddressesArgs): Promise<CryptoDepositAddress[]> {
        const query = gql`
            query ($currency_id: String, $network: String, $pager: PagerInput) {
                crypto_deposit_addresses(currency_id: $currency_id, network: $network, pager: $pager) {
                    ${CryptoDepositAddressString}
                }
            }
        `;
        const result = await this.gql_request(query, args);
        return result.crypto_deposit_addresses;
    }

    async delete_crypto_deposit_address(args: DeleteCryptoDepositAddressArgs): Promise<boolean> {
        const query = gql`
            mutation ($crypto_deposit_address_id: String!) {
                delete_crypto_deposit_address(crypto_deposit_address_id: $crypto_deposit_address_id)
            }
        `;
        const result = await this.gql_request(query, args);
        return result.delete_crypto_deposit_address;
    }

    async external_transfer_form_details(args: GetExternalTransferFormDetailsArgs): Promise<ExternalTransferFormDetails> {
        const query = gql`
            query ($currency_id: String!, $network: String!, $address_tag_type: CryptoAddressTagType) {
                external_transfer_form_details(currency_id: $currency_id, network: $network, address_tag_type: $address_tag_type) {
                    currency_id
                    network
                    address_tag_type
                    psp_service_id
                    internal_fee_value
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
        const result = await this.gql_request(query, args);
        return result.external_transfer_form_details;
    }

    async estimate_validate_external_transfer(args: CreateExternalTransferArgs): Promise<ExternalEstimation> {
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
        const result = await this.gql_request(query, args);
        return result.estimate_validate_external_transfer;
    }

    async create_external_transfer(args: CreateExternalTransferArgs): Promise<Transfer> {
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
                ) {
                    ${transferString}
                }
            }
        `;
        const result = await this.gql_request(query, args);
        return result.create_external_transfer;
    }

    async provide_transfer_more_info(args: ProvideTransferMoreInfoArgs): Promise<boolean> {
        const query = gql`
            mutation ($transfer_id: String!, $destination_wallet: String!, $counterparty_first_name: String!, $counterparty_last_name: String!) {
                provide_transfer_more_info(
                    transfer_id: $transfer_id
                    counterparty_first_name: $counterparty_first_name
                    counterparty_last_name: $counterparty_last_name
                    destination_wallet: $destination_wallet
                )
            }
        `;
        const result = await this.gql_request(query, args);
        return result.provide_transfer_more_info;
    }

    async admin_approve_incoming_transfer(args: GetTransferArgs): Promise<boolean> {
        const query = gql`
            mutation ($transfer_id: String!) {
                admin_approve_incoming_transfer(transfer_id: $transfer_id)
            }
        `;
        const result = await this.gql_request(query, args);
        return result.admin_approve_incoming_transfer;
    }

    async admin_approve_outgoing_transfer(args: GetTransferArgs): Promise<boolean> {
        const query = gql`
            mutation ($transfer_id: String!) {
                admin_approve_outgoing_transfer(transfer_id: $transfer_id)
            }
        `;
        const result = await this.gql_request(query, args);
        return result.admin_approve_outgoing_transfer;
    }

    async transfer(args: GetTransferArgs): Promise<Transfer> {
        const query = gql`
            query ($transfer_id: String!) {
                transfer(transfer_id: $transfer_id){
                    ${transferString}
                }
            }
        `;
        const result = await this.gql_request(query, args);
        return result.transfer;
    }

    async operations_limits(args: GetOperationsLimits): Promise<OperationsLimits> {
        const query = gql`
            query ($limit_group_id: String!) {
                operations_limits(limit_group_id: $limit_group_id){
                    ${operationsLimitsString}
                }
            }
        `;
        const result = await this.gql_request(query, args);
        return result.operations_limits;
    }

    async create_payment_route(args: CreatePaymentRouteArgs): Promise<PaymentRoute> {
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
        const result = await this.gql_request(query, args);
        return result.create_payment_route;
    }

    async update_payment_route(args: UpdatePaymentRouteArgs): Promise<boolean> {
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
        const result = await this.gql_request(query, args);
        return result.update_payment_route;
    }

    async delete_payment_route(args: DeletePaymentRouteArgs): Promise<boolean> {
        const query = gql`
            mutation ($payment_route_id: String!) {
                delete_payment_route(payment_route_id: $payment_route_id)
            }
        `;
        const result = await this.gql_request(query, args);
        return result.delete_payment_route;
    }

    // async transfers(): Promise<GetTransferResult> {
    //     const query = gql`
    //         query {
    //             transfers {
    //                 pager_total_rows
    //                 response_id
    //                 items {
    //                     ${transferString}
    //                 }
    //             }
    //         }
    //     `;
    //     const result = await this.gql_request(query);
    //     return result.transfers;
    // }
}

export * from './utils';
export * from './@types/fees.types';
export * from './@types/utils.types';
export * from './@types/payments.types';
export * from './@types/crypto-deposit-address.types';
export * from './@types/settings.types';
export * from './@types/transfers.types';
export * from './@types/transfers.types';
export * from './@types/operations-limits.types';
