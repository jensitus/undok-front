import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';

import {Uploaded} from '../upload/model/uploaded';
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

  schickDasBild (bild: string | Blob) {
    const formData = new FormData();
    formData.append('file', bild);
    return this.http.post(`${this.apiUrl}/service/app/files`, formData);
  }

  schickTheVideo(videoFiles: string[]) {
    this.videoFiles = videoFiles;
    const frmData = new FormData();
    for (let i = 0; i < this.videoFiles.length; i++) {
      frmData.append('file', this.videoFiles[i]);
      console.log('frmData', frmData.get('file'));
    }
    return this.http.post(`${this.apiUrl}/service/app/files`, frmData);
  }

  getTheFileList() {
    return this.http.get<Uploaded[]>(this.apiUrl + '/service/app/get-images/filelist');
  }

  getTheSingleFile() {
    return this.http.get(this.apiUrl + '/service/app/get-images/single-file');
  }


}
