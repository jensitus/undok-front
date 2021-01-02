import {Theater} from './theater';
import {Movie} from './movie';

export interface TheaterMovies {
  theater: Theater;
  movies: Movie[];
}
