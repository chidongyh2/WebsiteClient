import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {BaseListComponent} from '../../../../base-list.component';
import {News} from '../model/news.model';
import {ToastrService} from 'ngx-toastr';
import {CategoryService} from '../../category/category.service';
import {TreeData} from '../../../../view-model/tree-data';
import {NewsService} from '../service/news.service';
import {NewSearchForSelectViewModel} from '../viewmodel/new-search-for-select.viewmodel';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';

@Component({
    selector: 'app-new-select',
    templateUrl: './select-new.component.html',
    styleUrls: ['../news.scss'],
    providers: [NewsService, CategoryService]
})

export class SelectNewComponent extends BaseListComponent<News> implements OnInit, AfterViewInit {
    @Output() onCancel = new EventEmitter();
    @Output() onAccept = new EventEmitter();
    listSelectedNews = [];
    categoryId;
    keyword = '';
    listNews = [];
    categoryTree = [];

    constructor(private toastr: ToastrService,
                private newsService: NewsService,
                private categoryService: CategoryService) {
        super();
    }

    ngOnInit() {
        this.categoryService.getTree().subscribe((result: TreeData[]) => this.categoryTree = result);
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.search(1);
        }, 200);
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.newsService.searchForSelect(this.keyword, this.categoryId, this.currentPage, this.pageSize)
            .subscribe((result: SearchResultViewModel<NewSearchForSelectViewModel>) => {
                this.renderListNews(result.items);
                this.totalRows = result.totalRows;
            });
    }

    selectCategory(value: TreeData) {
        if (value) {
            this.categoryId = value.id;
        } else {
            this.categoryId = '';
        }
        this.search(1);
    }

    onSelectItem(item: NewSearchForSelectViewModel) {
        item.selected = !item.selected;

        if (item.selected) {
            const existsItem = _.find(this.listSelectedNews, (news) => {
                return item.id === news.id;
            });

            if (existsItem) {
                return;
            } else {
                this.listSelectedNews.push({
                    id: item.id,
                    name: item.title,
                    image: item.featureImage,
                });
            }
        } else {
            _.remove(this.listSelectedNews, (news) => {
                return item.id === news.id;
            });
        }
    }

    accept() {
        if (this.listSelectedNews.length === 0) {
            this.toastr.warning('Vui lòng chọn ít nhất 1 nhóm.');
            return;
        }
        this.onAccept.emit(_.map(this.listSelectedNews, (news) => {
            return news;
        }));
        _.each(this.listNews, (item) => {
            item.selected = false;
        });
    }

    cancel() {
        this.onCancel.emit();
    }

    private renderListNews(listNews) {
        const newsItems = [];
        _.each(listNews, (item: any) => {
            item.selected = _.map(this.listSelectedNews, news => {
                return news.id;
            }).indexOf(item.id) > -1;

            newsItems.push(item);
        });

        this.listNews = newsItems;
    }

    // private reRenderSelectedNews() {
    //     _.each(this.listNews, (news) => {
    //         news.selected = _.map(this.listSelectedNews, (item) => {
    //             return item.id;
    //         }).indexOf(news.id) > -1;
    //     });
    // }
}
