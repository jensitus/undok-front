import {computed, Injectable, signal} from '@angular/core';
import {Task} from '../model/task';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = environment.api_url + '/service/undok/api/tasks';

  // Signals for state management
  private tasksSignal = signal<Task[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Public readonly signals
  readonly tasks = this.tasksSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // Computed values (if needed)
  readonly taskCount = computed(() => this.tasksSignal().length);

  constructor(private http: HttpClient) {}

  // Get all tasks
  getAllTasks(): Observable<Task[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<Task[]>(this.apiUrl + '/active').pipe(
      tap(tasks => {
        this.tasksSignal.set(tasks);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.errorSignal.set('Failed to load tasks');
        this.loadingSignal.set(false);
        return of([]);
      })
    );
  }

  // Get task by ID
  getTaskById(id: string): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadingSignal.set(false)),
      catchError(error => {
        this.errorSignal.set('Failed to load task');
        this.loadingSignal.set(false);
        throw error;
      })
    );
  }

  // Get tasks by case ID
  getTasksByCaseId(caseId: string): Observable<Task[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<Task[]>(`${this.apiUrl}/case/${caseId}`).pipe(
      tap(tasks => {
        this.tasksSignal.set(tasks);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.errorSignal.set('Failed to load tasks for case');
        this.loadingSignal.set(false);
        return of([]);
      })
    );
  }

  // Create task
  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(newTask => {
        this.tasksSignal.update(tasks => [...tasks, newTask]);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.errorSignal.set('Failed to create task');
        this.loadingSignal.set(false);
        throw error;
      })
    );
  }

  // Update task
  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      tap(updatedTask => {
        this.tasksSignal.update(tasks =>
          tasks.map(t => t.id === id ? updatedTask : t)
        );
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.errorSignal.set('Failed to update task');
        this.loadingSignal.set(false);
        throw error;
      })
    );
  }

  // Delete task
  deleteTask(id: string): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.tasksSignal.update(tasks => tasks.filter(t => t.id !== id));
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.errorSignal.set('Failed to delete task');
        this.loadingSignal.set(false);
        throw error;
      })
    );
  }

  // Optional: Clear tasks from state
  clearTasks(): void {
    this.tasksSignal.set([]);
  }

}
