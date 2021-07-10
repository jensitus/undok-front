import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Counseling} from '../model/counseling';

@Component({
  selector: 'app-show-counselings-per-client',
  templateUrl: './show-counselings-per-client.component.html',
  styleUrls: ['./show-counselings-per-client.component.css']
})
export class ShowCounselingsPerClientComponent implements OnInit, OnDestroy {

  @Input() counselings: Counseling[];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
