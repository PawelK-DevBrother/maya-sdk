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
    crypto_address_tag_type?: string;
    is_active: ToggleSwitch;
}

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
