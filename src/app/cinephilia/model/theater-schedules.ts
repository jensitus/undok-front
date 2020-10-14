import {Theater} from './theater';
import {Schedule} from './schedule';

export interface TheaterSchedules {
  theater: Theater;
  schedules: Schedule[];
}
