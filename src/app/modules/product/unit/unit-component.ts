import {AfterViewInit, Component, enableProdMode, Inject, OnInit, ViewChild} from '@angular/core';
import {UnitSearchViewModel} from './view-model/unit-search.viewmodel';
import {UtilService} from '../../../shareds/services/util.service';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {Location} from '@angular/common';
import {finalize} from 'rxjs/operators';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {HelperService} from '../../../shareds/services/helper.service';
import {UnitService} from './service/unit.service';
import {UnitFormComponent} from './form/unit-form.component';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {BaseListComponent} from '../../../base-list.component';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {FilterLink} from '../../../shareds/models/filter-link.model';

// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }

@Component({
    selector: 'app-product-unit',
    templateUrl: './unit.component.html',
    providers: [HelperService]
})

export class UnitComponent extends BaseListComponent<UnitSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild('confirmDeleteUnit', {static: true}) swalConfirmDelete: SwalComponent;
    @ViewChild(UnitFormComponent, {static: true}) unitFormComponent: UnitFormComponent;
    isActive;
    address;
    listUnit: UnitSearchViewModel[];
    unitId: string;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private unitService: UnitService,
                private helperService: HelperService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.WAREHOUSE, this.pageId.UNIT, 'Quản lý đơn vị', 'Quản lý sản phẩm');
        this.subscribers.data = this.route.data.subscribe((result: { data: SearchResultViewModel<UnitSearchViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            this.listUnit = data.items;
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.isActive = params.isActive !== null && params.isActive !== '' && params.isActive !== undefined
                ? Boolean(params.isActive) : '';
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete(this.unitId);
        });
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.unitService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((data: SearchResultViewModel<UnitSearchViewModel>) => {
                this.totalRows = data.totalRows;
                this.listUnit = data.items;
            });
    }

    onPageClick(page: number) {
        this.currentPage = page;
        this.search(1);
    }

    selectIsActive(value) {
        if (value) {
            this.isActive = value.id;
        } else {
            this.isActive = null;
        }

        this.search(1);
    }

    resetFormSearch() {
        this.keyword = '';
        this.address = '';
        this.isActive = null;
        this.search(1);
    }

    add() {
        this.unitFormComponent.add();
    }

    edit(unit: UnitSearchViewModel) {
        this.unitFormComponent.edit(unit.id);
    }

    delete(id: string) {
        this.unitService.delete(id)
            .subscribe(() => {
                this.search(1);
                // _.remove(this.listUnit, (item: UnitSearchViewModel) => {
                //     return item.id === id;
                // });
            });
    }

    confirm(value: UnitSearchViewModel) {
        this.unitId = value.id;
    }

    updateStatus(item: UnitSearchViewModel) {
        this.unitService.updateStatus(item.id, !item.isActive).subscribe((result: ActionResultViewModel) => {
            item.isActive = !item.isActive;
        });
    }

    changePageSize(value) {
        this.pageSize = value;
        this.search(1);
    }

    clickContextMenu(e) {
        if (e.row.rowType === 'data' && (this.permission.delete || this.permission.edit)) {
            const data = e.row.data;
            e.items = [
                {
                    text: 'Sửa',
                    icon: 'edit',
                    disabled: !this.permission.edit,
                    onItemClick: () => {
                        this.edit(data);
                    }
                }, {
                    text: 'Xóa',
                    icon: 'remove',
                    disabled: !this.permission.delete,
                    onItemClick: () => {
                        this.confirm(data);
                    }
                }];
        }
    }

    private renderFilterLink() {
        const path = 'products/units';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('address', this.address),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
