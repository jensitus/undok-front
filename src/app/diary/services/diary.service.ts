import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Diary} from '../model/diary';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {

  apiUrl = environment.api_url;

  constructor(private http: HttpClient) { }

  createDiary(diary: Diary) {
    return this.http.post(`${this.apiUrl}/diaries`, diary);
  }

  getDiaries() {
    return this.http.get<Diary[]>(`${this.apiUrl}/diaries`);
  }

  getDiary(diary_id) {
    return this.http.get<Diary>(`${this.apiUrl}/diaries/${diary_id}`);
  }

  updateDiary(diary: Diary) {
    return this.http.put(`${this.apiUrl}/diaries/${diary.id}`, diary);
  }

}
