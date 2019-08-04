import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  apiUrl = environment.api_url;

  constructor(private http: HttpClient) { }

  getTasks() {

  }

  getTask(taskId) {
    return this.http.get(`${this.apiUrl}/service/app/task/${taskId}`);
  }

  getTaskList(user_id) {
    return this.http.get(`${this.apiUrl}/service/app/task/list/${user_id}`);
  }

  getVariable(executionId, variableName) {
    return this.http.get(`${this.apiUrl}/service/app/${executionId}/variable?name=${variableName}`);
  }

  completeTask(task_id) {
    console.log('completeTask', task_id);
    return this.http.post(`${this.apiUrl}/service/app/task/complete`, task_id);
  }

  checkOpenItems(task_id) {
    return this.http.get(this.apiUrl + '/service/app/check/items/' + task_id);
  }

}
