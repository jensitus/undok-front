import {Component, Input, OnInit} from '@angular/core';
import {TodoService} from '../../../../../todo-item/services/todo.service';
import {Item} from '../../../../../todo-item/model/item';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  @Input() user_id: number;
  items: any;

  constructor(
    private todoService: TodoService
  ) { }

  ngOnInit() {
    this.todoService.getItemsByUser(this.user_id).subscribe(response => {
      this.items = response;
      console.log(this.items);
    }, error => {
      console.log(error);
    });
  }

}
