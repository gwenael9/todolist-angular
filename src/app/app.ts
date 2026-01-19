import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="px-8 py-4">
      <h1 class="text-2xl">Hello World</h1>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class App {
  protected readonly title = signal('my-todo-app');
}