export interface FeeEstimationItem {
    fee_per_byte?: number;
    gas_price?: number;
    network_fee?: number;
    base_fee?: number;
    priority_fee?: number;
    gas_limit?: number;
}

export interface EstimateNetworkFeeResult {
    low: FeeEstimationItem;
    medium: FeeEstimationItem;
    high: FeeEstimationItem;
}

export const NetworkFeesString = `
low {
    fee_per_byte
    gas_price
    gas_limit
    network_fee
    base_fee
    priority_fee
}
medium {
     fee_per_byte
     gas_price
     gas_limit
     network_fee
     base_fee
     priority_fee
}
high {
     fee_per_byte
     gas_price
     gas_limit
     network_fee
     base_fee
     priority_fee
}
`;

export interface EstimateNetworkFeeArgs {
    currency_id: string;
    network?: string;
    psp_service_id?: string;
    // address_tag_value?: string;
    // amount: number;
    // destination_address: string;
}

export interface GetCurrenciesPropertiesArgs {
    currency_id?: string;
    properties?: string[];
}

export interface CurrencyProperty {
    currency_id: string;
    name: string;
    value: string;
}

export const CurrencyPropertyString = `
currency_id
name
value
`;
