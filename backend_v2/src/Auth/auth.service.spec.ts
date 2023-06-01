import { JwtModule } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";

const testUser = {
	id: 1,
	username: "tester",
	password: "pass",
	email: "tester@tester.pl",
};

describe("AuthService", () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({
					global: false,
					secret: "supersecret",
					signOptions: { expiresIn: "30s" },
				}),
			],
			providers: [AuthService],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});
	it("should return access token when called", async () => {
		expect(await service.signToken(testUser)).toHaveProperty("access_token");
	});
});
