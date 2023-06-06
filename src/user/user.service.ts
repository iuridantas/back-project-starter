import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import { Exception } from 'src/utils/exceptions/exception';
import { Exceptions } from 'src/utils/exceptions/exceptionsHelper';

import {
  isValidCPF,
  isValidEmail,
  isValidPassword,
} from '../utils/validations/validations';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkEmailAvailability(email: string): Promise<void> {
    const isEmailAlreadyRegistered = await this.prisma.user.findFirst({
      where: { email },
    });
    if (isEmailAlreadyRegistered) {
      throw new Exception(
        Exceptions.InvalidData,
        'O e-mail fornecido já está cadastrado',
      );
    }
  }

  private async checkCPFAvailability(cpf: string): Promise<void> {
    const isCPFAlreadyRegistered = await this.prisma.user.findFirst({
      where: { cpf },
    });
    if (isCPFAlreadyRegistered) {
      throw new Exception(
        Exceptions.InvalidData,
        'O CPF fornecido já está cadastrado',
      );
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userEntity = { ...createUserDto, id: randomUUID() };

      if (!isValidPassword(createUserDto.password)) {
        throw new Exception(
          Exceptions.InvalidData,
          'Sua senha deve conter 8 dígitos ou mais, incluindo letras maiúsculas, minúsculas, números e caracteres especiais',
        );
      }

      if (!isValidEmail(createUserDto.email)) {
        throw new Exception(
          Exceptions.InvalidData,
          'O email fornecido é inválido',
        );
      }

      if (!isValidCPF(createUserDto.cpf)) {
        throw new Exception(
          Exceptions.InvalidData,
          'O CPF fornecido é inválido',
        );
      }

      await this.checkEmailAvailability(createUserDto.email);
      await this.checkCPFAvailability(createUserDto.cpf);

      const hashed = await bcrypt.hash(createUserDto.password, 12);
      userEntity.password = hashed;

      const createdUser = await this.prisma.user.create({ data: userEntity });
      delete createdUser.password;
      return createdUser;
    } catch (err) {
      throw new Exception(
        Exceptions.DatabaseException,
        'cpf ou email já cadastrados',
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const foundUser = await this.prisma.user.findUnique({ where: { id } });
      const { password, ...userWithoutPassword } = foundUser;
      return userWithoutPassword;
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.password) {
        const hashedPassword = await bcrypt.hash(updateUserDto.password, 12);
        const userToUpdate = { ...updateUserDto, password: hashedPassword };
        const updatedUser = await this.prisma.user.update({
          where: { id: userToUpdate.id },
          data: userToUpdate,
        });
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: updateUserDto.id },
        data: updateUserDto,
      });
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return 'Usuário excluido com sucesso';
    } catch (err) {
      throw new Exception(
        Exceptions.DatabaseException,
        'Usuário não encontrado',
      );
    }
  }
}
