import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[onlyLetter]'
})
export class OnlyLetterDirective {

  @HostListener("keydown", ["$event"])
  OnlyAlphabetsAllowed(event:any) {

    var regex = new RegExp("^[A-Z\b ]");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }

    else {
      event.preventDefault();
      return false;
    }
  }

}
