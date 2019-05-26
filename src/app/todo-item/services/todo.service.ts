import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Todo} from '../model/todo';
import {Item} from '../model/item';
import {User} from '../../auth/model/user';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  apiUrl = environment.api_url;

  constructor(private http: HttpClient) {
  }

  createTodo(todo: Todo) {
    return this.http.post(`${this.apiUrl}/todos/create`, todo);
  }

  getTodos() {
    return this.http.get(`${this.apiUrl}/todos/`);
  }

  getTodo(todo_id) {
    return this.http.get(`${this.apiUrl}/todos/${todo_id}`);
  }

  getTodoItems(todo_id) {
    return this.http.get<Item[]>(`${this.apiUrl}/todos/${todo_id}/items`);
  }

  createTodoItem(todo_id, item: Item) {
    return this.http.post(`${this.apiUrl}/todos/${todo_id}/items`, item);
  }

  addUserToTodo(todo_id, user_id) {
    return this.http.post(`${this.apiUrl}/todos/${todo_id}/add_user`, {user_id: user_id});
  }

  getTodoUsers(todo_id) {
    return this.http.get<User[]>(`${this.apiUrl}/todos/${todo_id}/users`);
  }

  getTodoItem(todo_id, item_id) {
    return this.http.get<Item>(`${this.apiUrl}/todos/${todo_id}/items/${item_id}`);
  }

  updateTodoItem(todo_id, item_id, item: Item) {
    return this.http.put(`${this.apiUrl}/todos/${todo_id}/items/${item_id}`, item);
  }

  deleteTodoItem(todo_id, item_id) {
    return this.http.delete(this.apiUrl + '/todos/' + todo_id + '/items/' + item_id);
  }

  updateTodo(todo_id, todo: Todo) {
    return this.http.put(this.apiUrl + '/todos/' + todo_id, todo);
  }

  deleteTodo(todo_id) {
    return this.http.delete(`${this.apiUrl}/todos/${todo_id}`);
  }

  createItemDescription() {

  }

}
