import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Todo} from '../model/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  createTodo(todo: Todo) {
    return this.http.post(`${this.apiUrl}/todos`, todo);
  }

  getTodos() {
    return this.http.get<Todo[]>(`${this.apiUrl}/todos`);
  }



}
