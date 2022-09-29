import {PagerSort} from './utils.types';

export interface Setting {
    name: string;
    value: string;
}
export const SettingString = `
name
value
`;

export interface UpdateSystemSettingsArgs {
    items: Setting[];
}

export interface FindSystemSettingsArgs extends PagerSort {
    search?: string;
}
