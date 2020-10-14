import {Movie} from './movie';
import {Schedule} from './schedule';

export interface MovieSchedules {
  movie: Movie;
  schedules: Schedule[];
}
