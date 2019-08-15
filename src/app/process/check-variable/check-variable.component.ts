import {Component, Input, OnInit} from '@angular/core';
import {ProcessService} from '../services/process.service';

@Component({
  selector: 'app-check-variable',
  templateUrl: './check-variable.component.html',
  styleUrls: ['./check-variable.component.css']
})
export class CheckVariableComponent implements OnInit {

  @Input() executionId: string;
  @Input() name: string;

  constructor(
    private processService: ProcessService
  ) { }

  ngOnInit() {
    console.log(this.executionId);
    console.log(this.name);
  }

  onCheckSubmit(value) {
    console.log('yeah hell');
    console.log(value);
    console.log(this.name);
    this.processService.setVariable(this.executionId, this.name, value).subscribe(data => {
      console.log(data);
    });
  }

}
