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

}
