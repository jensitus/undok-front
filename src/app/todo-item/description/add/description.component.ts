import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  descriptionForm: FormGroup;
  loading = false;
  submitted = false;


  @Input() public item_id: number;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.descriptionForm = this.formBuilder.group({
      text: ['', Validators.required]
    });
    console.log('item_id', this.item_id);
  }

  get f() {
    return this.descriptionForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.descriptionForm.invalid) {
      return;
    }
    this.loading = true;
  }



}
