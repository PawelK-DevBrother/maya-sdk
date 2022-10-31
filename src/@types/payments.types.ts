import {CryptoAddressTagType} from './crypto-deposit-address.types';
import {PagerSort, ToggleSwitch} from './utils.types';

export interface NetworkObjectArgs {
    label: string;
    value: string;
    notes: string;
    heading: string;
    secondary: string;
}

export interface NetworkObject {
    label: string;
    value: string;
    notes: string;
    heading: string;
    secondary: string;
}
export const NetworkObjectString = `
label
value
notes
heading
secondary
`;

export interface AddCurrencyNetworksArgs {
    currency_id: string;
    networks: NetworkObjectArgs[];
}

export interface RemoveCurrencyNetworks {
    currency_id: string;
    values: string[];
}

export interface PaymentRoute {
    payment_route_id: string;
    currency_id: string;
    psp_service_id: string;
    crypto_network: string;
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
    is_active?: ToggleSwitch;
}

export interface PaymentRouteNetwork extends PaymentRoute {
    network: NetworkObject;
}

export interface Asset {
    symbol: string;
    price: number;
    price_decimals: number;
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

export interface Vasp {
    id: string;
    did: string;
    name: string;
    featured: boolean;
    website: string;
}
export const VaspString = `
id
did
name
featured
website
`;

export interface VaspAlpha {
    did: string;
    name: string;
    featured: boolean;
}
