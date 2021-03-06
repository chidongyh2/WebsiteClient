import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ProductAttributeViewModel } from './product-attribute.viewmodel';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map } from 'rxjs/operators';
import { ProductAttributeService } from './product-attribute.service';
import { ToastrService } from 'ngx-toastr';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {BaseListComponent} from '../../../base-list.component';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {NhSelect} from '../../../shareds/components/nh-select/nh-select.component';

@Component({
    selector: 'app-product-attribute',
    templateUrl: './product-attribute.component.html'
})
export class ProductAttributeComponent extends BaseListComponent<ProductAttributeViewModel> implements OnInit, AfterViewInit {
    @ViewChild('confirmDelete') swalConfirmDelete: SwalComponent;
    isSelfContent: boolean;
    isRequire: boolean;
    isActive: boolean;
    productAttributeValue: string;

    constructor(
        @Inject(PAGE_ID) public pageId: IPageId,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private productAttributeService: ProductAttributeService) {
        super();

        this.subscribers.routeData = this.route.data.subscribe((result: { data: SearchResultViewModel<ProductAttributeViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            this.listItems = data.items;
        });
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.PRODUCT, this.pageId.PRODUCT_ATTRIBUTE, 'Quản lý sản phẩm', 'Thuộc tính sản phẩm');
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete(this.productAttributeValue);
        });
    }

    onActiveStatusSelected(event: NhSelect) {
        if (event) {
            this.isActive = event.id;
        } else {
            this.isActive = null;
        }
        this.search(1);
    }

    refresh() {
        this.keyword = '';
        this.isSelfContent = null;
        this.isActive = null;
        this.isRequire = null;
        this.search(1);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.subscribers.searchProductAttributes = this.productAttributeService
            .search(this.keyword, this.isSelfContent, this.isRequire, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<ProductAttributeViewModel>) => {
                this.totalRows = result.totalRows;
                this.listItems = result.items;
            });
    }

    detail(productAttribute: ProductAttributeViewModel) {
        this.router.navigateByUrl(`/products/attributes/${productAttribute.id}`);
    }

    edit(productAttribute: ProductAttributeViewModel) {
        this.router.navigateByUrl(`/products/attributes/edit/${productAttribute.id}`);
    }

    confirm(productAttribute: ProductAttributeViewModel) {
        this.productAttributeValue = productAttribute.id;
        this.swalConfirmDelete.show();
    }

    delete(id: string) {
        this.subscribers.delete = this.productAttributeService.delete(id)
            .subscribe((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                this.search(this.currentPage);
            });
    }

    changeSelfContent(attribute: ProductAttributeViewModel) {
        this.subscribers.changeSelfContent = this.productAttributeService.updateSelfContent(attribute.id, !attribute.isSelfContent)
            .subscribe((result: ActionResultViewModel) => this.toastr.success(result.message));
    }


    changeMultiple(attribute: ProductAttributeViewModel) {
        this.subscribers.changeMultiple = this.productAttributeService.updateMultiple(attribute.id, !attribute.isMultiple)
            .subscribe((result: ActionResultViewModel) => this.toastr.success(result.message));
    }

    changeRequire(attribute: ProductAttributeViewModel) {
        this.subscribers.changeRequire = this.productAttributeService.updateRequire(attribute.id, !attribute.isRequire)
            .subscribe((result: ActionResultViewModel) => this.toastr.success(result.message));
    }

    changeActive(attribute: ProductAttributeViewModel) {
        this.subscribers.changeActive = this.productAttributeService.updateActive(attribute.id, !attribute.isActive)
            .subscribe((result: ActionResultViewModel) => this.toastr.success(result.message));
    }
}
