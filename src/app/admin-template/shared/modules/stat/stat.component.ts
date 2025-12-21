import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {IconDefinition, faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons';
import {RouterLink} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-stat',
  standalone: true,
  templateUrl: './stat.component.html',
  imports: [
    RouterLink,
    FaIconComponent
  ],
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
