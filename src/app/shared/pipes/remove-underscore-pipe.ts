import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeUnderscore'
})
export class RemoveUnderscorePipe implements PipeTransform {

  transform(element: any, col: string): any {
    const dataKey = this.convertToPascalCase(col);
    const value = element[dataKey];
    return value;
  }

  private convertToPascalCase(str: string): string {
    return str.split('_').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  }
}


