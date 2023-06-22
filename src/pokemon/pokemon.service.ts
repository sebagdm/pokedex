import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagitnation.dto';

@Injectable()
export class PokemonService {

  private defaultLimit: number;
  constructor(@InjectModel(Pokemon.name)
  private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,) {
    //revisar linea si se utilizar this
    this.defaultLimit = this.configService.get<number>("defaultLimit")

  }
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon
    } catch (error) {
      this.handleException(error)
    }

  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1
      })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name or no "${term} not Found"`)
    }
    return pokemon

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    /* updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
    console.log(updatePokemonDto.name) */
    const pokemon = await this.findOne(term)
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase()

    try {
      await pokemon.updateOne(updatePokemonDto)
      return { ...pokemon.toJSON(), ...updatePokemonDto }
    } catch (error) {
      this.handleException(error)

    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id} not found"`)
    }
    return
  }

  private handleException(error: any) {
    const { code, keyValue } = error
    if (code === 11000) {
      throw new BadRequestException(`Pokemon exsist in db ${JSON.stringify(keyValue)}`)
    }
    console.log(error)
    throw new InternalServerErrorException(`can't update pokemon - check server log`)

  }
}
