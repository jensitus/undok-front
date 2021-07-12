import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {IconDefinition, faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-stat',
    templateUrl: './stat.component.html',
    styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
    @Input() bgClass: string;
    @Input() icon: IconDefinition;
    @Input() count: number;
    @Input() label: string;
    @Input() data: number;
    @Input() link: string;
    @Output() event: EventEmitter<any> = new EventEmitter();

    faArrowCircleRight = faArrowAltCircleRight;

    constructor() {}

    ngOnInit() {}
}
