import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UploadService} from '../services/upload.service';

class ImageSnippet {
  pending = false;
  status = 'init';

  constructor(
    public src: string,
    public file: File
  ) {
  }
}

const URL = 'http://localhost:8080/service/app/files';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  selectedFile: ImageSnippet;
  uploadForm: FormGroup;
  isDropOver: boolean;
  videoFiles: string[] = [];
  sMsg = '';

  constructor(
    private formBuilder: FormBuilder,
    private uploadService: UploadService
  ) {
  }

  ngOnInit() {
    const headers = [{name: 'Accept', value: 'application/json'}];
    // this.uploader = new FileUploader({url: URL, autoUpload: true, headers: headers});
    // this.uploader.onCompleteAll = () => alert('file uploaded');
    this.uploadForm = this.formBuilder.group({
      file: []
    });
  }

  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.selectedFile.pending = true;
      console.log(this.selectedFile);
      this.uploadService.schickDasBild(this.selectedFile.file).subscribe(
        (res) => {
          this.onSuccess();
        },
        (err) => {
          this.onError();
        });
    });
    reader.readAsDataURL(file);
  }

  // onSubmit() {
  //   console.log(this.uploadForm);
  //   this.uploadService.schickDasBild(this.uploadForm.get('file')).subscribe(heast => {
  //
  //   });
  // }

  getFileDetails(e) {
    console.log(e.target.files);
    for (let i = 0; i < e.target.files.length; i++) {
      this.videoFiles.push(e.target.files[i]);
    }
  }

  upTheVideo() {
    this.uploadService.schickTheVideo(this.videoFiles).subscribe(
      data => {
        // SHOW A MESSAGE RECEIVED FROM THE WEB API.
        this.sMsg = data as string;
        console.log(this.sMsg);
      }
    );
  }

}
