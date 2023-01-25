import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class BoardsService {
  constructor(private boardRepository: BoardRepository) {}

  async getAllBoards(): Promise<Board[]> {
    return await this.boardRepository.find();
  }

  async getAllBoardsByMe(user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');

    query.where('board.userId = :userId', { userId: user.id });

    return query.getMany();
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    return await this.boardRepository.createBoard(createBoardDto, user);
  }

  async getBoardById(id: number): Promise<Board> {
    const board = await this.boardRepository.findOneById(id);

    if (!board) {
      throw new NotFoundException(`Not Found Board Id: ${id}`);
    }

    return board;
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);

    board.updateStatus(status);

    return await this.boardRepository.save(board);
  }

  async deleteBoard(id: number, user: User): Promise<void> {
    return await this.boardRepository.deleteBoardWithAuth(id, user);
  }
}
