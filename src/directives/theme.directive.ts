import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTheme]',
  standalone: true,
})
export class ThemeDirective {
  @Input() isDark: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener('click')
  toggleTheme(): void {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }
}
