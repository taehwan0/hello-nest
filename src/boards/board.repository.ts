import { DataSource, Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './board-status.enum';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../auth/user.entity';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(private datasource: DataSource) {
    super(Board, datasource.createEntityManager());
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = await this.create({
      title: title,
      description: description,
      status: BoardStatus.PUBLIC,
      user: user,
    });

    return await this.save(board);
  }

  async deleteBoardWithAuth(id: number, user: User): Promise<void> {
    const result = await this.createQueryBuilder('board')
      .delete()
      .where('userId = :userId', { userId: user.id })
      .andWhere('id = :id', { id: id })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`Not Found Board Id: ${id}`);
    }
  }
}
