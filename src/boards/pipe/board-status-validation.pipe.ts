import { BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../board-status.enum';

export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];
  transform(value: any): any {
    const status = value.toUpperCase();

    this.validateStatus(status);

    return value;
  }

  validateStatus(status: any): void {
    const index = this.StatusOptions.indexOf(status);

    if (index === -1) {
      throw new BadRequestException();
    }
  }
}
