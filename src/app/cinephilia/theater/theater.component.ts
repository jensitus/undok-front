import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TheaterService} from '../services/theater.service';
import {Theater} from '../model/theater';
import {TheaterMovies} from '../model/theater-movies';
import {dashCaseToCamelCase} from '@angular/compiler/src/util';
import {TheaterSchedules} from '../model/theater-schedules';

@Component({
  selector: 'app-theater',
  templateUrl: './theater.component.html',
  styleUrls: ['./theater.component.css']
})
export class TheaterComponent implements OnInit {

  id: number;
  theaterMovies: TheaterMovies;
  theater: Theater;
  today = new Date();
  theaterWithSchedules: TheaterSchedules;
  value: any;
  movieForTheaterWithSchedules: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private theaterService: TheaterService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.theaterService.getTheater(this.id).subscribe(theater => {
      this.theater = theater;
    });
    this.theaterService.getTheaterSchedules(this.id).subscribe(theaterSchedules => {
      this.theaterWithSchedules = theaterSchedules;
    });
    this.theaterService.getTheaterSchedulesMovies(this.id).subscribe(schedulesMovies => {
      console.log(schedulesMovies);
    });
  }

}
