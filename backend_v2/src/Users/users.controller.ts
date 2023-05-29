import {
	Body,
	Controller,
	HttpException,
	HttpStatus,
	Post,
	Res,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { Response } from "express";
import { AuthService } from "../Auth/auth.service";

@Controller("users")
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
	) {}
	@Post("register")
	async register(
		@Body() registerUserDto: RegisterUserDto,
		@Res({ passthrough: true }) response: Response,
	) {
		try {
			const registeredUser = await this.usersService.create(registerUserDto);
			const jwt = await this.authService.signToken(registeredUser);
			response.cookie("token", jwt.access_token);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password: _password, ...safeUser } = registeredUser;
			return safeUser;
		} catch (error) {
			throw new HttpException("User already exists", HttpStatus.CONFLICT);
		}
	}
}
