import {Component, Input, OnInit} from '@angular/core';
import {ProcessService} from '../services/process.service';
import {AlertService} from '../../common/alert/services/alert.service';

@Component({
  selector: 'app-set-variable-check-box',
  templateUrl: './set-variable-check-box.component.html',
  styleUrls: ['./set-variable-check-box.component.css']
})
export class SetVariableCheckBoxComponent implements OnInit {

  @Input() executionId: string;
  @Input() name: string;
  data: any;
  c: any;
  checked: string;
  @Input() t: string;
  @Input() f: string;
  @Input() message: string;
  value: boolean;

  constructor(
    private processService: ProcessService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getVar();
  }

  onCheckSubmit() {
    console.log();
    this.value = !this.value;
    this.processService.setVariable(this.executionId, this.name, this.value).subscribe(data => {
      this.data = data;
      this.getVar();
    });
  }

  private getVar() {
    this.processService.getVariable(this.executionId, this.name).subscribe(c => {
      if (c === true) {
        this.value = true;
        this.checked = this.t;
      } else {
        this.value = false;
        this.checked = this.f;
      }
      this.alertService.success(this.message + this.checked, true);
    });
  }

}
