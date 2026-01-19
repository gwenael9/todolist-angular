import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonModule, MenuModule, AvatarModule],
  template: `
    <header class="px-8 py-4">
      <div class="mx-auto flex justify-between items-center">
        <p-button routerLink="/" icon="pi pi-home" rounded outlined size="large"></p-button>
        <div class="flex gap-2">
          <p-button
            routerLink="/auth"
            icon="pi pi-user"
            styleClass="p-button-rounded p-button-outlined"
            size="large"
          ></p-button>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
