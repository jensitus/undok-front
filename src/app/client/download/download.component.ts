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
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(response);
      a.href = objectUrl;
      a.download = 'clients.csv';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

}
