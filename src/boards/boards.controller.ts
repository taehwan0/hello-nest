import { Controller, Get, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get('/')
  getAllBoards() {
    return this.boardsService.getAllBoards();
  }
}
