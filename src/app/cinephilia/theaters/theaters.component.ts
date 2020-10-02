import { Component, OnInit } from '@angular/core';
import {TheaterService} from '../services/theater.service';
import {Theater} from '../model/theater';

@Component({
  selector: 'app-theaters',
  templateUrl: './theaters.component.html',
  styleUrls: ['./theaters.component.css']
})
export class TheatersComponent implements OnInit {

  theaterList: Theater[];

  constructor(
    private theaterService: TheaterService
  ) { }

  ngOnInit() {
    this.theaterService.getTheaterList().subscribe(result => {
      console.log('theaters', result);
      this.theaterList = result;
    });
  }

}
