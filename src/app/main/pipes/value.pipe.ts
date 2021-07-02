import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'value'
})
export class ValuePipe implements PipeTransform {

  transform(object: any, key: string): any {
    return object[key];
  }

}
