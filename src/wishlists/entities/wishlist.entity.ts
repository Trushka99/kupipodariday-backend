import { Entity, ManyToOne, Column } from 'typeorm';
import { MainEntity } from 'src/utils/MainEntity';
import { User } from 'src/users/entities/user.entity';
import { IsArray, IsString, IsUrl, Length } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
@Entity()
export class Wishlist extends MainEntity {
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @IsString()
  @Length(1, 250)
  @Column({
    type: 'varchar',
    length: 250,
  })
  name: string;

  @IsString()
  @Length(1500)
  @Column({
    type: 'varchar',
    length: 1500,
    nullable: true,
  })
  description: string;

  @IsUrl()
  @IsString()
  @Column()
  image: string;

  @IsArray()
  @Column({
    type: 'simple-array',
    default: [],
  })
  items: Wish[];
}
