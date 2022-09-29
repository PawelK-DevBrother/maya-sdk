import {FindSystemSettingsArgs, SettingItem} from './@types/settings.types';
import {Asset, GetPaymentsRoutesArgs, PaymentRoute} from './@types/payments.types';
import {CreateExternalTransferArgs, ExternalEstimation, Transfer} from './@types/transfers.types';
// Tools
import {GraphQlCustomError} from './utils';
import {gql, GraphQLClient, Variables} from 'graphql-request';
// Types
import {HealthCheckResult} from './@types/utils.types';
import {CreateCryptoDepositAddressArgs, CryptoDepositAddress, FindCryptoDepositAddressesArgs} from './@types/crypto-deposit-address.types';

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

    async healthcheck(): Promise<HealthCheckResult> {
        const query = gql`
            query {
                healthcheck {
                    message
                    status
                }
            }
        `;
        const result = await this.gql_request(query);
        return result.healthcheck;
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

    async system_settings(args?: FindSystemSettingsArgs): Promise<SettingItem[]> {
        const query = gql`
            query ($search: String, $pager: PagerInput, $sort: SortInput) {
                system_settings(search: $search, pager: $pager, sort: $sort) {
                    name
                    value
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
                    payment_route_id
                    currency_id
                    psp_service_id
                    crypto_network
                    crypto_address_tag_type
                    is_active
                }
            }
        `;

        const result = await this.gql_request(query, args);
        return result.payments_routes;
    }

    async payments_routes_with_networks(args?: GetPaymentsRoutesArgs): Promise<PaymentRoute[]> {
        const query = gql`
            query ($currency_id: String, $pager: PagerInput) {
                payments_routes_networks(currency_id: $currency_id, pager: $pager) {
                    payment_route_id
                    currency_id
                    psp_service_id
                    crypto_network
                    crypto_address_tag_type
                    is_active
                    network {
                        label
                        value
                        notes
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
                    crypto_deposit_address_id
                    user_id
                    currency_id
                    address
                    network
                    address_tag_type
                    address_tag_value
                    # psp_message
                    created_at
                    updated_at
                }
            }
        `;
        const result = await this.gql_request(query, args);
        return result.create_crypto_deposit_address;
    }

    async crypto_deposit_addresses(args?: FindCryptoDepositAddressesArgs): Promise<CryptoDepositAddress[]> {
        const query = gql`
            query ($currency_id: String, $network: String, $pager: PagerInput) {
                crypto_deposit_addresses(currency_id: $currency_id, network: $network, pager: $pager) {
                    crypto_deposit_address_id
                    user_id
                    currency_id
                    address
                    network
                    address_tag_type
                    address_tag_value
                    # psp_message
                    created_at
                    updated_at
                }
            }
        `;
        const result = await this.gql_request(query, args);
        return result.crypto_deposit_addresses;
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
                    type
                    scope
                    direction
                    status
                    user_id
                    transfer_id
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
                    created_at
                    updated_at
                }
            }
        `;
        const result = await this.gql_request(query, args);
        return result.create_external_transfer;
    }
}

export * from './utils';
export * from './@types/fees.types';
export * from './@types/utils.types';
export * from './@types/payments.types';
export * from './@types/crypto-deposit-address.types';
export * from './@types/settings.types';
export * from './@types/transfers.types';
