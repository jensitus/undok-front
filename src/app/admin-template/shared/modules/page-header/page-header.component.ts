import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  @Input() firstPoint: string;
  @Input() firstIcon: string;
  @Input() firstLink: string;

    @Input() heading: string;
    @Input() icon: string;

    routerlink: string;

    constructor() {}

    ngOnInit() {
      console.log(this.firstLink, 'this.firstLink');
      if (this.firstLink == null) {
        this.routerlink = null;
      } else {
        this.routerlink = '/' + this.firstLink;
      }
    }
}
