export const DUMMY_SECRET_KEY = "••••••••••";
export const BLOCK_META_DATA_TABLE_NAME = 'BlockDataTable';
export const BLOCK_CPI_META_DATA_TABLE_NAME = 'BlockCPIDataTable'

export type OnLoadOption = 'None' | 'Show' | 'ShowMessages' | 'ShowNewMessages';
export type OnHideOption = 'Nothing' | 'NavigateBack';
export type LauncherVisibility = 'Visible' | 'Hidden';

export type ProfileFormMode = 'Add' | 'Edit';
export type DialogType = 'BeforeRemove' | 'BeforeDisableOnline';

export interface Profile {
    ProfileName: string,
    PageName: string
}
