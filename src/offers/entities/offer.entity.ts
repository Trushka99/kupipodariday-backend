import { Entity, Column, ManyToOne } from "typeorm";
import { MainEntity } from "src/utils/MainEntity";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { IsNumber, IsBoolean } from "class-validator";

@Entity()
export class Offer extends MainEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @IsNumber()
  @Column({
    type: "numeric",
  })
  amount: number;

  @IsBoolean()
  @Column({
    default: false,
  })
  hidden: boolean;
}