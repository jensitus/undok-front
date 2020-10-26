import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TheaterService} from '../services/theater.service';
import {Theater} from '../model/theater';
import {TheaterMovies} from '../model/theater-movies';
import {TheaterSchedules} from '../model/theater-schedules';
import {MovieService} from '../services/movie.service';
import {Schedule} from '../model/schedule';
import {Movie} from '../model/movie';
import {DatePipe} from '@angular/common';
import {entryPointKeyFor} from '@angular/compiler-cli/src/ngtsc/routing';

@Component({
  selector: 'app-theater',
  templateUrl: './theater.component.html',
  styleUrls: ['./theater.component.css'],
  providers: [DatePipe]
})
export class TheaterComponent implements OnInit {

  id: number;
  theaterMovies: TheaterMovies;
  theater: Theater;
  theaterName: string;
  theaterAddress: string;
  theaterUrl: string;
  today = new Date();
  theaterWithSchedules: TheaterSchedules;
  value: any;
  movieForTheaterWithSchedules: any;
  schedules = new Map<string, Map<string, Schedule[]>>();
  movies: Movie[];
  scheduleMovieMap = new Map;
  moviesSortedByDateMap = new Map;

  constructor(
    private activatedRoute: ActivatedRoute,
    private theaterService: TheaterService,
    private datePipe: DatePipe,
    private movieService: MovieService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.theaterService.getTheater(this.id).subscribe(theater => {
      this.theater = theater;
      this.theaterName = this.theater.name;
      this.theaterAddress = this.theater.address;
      this.theaterUrl = this.theater.url;
    });
    this.getTheMovies();
    this.getOnlyTheSchedules();
  }

  private groupSchedulesByDate() {

  }

  private getOnlyTheSchedules() {
    this.theaterService.getTheaterSchedules(this.id).subscribe(schedules => {
      this.schedules = schedules;
      console.log('schedules', this.schedules);
      console.log(Object.keys(this.schedules));
      console.log((Object.values(this.schedules)));
      Object.values(this.schedules).map(donner => {
        console.log(donner[0]);
        console.log(donner[1]);
      });
    });
  }

  // private getTheSchedules() {
  //   this.theaterService.getTheaterSchedules(this.id).subscribe(theaterSchedules => {
  //     this.schedules = theaterSchedules;
  //     const sortedSchedules: Schedule[] = this.schedules.sort((s1, s2) => {
  //       if (s1.time > s2.time) {
  //         return 1;
  //       } else if (s1.time < s2.time) {
  //         return -1;
  //       } else {
  //         return 0;
  //       }
  //     });
  //     console.log('sortedSchedules', sortedSchedules);
  //     this.schedules.map(schedule => {
  //       let date: string;
  //       console.log('zum donner aber auch');
  //       console.log(this.datePipe.transform(schedule.time, 'yyyy-MM-dd'));
  //       date = this.datePipe.transform(schedule.time, 'yyyy-MM-dd');
  //     });
  //     for (let i = 0; i < this.schedules.length; i++) {
  //       let date: string;
  //       date = this.datePipe.transform(this.schedules[i].time, 'yyyy-MM-dd');
  //       console.log('datestring', date);
  //       for (let a = 0; a < this.movies.length; a++) {
  //         if (this.schedules[i].movie_id === this.movies[a].id) {
  //           if (this.moviesSortedByDateMap.get(date)) {
  //             for (const value of this.moviesSortedByDateMap.get(date).values()) {
  //               console.log('entry[0]');
  //               console.log(value);
  //             }
  //             // this.moviesSortedByDateMap.get(date).value.set(this.schedules[i], this.movies[a]);
  //           } else {
  //             const intermediateMap = new Map;
  //             intermediateMap.set(this.schedules[i], this.movies[a]);
  //             this.moviesSortedByDateMap.set(date, intermediateMap);
  //           }
  //         }
  //       }
  //     }
  //   });
  // }

  private getTheMovies() {
    this.theaterService.getTheaterSchedulesMovies(this.id).subscribe(movies => {
      this.movies = movies;
    });
  }

}
