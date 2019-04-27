/**
 * Created by HoangNH on 3/2/2017.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NhImageComponent } from "./nh-image.component";
import {CoreModule} from '../../../core/core.module';

@NgModule({
    imports: [CommonModule, CoreModule],
    declarations: [NhImageComponent],
    exports: [NhImageComponent]
})

export class NhImageModule { }
