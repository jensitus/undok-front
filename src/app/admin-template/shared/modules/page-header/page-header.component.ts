import {Component, OnInit, Input} from '@angular/core';
import {IconDefinition} from '@fortawesome/free-solid-svg-icons';

@Component({
             selector: 'app-page-header',
             templateUrl: './page-header.component.html',
             styleUrls: ['./page-header.component.scss']
           })
export class PageHeaderComponent implements OnInit {

  @Input() firstPoint!: string;
  @Input() firstIcon!: IconDefinition;
  @Input() firstLink!: string;

  @Input() secondPoint: string;
  @Input() secondIcon: IconDefinition;
  @Input() secondLink: string;

  @Input() thirdPoint: string;
  @Input() thirdIcon: IconDefinition;
  @Input() thirdLink: string;

  @Input() fourthPoint: string;
  @Input() fourthIcon: string;
  @Input() fourthLink: string;

  @Input() endPoint!: string;
  @Input() endPointIcon: IconDefinition;

  @Input() heading: string;
  @Input() icon: string;

  routerlink: string;

  constructor() {
  }

  ngOnInit() {

  }
}
