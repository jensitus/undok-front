import {Component, Input, OnInit} from '@angular/core';
import {TodoService} from '../../../../../todo-item/services/todo.service';
import {faBomb, faGraduationCap, faClock, faCheck, faCreditCard} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  @Input() user_id: number;
  items: any;
  faBomb = faBomb;
  faGraduationCap = faGraduationCap;
  faClock = faClock;
  faCheck = faCheck;
  faCreditCard = faCreditCard;

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
