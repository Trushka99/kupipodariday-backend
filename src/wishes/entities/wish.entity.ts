import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { MainEntity } from 'src/utils/MainEntity';
import {
  IsString,
  IsUrl,
  Length,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class Wish extends MainEntity {
  @IsString()
  @Length(1, 250)
  @Column({
    type: 'varchar',
    length: 250,
  })
  name: string;

  @IsUrl()
  @IsString()
  @Column({
    type: 'text',
  })
  link: string;

  @IsUrl()
  @IsString()
  @Column({
    type: 'text',
  })
  image: string;

  @IsNumber()
  @Min(1)
  @Column({
    type: 'numeric',
  })
  price: number;

  @IsNumber()
  @Min(1)
  @Column({
    type: 'numeric',
    default: 0,
  })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @IsString()
  @Length(1, 1024)
  @Column({
    type: 'varchar',
    length: 1024,
  })
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  @IsArray()
  offers: Offer[];

  @IsNumber()
  @Column({
    type: 'integer',
    default: 0,
  })
  copied: number;
}
