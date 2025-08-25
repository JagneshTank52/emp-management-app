import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteToHour'
})
export class MinuteToHourPipe implements PipeTransform {

  transform(value: number | null): string {
    console.log('Pipe input:', value); 

    if (!value && value !== 0) {
      return '0';
    }
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${paddedMinutes}`;
  }

}
