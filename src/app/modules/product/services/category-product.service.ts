import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IResponseResult} from '../../../interfaces/iresponse-result';
import {environment} from '../../../../environments/environment';
import {ActivatedRouteSnapshot} from '@angular/router';
import {TreeData} from '../../../view-model/tree-data';
import {finalize, map} from 'rxjs/operators';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {AppService} from '../../../shareds/services/app.service';
import {ProductCategory} from '../model/product-category.model';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {ProductCategoryViewModel} from '../model/product-category.viewmodel';
import {CategoryProductSearchForSelectViewModel} from '../model/category-product-search-for-select.viewmodel';
import {ICategoryPickerViewmodel} from '../model/icategory-picker.viewmodel';

@Injectable({
    providedIn: 'root'
})
export class CategoryProductService {
    url = 'api/v1/warehouse/product-categories/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private appService: AppService,
                private toasTrService: ToastrService,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const keyword = queryParams.keyword;
        const isActive = queryParams.isActive;
        const page = queryParams.page;
        const pageSize = queryParams.pageSize;
        return this.search(keyword, isActive, page, pageSize);
    }

    search(keyword: string, isActive?: boolean, page: number = 1, pageSize: number = 20): Observable<TreeData[]> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('languageId', this.appService.currentLanguage)
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : true.toString())
        }).pipe(map((result: SearchResultViewModel<TreeData>) => result.items)) as Observable<TreeData[]>;
    }

    searchPicker(keyword: string, page: number, pageSize?: number): Observable<SearchResultViewModel<ICategoryPickerViewmodel>> {
        return this.http.get(`${this.url}search-picker`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<ICategoryPickerViewmodel>>;
    }

    insert(category: ProductCategory): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}${this.appService.currentUser.tenantId}`, category, {
        }).pipe(finalize(() => this.spinnerService.hide()),
            map((result: ActionResultViewModel) => {
                this.toasTrService.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    update(id: number, category: ProductCategory): Observable<IResponseResult> {
        this.spinnerService.show();
        return this.http.post(`${this.url}${this.appService.currentUser.tenantId}/${id}`, category, {
        })
            .pipe(finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toasTrService.success(result.message);
                    return result;
                })) as Observable<ActionResultViewModel>;
    }

    delete(id: number): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.delete(`${this.url}${this.appService.currentUser.tenantId}/${id}`, {
        }).pipe(finalize(() => this.spinnerService.hide()),
            map((result: ActionResultViewModel) => {
                this.toasTrService.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getTree(): Observable<TreeData[]> {
        return this.http.get(`${this.url}tree`, {
            params: new HttpParams()
                .set('keyword', '')
                .set('languageId', this.appService.currentLanguage)
                .set('isActive', true.toString())
        })
            .pipe(map((result: SearchResultViewModel<TreeData>) => result.items)) as Observable<TreeData[]>;
    }

    getDetail(id: number): Observable<ProductCategoryViewModel> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${this.appService.currentUser.tenantId}/${id}`, {
        })
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<ProductCategoryViewModel>) => {
                    return result.data;
                })
            ) as Observable<ProductCategoryViewModel>;
    }

    searchForSelect(keyword: string, page: number = 1, pageSize: number = 20):
        Observable<SearchResultViewModel<CategoryProductSearchForSelectViewModel>> {
        return this.http.get(`${this.url}search-for-select`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page > 0 ? page.toString() : '')
                .set('pageSize', pageSize > 0 ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<CategoryProductSearchForSelectViewModel>> ;
    }
}
