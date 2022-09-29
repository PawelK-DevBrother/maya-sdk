import {EstimateNetworkFeeArgs, EstimateNetworkFeeResult} from './@types/fees.types';
import {GetPaymentsRoutesArgs, PaymentRoute} from './@types/payments.types';
// Tools
import {GraphQlCustomError} from './utils';
import {gql, GraphQLClient, Variables} from 'graphql-request';
// Types
import {HealthCheckResult} from './@types/utils.types';

export class Maya_SK {
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
        const {healthcheck} = await this.gql_request(query);
        return healthcheck;
    }

    async get_payments_routes(args?: GetPaymentsRoutesArgs): Promise<PaymentRoute[]> {
        const query = gql`
            query ($pager: PagerInput, $sort: SortInput) {
                payments_routes(pager: $pager, sort: $sort) {
                    payment_route_id
                    currency_id
                    psp_service_id
                    crypto_network
                    crypto_address_tag_type
                    is_active
                }
            }
        `;

        const {payments_routes} = await this.gql_request(query, args);
        return payments_routes;
    }

    async get_network_fees(args: EstimateNetworkFeeArgs): Promise<EstimateNetworkFeeResult> {
        const query = gql`
            mutation ($currency_id: String!, $network: String, $psp_service_id: String) {
                estimate_network_fee(currency_id: $currency_id, network: $network, psp_service_id: $psp_service_id) {
                    low {
                        fee_per_byte
                        gas_price
                        network_fee
                        base_fee
                        priority_fee
                    }
                    medium {
                        fee_per_byte
                        gas_price
                        network_fee
                        base_fee
                        priority_fee
                    }
                    high {
                        fee_per_byte
                        gas_price
                        network_fee
                        base_fee
                        priority_fee
                    }
                }
            }
        `;

        const {estimate_network_fee} = await this.gql_request(query, args);
        return estimate_network_fee;
    }
}

export * from './utils';
export * from './@types/fees.types';
export * from './@types/utils.types';
export * from './@types/payments.types';
export * from './@types/deposit.address.crypto.types';
