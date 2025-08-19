export interface SidenavItem {
    label: string; 
    icon?: string; 
    link?: string;
    children?: SidenavItem[];
}
