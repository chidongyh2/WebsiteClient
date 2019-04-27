import {MenuItemTranslation} from '../models/menu-item-translation.model';
import {MenuItemSelectViewModel} from './menu-item-select.viewmodel';

export class MenuItemDetailViewModel {
    id: number;
    menuId: string;
    subjectId: string;
    subjectType: number;
    icon: string;
    image: string;
    url: string;
    isActive: boolean;
    parentId?: number;
    order: number;
    concurrencyStamp: string;
    menuItemTranslations: MenuItemTranslation[];
    menuItemSelected: MenuItemSelectViewModel[];
}
