import {Component, OnDestroy, OnInit} from '@angular/core';
import {DownloadService} from '../service/download.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  constructor(private downloadService: DownloadService) { }

  ngOnInit(): void {
  }

  downloadClientCsv(filename: string): void {
    this.downloadService.downloadClientCsv(filename).pipe(takeUntil(this.unsubscribe$)).subscribe(response => {
      console.log(response);
      const binaryData = [];
      binaryData.push(response.data);
      const url = window.URL.createObjectURL(new Blob(binaryData, {type: 'application/csv'}));
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.setAttribute('target', 'blank');
      a.href = url;
      a.download = response.filename;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

}
