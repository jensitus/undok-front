import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  apiUrl = environment.api_url;
  value: boolean;

  constructor(private http: HttpClient) { }

  setVariable(executionId, name, value) {
    this.value = value;
    return this.http.post(this.apiUrl + '/service/app/setvariable/' + executionId + '/?name=' + name, value.toString());
  }

  getVariable(executionId, variableName) {
    return this.http.get(`${this.apiUrl}/service/app/${executionId}/variable?name=${variableName}`);
  }

}
