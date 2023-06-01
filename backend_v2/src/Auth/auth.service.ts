import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../Users/interfaces/user.interface";

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) {}

	async signToken(user: User) {
		const jwtPayload = {
			sub: user.id,
			username: user.username,
		};
		return {
			access_token: await this.jwtService.signAsync(jwtPayload),
		};
	}
}
