import { Directive, ElementRef, OnInit } from '@angular/core';
@Directive({
    standalone: true,
    selector: '[appFocus]',
})
export class FocusDirective implements OnInit {
    constructor(private element: ElementRef) { }

    ngOnInit() {
        this.element.nativeElement.focus();
    }
}