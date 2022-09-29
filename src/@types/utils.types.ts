export interface HealthCheckResult {
    maintenance_message: string;
    maintenance_mode: boolean;
}

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}
export interface DateRangeInput {
    time_from?: string;
    time_to?: string;
}
interface PagerInput {
    limit?: number;
    offset?: number;
}
interface SortInput {
    direction: SortDirection;
}
export interface PagerSort {
    pager?: PagerInput;
    sort?: SortInput;
}
export interface PagerSortDateRange extends PagerSort {
    dateRange?: DateRangeInput;
}

export interface UserIdOptionalArgs {
    user_id?: string;
}

export enum ToggleSwitch {
    on = 'on',
    off = 'of',
}

export enum ActionTrigger {
    auto = 'auto',
    manual = 'manual',
}
