export interface FeeEstimationItem {
    fee_per_byte?: number;
    gas_price?: number;
    network_fee?: number;
    base_fee?: number;
    priority_fee?: number;
}

export interface EstimateNetworkFeeResult {
    low: FeeEstimationItem;
    medium: FeeEstimationItem;
    high: FeeEstimationItem;
}

export class EstimateNetworkFeeArgs {
    currency_id: string;
    network?: string;
    psp_service_id?: string;
}

//                 low {
//                     fee_per_byte
//                     gas_price
//                     network_fee
//                     base_fee
//                     priority_fee
//                 }
//                 medium {
//                     fee_per_byte
//                     gas_price
//                     network_fee
//                     base_fee
//                     priority_fee
//                 }
//                 high {
//                     fee_per_byte
//                     gas_price
//                     network_fee
//                     base_fee
//                     priority_fee
//                 }
