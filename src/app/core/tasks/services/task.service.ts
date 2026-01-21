import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, tap } from 'rxjs';
import { CreateTaskDto, Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private httpClient: HttpClient = inject(HttpClient);
  private apiUrl: string = `${environment.apiUrl}/tasks`;

  #tasks = signal<Task[]>([]);
  tasks = this.#tasks.asReadonly();

  list() {
    this.httpClient.get<Task[]>(this.apiUrl).subscribe((data) => {
      this.#tasks.set(data);
    });
  }

  create(task: CreateTaskDto): Observable<Task> {
    return this.httpClient.post<Task>(this.apiUrl, task).pipe(tap(() => this.list()));
  }
}
