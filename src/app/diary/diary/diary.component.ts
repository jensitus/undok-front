import { Component, OnInit } from '@angular/core';
import {DiaryService} from '../services/diary.service';
import {Diary} from '../model/diary';
import {ActivatedRoute} from '@angular/router';
import {AlertService} from '../../auth/services/alert.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent implements OnInit {

  diary: Diary;
  diary_id: string;

  constructor(
    private diaryService: DiaryService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.diary_id = params['id'];
    });
    this.diaryService.getDiary(this.diary_id).subscribe(data => {
      this.diary = data;
    }, error => {
      this.alertService.error(error);
    });
  }

}
