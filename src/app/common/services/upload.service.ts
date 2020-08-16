import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  apiUrl = environment.api_url;
  videoFiles: string[] = [];

  constructor(
    private http: HttpClient
  ) { }

  schickDasBild (bild) {
    const formData = new FormData();
    formData.append('file', bild);
    return this.http.post(`${this.apiUrl}/service/app/files`, formData);
  }

  schickTheVideo(videoFiles) {
    this.videoFiles = videoFiles;
    const frmData = new FormData();
    for (let i = 0; i < this.videoFiles.length; i++) {
      frmData.append('file', this.videoFiles[i]);
      console.log('frmData', frmData.get('file'));
    }
    return this.http.post(`${this.apiUrl}/service/app/files`, frmData);
  }

}
