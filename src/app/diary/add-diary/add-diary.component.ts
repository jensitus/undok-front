import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertService} from '../../common/alert/services/alert.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../common/common.service';
import {DiaryService} from '../services/diary.service';
import {Diary} from '../model/diary';

@Component({
  selector: 'app-add-diary',
  templateUrl: './add-diary.component.html',
  styleUrls: ['./add-diary.component.css']
})
export class AddDiaryComponent implements OnInit {

  diaryForm: FormGroup;
  diary: Diary;
  loading = false;
  submitted = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private diaryService: DiaryService
  ) {
  }

  ngOnInit() {
    this.diaryForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  get f() {
    return this.diaryForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.diaryForm.invalid) {
      return;
    }
    this.loading = true;
    this.diaryService.createDiary(this.diaryForm.value).subscribe(data => {
      console.log(data);
      this.diaryForm.reset();
      this.commonService.setDiarySubject(true);
      this.loading = false;
    }, error => {
      this.alertService.error(error);
    });
  }

}
