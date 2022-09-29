import {PagerSort, ToggleSwitch} from './utils.types';

export interface PaymentRoute {
    payment_route_id: string;
    currency_id: string;
    psp_service_id: string;
    crypto_network?: string;
    crypto_address_tag_type?: string;
    is_active: ToggleSwitch;
}

export interface GetPaymentsRoutesArgs extends PagerSort {
    payment_route_id?: string;
    currency_id?: string;
    psp_service_id?: string;
    crypto_network?: string;
}
