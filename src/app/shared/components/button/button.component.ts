import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

type BtnSize = 'sm' | 'lg';
type BtnVariant = 'primary' | 'secondary' | 'outline';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="inline-flex items-center justify-center rounded-xl font-medium transition
             focus:outline-none focus:ring-2 focus:ring-offset-2
             disabled:opacity-60 disabled:cursor-not-allowed"
      [ngClass]="classes()"
      (click)="onClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() size: BtnSize = 'lg';
  @Input() variant: BtnVariant = 'primary';
  @Input() fullWidth = false;
  @Input() disabled?: boolean = false;
  @Output() clicked = new EventEmitter<MouseEvent>();

  classes = computed(() => {
    const base = [this.fullWidth ? 'w-full' : 'px-4'];

    const sizes: Record<BtnSize, string> = {
      sm: 'text-sm px-3 py-1.5',
      lg: 'text-base px-5 py-2.5',
    };

    const variants: Record<BtnVariant, string> = {
      primary: 'bg-pink-500 text-white hover:bg-purple-600 focus:bg-pink-500',
      secondary: 'bg-purple-500 text-white hover:bg-pink-600 focus:ring-purple-500',
      outline:
        'border border-gray-300 text-gray-900 bg-transparent hover:bg-gray-100 focus:ring-blue-500',
    };

    return [
      base.join(' '),
      sizes[this.size],
      variants[this.variant],
      this.disabled ? 'opacity-50 cursor-not-allowed' : '',
    ].join(' ');
  });

  onClick(ev: MouseEvent) {
    if (!this.disabled) {
      this.clicked.emit(ev);
    }
  }
}
