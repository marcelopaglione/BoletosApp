import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(tel, args) {

    if (!tel) {
      return '';
    }
    const value = tel.toString().trim().replace(/^\+/, '');

    if (value.match(/[^0-9]/)) {
      return tel;
    }
    let city, number;

    switch (value.length) {
      case 10:
        city = value.slice(0, 2);
        number = value.slice(2);
        number = number.slice(0, 4) + '-' + number.slice(4);
        break;

      case 11:
        city = value.slice(0, 2);
        number = value.slice(2);
        number = number.slice(0, 5) + '-' + number.slice(5);
        break;

      case 8:
        // city = value.slice(0, 2);
        // number = value.slice(2);
        number = value.slice(0, 4) + '-' + value.slice(4);
        break;

      case 9:
        // city = value.slice(0, 2);
        // number = value.slice(2);
        number = value.slice(0, 5) + '-' + value.slice(5);
        break;

      default:
        return tel;
    }
    if (!city) {
      return (number).trim();
    }
    return ('(' + city + ') ' + number).trim();
  }

}
