import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, tap } from 'rxjs';
import { CreateTaskDto, Task, UpdateTaskDto } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private httpClient: HttpClient = inject(HttpClient);
  private apiUrl: string = `${environment.apiUrl}/tasks`;

  #tasks = signal<Task[]>([]);
  tasks = this.#tasks.asReadonly();

  tasksDone = computed(() => {
    return this.tasks().filter((task) => task.status === 'DONE');
  });

  list() {
    this.httpClient.get<Task[]>(this.apiUrl).subscribe((data) => {
      this.#tasks.set(data);
    });
  }

  create(task: CreateTaskDto): Observable<Task> {
    return this.httpClient.post<Task>(this.apiUrl, task).pipe(tap(() => this.list()));
  }

  updateTask(taskId: number, task: UpdateTaskDto): Observable<Task> {
    return this.httpClient
      .patch<Task>(`${this.apiUrl}/${taskId}`, task)
      .pipe(tap(() => this.list()));
  }

  getTaskById(taskId: number): Observable<Task> {
    return this.httpClient.get<Task>(`${this.apiUrl}/${taskId}`);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${taskId}`).pipe(tap(() => this.list()));
  }


}
