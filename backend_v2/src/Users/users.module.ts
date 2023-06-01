import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import PrismaService from "../Prisma/prisma.service";
import { AuthService } from "../Auth/auth.service";

@Module({
	controllers: [UsersController],
	providers: [UsersService, PrismaService, AuthService],
})
export class UsersModule {}
