import { Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [ConfirmDialogModule],
  template: ` <p-confirmDialog [style]="{ width: '450px' }" /> `,
})
export class ConfirmModalComponent {}
