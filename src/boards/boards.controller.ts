import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipe/board-status-validation.pipe';
import { Board } from './board.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('boards')
@UseGuards(AuthGuard('jwt'))
export class BoardsController {
  private logger: Logger = new Logger('BoardsController');
  constructor(private readonly boardsService: BoardsService) {}

  @Get('/')
  getAllBoards(): Promise<Board[]> {
    this.logger.verbose('getAllBoards');
    return this.boardsService.getAllBoards();
  }

  @Get('/me')
  async getAllBoardsByMe(@GetUser() user: User): Promise<Board[]> {
    return await this.boardsService.getAllBoardsByMe(user);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Get('/:id')
  async getBoardById(@Param('id', ParseIntPipe) id: number): Promise<Board> {
    return await this.boardsService.getBoardById(id);
  }

  @Put('/:id/status')
  async updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ): Promise<Board> {
    return await this.boardsService.updateBoardStatus(id, status);
  }

  @Delete('/:id')
  async deleteBoardById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.boardsService.deleteBoard(id, user);
  }
}
