import { Injectable } from "@nestjs/common";
import PrismaService from "../Prisma/prisma.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async create(newUser: RegisterUserDto) {
		const HASH_SALT = 10;
		const hashPassword = await bcrypt.hash(newUser.password, HASH_SALT);

		return this.prisma.user.create({
			data: {
				username: newUser.username,
				email: newUser.email,
				password: hashPassword,
			},
		});
	}

	async get(email: string) {
		return this.prisma.user.findFirstOrThrow({
			where: {
				email,
			},
		});
	}
}
