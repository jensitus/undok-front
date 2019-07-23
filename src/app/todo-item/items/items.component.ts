import { Component, OnInit } from '@angular/core';
import {TodoService} from '../services/todo.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  constructor(
    private todoService: TodoService
  ) { }

  ngOnInit() {
  }

}
