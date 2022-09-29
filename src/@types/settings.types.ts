import {PagerSort} from './utils.types';

export interface SettingItem {
    name: string;
    value: string;
}

export interface UpdateSystemSettingsArgs {
    items: SettingItem[];
}

export interface FindSystemSettingsArgs extends PagerSort {
    search?: string;
}
