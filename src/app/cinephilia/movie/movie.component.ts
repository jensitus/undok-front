import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Movie} from '../model/movie';
import {MovieService} from '../services/movie.service';
import {Schedule} from '../model/schedule';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  id: number;
  movie: Movie;
  navBarPrefix = 'cinephilia';
  movieTheaters: Map<string, Map<string, Schedule[]>>;
  loading: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private movieService: MovieService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.movieService.getSingleMovie(this.id).subscribe(movie => {
        this.movie = movie;
        console.log(this.movie);
      });
      this.getMovieSchedulesTheaters();
    });
    this.loading = false;
  }

  private getMovieSchedulesTheaters() {
    this.movieService.getMovieScheduleTheaters(this.id).subscribe(movieTheaters => {
      this.movieTheaters = movieTheaters;
      console.log(this.movieTheaters);
    });
  }
}
