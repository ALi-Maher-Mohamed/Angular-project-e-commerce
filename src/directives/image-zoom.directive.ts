import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appImageZoom]',
  standalone: true,
})
export class ImageZoomDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.el.nativeElement.style.transition = 'transform 0.3s ease';
    this.el.nativeElement.style.transform = 'scale(1.3)';
    this.el.nativeElement.style.zIndex = '10';
    this.el.nativeElement.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
    this.el.nativeElement.style.borderRadius = '8px';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.transition = 'transform 0.3s ease';
    this.el.nativeElement.style.transform = 'scale(1)';
    this.el.nativeElement.style.zIndex = '1';
    this.el.nativeElement.style.boxShadow = 'none';
  }
}
