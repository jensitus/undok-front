import { Component, OnInit } from '@angular/core';
import {DiaryService} from '../services/diary.service';
import {Diary} from '../model/diary';
import {AlertService} from '../../auth/services/alert.service';
import {CommonService} from '../../common/common.service';

@Component({
  selector: 'app-diary-list',
  templateUrl: './diary-list.component.html',
  styleUrls: ['./diary-list.component.css']
})
export class DiaryListComponent implements OnInit {

  diaries: any;
  reload: boolean;

  constructor(
    private diaryService: DiaryService,
    private alertService: AlertService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getDiaries();
    this.commonService.diarySubject.subscribe(res => {
      this.reload = res;
      if (this.reload) {
        this.getDiaries();
      }
    });
  }

  private getDiaries() {
    this.diaryService.getDiaries().subscribe(data => {
      console.log(data);
      this.diaries = data;
    }, error => {
      this.alertService.error(error);
    });
  }

}
