import { Component, OnInit } from '@angular/core';
import {UploadService} from '../../services/upload.service';
import {Uploaded} from '../model/uploaded';

@Component({
  selector: 'app-filelist',
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.css']
})
export class FilelistComponent implements OnInit {

  fileList: Uploaded[];

  constructor(
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.uploadService.getTheFileList().subscribe(hey => {
      this.fileList = hey;
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].generatedName.endsWith('.jpg')) {
          this.fileList[i].url = 'http://localhost:8080/home/jensitus/Documents/filefolder/' + this.fileList[i].generatedName;
        }
      }
    });
    this.uploadService.getTheSingleFile().subscribe(donner => {
      console.log('donner', donner);
    });
  }

}
