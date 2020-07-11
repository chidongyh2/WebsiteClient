import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { NhModalService } from './nh-modal.service';

@Directive({
    selector: '[nh-dismiss]'
})

export class NhDismissDirective {
    @Output() dismiss = new EventEmitter();

    constructor(private nhModalService: NhModalService) {
    }

    @HostListener('click', ['$event'])
    onElementClick(e: any) {
        this.nhModalService.dismiss();
    }
}
