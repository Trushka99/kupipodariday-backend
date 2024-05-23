import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}
  async create(createOfferDto: CreateOfferDto, userId: number) {
    const { itemId, amount } = createOfferDto;
    const offer = new Offer();
    for (const key in createOfferDto) {
      offer[key] = createOfferDto[key];
    }
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const wish = await this.wishRepository.findOneBy({ id: itemId });
    if (!wish) throw new BadRequestException('Нет подарка с таким id');
    const isHasWish = user.wishes.some((item) => item.id === wish.id);
    if (!isHasWish) {
      offer.user = user;
      offer.item = wish;
      wish.raised = Number(wish.raised) + amount;
      if (wish.raised > wish.price)
        throw new BadRequestException('Cумма превышает необходимую');
      await this.wishRepository.save(wish);
      return this.offerRepository.save(offer);
    }
    throw new BadRequestException('На свои подарки не скидываемся');
  }

  getAllOffers() {
    return this.offerRepository.find();
  }

  findOne(id: number) {
    return this.offerRepository.findOneBy({ id });
  }
}
