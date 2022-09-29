export interface HealthCheck {
    message: string;
    status: boolean;
}
export const HealthCheckString = `
message
status
`;

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}
export interface DateRangeInput {
    time_from?: string;
    time_to?: string;
}
export interface Pager {
    pager?: {
        limit?: number;
        offset?: number;
    };
}
export interface Sort {
    direction?: SortDirection;
}

export interface PagerSort extends Pager, Sort {}

export interface PagerSortDateRange extends PagerSort {
    dateRange?: DateRangeInput;
}

export interface UserIdOptional {
    user_id?: string;
}

export enum ToggleSwitch {
    on = 'on',
    off = 'off',
}

export enum ActionTrigger {
    auto = 'auto',
    manual = 'manual',
}
