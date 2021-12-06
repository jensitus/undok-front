import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-employers',
  templateUrl: './show-employers.component.html',
  styleUrls: ['./show-employers.component.css']
})
export class ShowEmployersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Show Employers Kreuz Verfickte');
  }

}
