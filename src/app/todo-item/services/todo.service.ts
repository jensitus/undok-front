import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Todo} from '../model/todo';
import {Item} from '../model/item';
import {User} from '../../auth/model/user';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  createTodo(todo: Todo) {
    return this.http.post(`${this.apiUrl}/todos`, todo);
  }

  getTodos() {
    return this.http.get<Todo[]>(`${this.apiUrl}/todos`);
  }

  getTodo(todo_id) {
    return this.http.get<Todo>(`${this.apiUrl}/todos/${todo_id}`);
  }

  getTodoItems(todo_id) {
    return this.http.get<Item[]>(`${this.apiUrl}/todos/${todo_id}/items`);
  }

  createTodoItem(todo_id, item: Item) {
    return this.http.post(`${this.apiUrl}/todos/${todo_id}/items`, item);
  }

  addUserToTodo(id, user_id) {
    return this.http.post(`${this.apiUrl}/todos/${id}/add_user`, {user_id: user_id});
  }

  getTodoUsers(todo_id) {
    return this.http.get<User[]>(`${this.apiUrl}/todos/${todo_id}/users`);
  }

}
