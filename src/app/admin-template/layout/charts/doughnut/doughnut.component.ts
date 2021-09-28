import { Component, OnInit } from '@angular/core';
import {ClientService} from '../../../../client/service/client.service';
import {CountryData} from './country-data';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.css']
})
export class DoughnutComponent implements OnInit {

  doughnutChartLabels: string[];
  doughnutChartData: number[];
  doughnutChartType: string;
  citizens: number[] = [];
  countries: string[] = [];
  countryData: CountryData;

  constructor(
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
  this.doughnutChartType = 'doughnut';
    this.clientService.getCountryDataForCharts().subscribe(res => {
      this.countryData = res;
      this.countries = this.countryData[0];
      this.citizens = this.countryData[1];
      console.log('countries:', this.countries);
      console.log('citizens', this.citizens);
      this.setChartLabelAndData();
    });
  }

  setChartLabelAndData() {
    this.doughnutChartLabels = this.countries;
    this.doughnutChartData = this.citizens;
    console.log(this.doughnutChartLabels);
  }

}
