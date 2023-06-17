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
  public cscList: string[];
  constructor(private csvService: CsvService) { }

  ngOnInit(): void {
    this.subscription.push(this.csvService.getCsvList().subscribe(result => {
      this.cscList = result;
    }));
  }

  ngOnDestroy(): void {
    this.subscription.forEach((s) => {
      s.unsubscribe();
    });
  }

  getCsvAsBackup(filename: string) {
    console.log(filename);
    this.subscription.push(
      this.csvService.getBackUpCsv(filename)
          .subscribe(blob => saveAs(blob, filename + '.csv'))
    );
  }

}
