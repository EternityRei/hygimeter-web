import  {Directive, ElementRef, Input} from "@angular/core";

@Directive({
  selector: '[appToMessageColor]'
})
export class SetMessageColorDirective{

  constructor(private element:ElementRef) {
  }

 @Input() set appToMessageColor (data:any){
    if (data){
      this.element.nativeElement.style.color = 'green';
    }else{
      this.element.nativeElement.style.color = 'red';
    }

  }
}
