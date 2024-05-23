import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}
  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const { itemsId } = createWishlistDto;
    const items = itemsId.map((item): Wish | { id: number } => ({
      id: item,
    }));
    const wishList = new Wishlist();
    for (const key in createWishlistDto) {
      wishList[key] = createWishlistDto[key];
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    const wishes = await this.wishRepository.find({
      where: items,
    });
    wishList.owner = user;
    wishList.items = wishes;
    return this.wishlistRepository.save(wishList);
  }

  getAllWishlists() {
    return this.wishlistRepository.find();
  }

  getWishListById(id: number) {
    return this.wishlistRepository.findOne({
      where: {
        id,
      },
    });
  }
}
