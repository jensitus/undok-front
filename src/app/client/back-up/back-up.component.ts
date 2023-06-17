import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {saveAs} from 'file-saver';
import {CsvService} from '../service/csv.service';

@Component({
  selector: 'app-back-up',
  templateUrl: './back-up.component.html',
  styleUrls: ['./back-up.component.css']
})
export class BackUpComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  public csvList: string[];
  public clientsList: string[] = [];
  public counselingsList: string[] = [];
  constructor(private csvService: CsvService) { }

  ngOnInit(): void {
    this.subscription.push(this.csvService.getCsvList().subscribe(result => {
      this.csvList = result;
      this.divideCsv();
    }));
  }

  divideCsv() {
    for (const csv of this.csvList) {
      if (csv.includes('clients')) {
        this.clientsList.push(csv);
      } else {
        this.counselingsList.push(csv);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach((s) => {
      s.unsubscribe();
    });
  }

  getCsvAsBackup(filename: string) {
    this.subscription.push(
      this.csvService.getBackUpCsv(filename)
          .subscribe(blob => saveAs(blob, filename + '.csv'))
    );
  }

}
