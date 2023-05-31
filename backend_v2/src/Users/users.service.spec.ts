import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import PrismaService from "../Prisma/prisma.service";

const testUser = {
	username: "Tester",
	email: "tester@tester.pl",
	password: "reallyhardpassword",
};

const dbTestUser = {
	...testUser,
	password: "hashedPassword",
	id: 1,
};

const db = {
	user: {
		create: jest.fn().mockResolvedValue(dbTestUser),
		findFirstOrThrow: jest.fn().mockResolvedValue(dbTestUser),
	},
};

describe("UsersService", () => {
	let service: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: PrismaService,
					useValue: db,
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it("should create and return user", async () => {
		expect(await service.create(testUser)).toStrictEqual(dbTestUser);
	});

	it("should return user when found", async () => {
		expect(await service.get(testUser.email)).toStrictEqual(dbTestUser);
	});
});
