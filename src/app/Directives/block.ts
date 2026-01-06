import {Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: "[appHighlight]",
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  }
})
export class DirectiveTest {
  private el = inject(ElementRef);

  onMouseEnter() {
    this.highlight('yellow');
  }

  onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
