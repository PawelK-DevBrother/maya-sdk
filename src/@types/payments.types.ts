import {CryptoAddressTagType} from './crypto-deposit-address.types';
import {PagerSort, ToggleSwitch} from './utils.types';

export interface NetworkObject {
    label: string;
    value: string;
    notes: string;
}

export interface PaymentRoute {
    payment_route_id: string;
    currency_id: string;
    psp_service_id: string;
    crypto_network?: string;
    crypto_address_tag_type?: CryptoAddressTagType;
    is_active: ToggleSwitch;
}
export const paymentRouteString = `
payment_route_id
currency_id
psp_service_id
crypto_network
crypto_address_tag_type
is_active
`;

export interface GetPaymentsRoutesArgs extends PagerSort {
    currency_id?: string;
    payment_route_id?: string;
    psp_service_id?: string;
    crypto_network?: string;
}

export interface PaymentRouteNetwork extends PaymentRoute {
    network: NetworkObject;
}

export interface Asset {
    symbol: string;
    price: number;
}

export interface CreatePaymentRouteArgs {
    currency_id: string;
    psp_service_id: string;
    crypto_network: string;
    crypto_address_tag_type?: CryptoAddressTagType;
    is_active: ToggleSwitch;
}

export interface UpdatePaymentRouteArgs extends Partial<CreatePaymentRouteArgs> {
    payment_route_id: string;
}

export interface DeletePaymentRouteArgs {
    payment_route_id: string;
}
