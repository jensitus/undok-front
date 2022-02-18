import { Component, OnInit } from '@angular/core';
import {ClientService} from '../../../../client/service/client.service';
import {CountryData} from './country-data';

import {ChartOptions} from 'chart.js';

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
  colors: string[];
  options: ChartOptions = {
    responsive: true
  };

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
    this.colors = [
      // {
      //   backgroundColor: [
      //     '#dc3545', '#adb5bd', '#6f42c1', '#20c997', '#fd7e14', '#0d6efd', '#d63384', '#ffc107', '#198754', '#0dcaf0', '#6610f2',
      //     '#dc3545', '#adb5bd', '#6f42c1', '#20c997', '#fd7e14', '#0d6efd', '#d63384', '#ffc107', '#198754', '#0dcaf0', '#6610f2'
      //     ]
      // }
    ];

  }

  setChartLabelAndData() {
    this.doughnutChartLabels = this.countries;
    this.doughnutChartData = this.citizens;
    console.log(this.doughnutChartLabels);
  }

}
