import { JwtModule } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import PrismaService from "../Prisma/prisma.service";
import { AuthService } from "../Auth/auth.service";
import * as bcrypt from "bcrypt";

const testUser = {
	username: "tester",
	email: "tester@tester.pl",
	password: "testpassword",
};

const db = {
	user: {
		create: jest.fn().mockResolvedValue({
			...testUser,
			id: 1,
		}),
		findFirstOrThrow: jest.fn().mockResolvedValue({ ...testUser, id: 1 }),
	},
};

describe("UsersController (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				UsersService,
				{
					provide: PrismaService,
					useValue: db,
				},
				AuthService,
			],
			imports: [
				JwtModule.register({
					global: false,
					secret: "supersecret",
					signOptions: { expiresIn: "30s" },
				}),
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();
	});

	describe("/register (POST) route", () => {
		it("should return new user on success", async () => {
			const res = await request(app.getHttpServer())
				.post("/users/register")
				.send(testUser);
			expect(res.body).not.toHaveProperty("password");
			expect(res.body).toMatchObject({
				id: 1,
				username: testUser.username,
				email: testUser.email,
			});
		});
		it("should set cookie on success", async () => {
			const res = await request(app.getHttpServer())
				.post("/users/register")
				.send(testUser);
			expect(res.headers["set-cookie"][0]).toMatch(/token=[^]*;/);
		});
		it("should return validation error when request malformed", async () => {
			const res = await request(app.getHttpServer())
				.post("/users/register")
				.send({});
			expect(res.statusCode).toBe(400);
		});
		it("should return error when user already exists", async () => {
			jest.spyOn(db.user, "create").mockRejectedValueOnce("Already exists");
			const res = await request(app.getHttpServer())
				.post("/users/register")
				.send(testUser);
			expect(res.statusCode).toBe(409);
		});
	});
	describe("/login (POST) route", () => {
		it("should return user on success", async () => {
			// Typescript doesn`t infer types properly, "as never" solves this problem
			jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true as never);
			const res = await request(app.getHttpServer())
				.post("/users/login")
				.send({ email: testUser.email, password: testUser.password });
			expect(res.body).not.toHaveProperty("password");
			expect(res.body).toMatchObject({
				email: testUser.email,
				id: 1,
				username: testUser.username,
			});
		});
		it("should set cookie on success", async () => {
			jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true as never);
			const res = await request(app.getHttpServer())
				.post("/users/login")
				.send({ email: testUser.email, password: testUser.password });
			expect(res.headers["set-cookie"][0]).toMatch(/token=[^]*;/);
		});
		it("should return validation error on malformed request", async () => {
			const res = await request(app.getHttpServer())
				.post("/users/login")
				.send({});
			expect(res.statusCode).toBe(400);
		});
		it("should return error when user doesn`t exists", async () => {
			jest
				.spyOn(db.user, "findFirstOrThrow")
				.mockRejectedValueOnce(new Error());
			const res = await request(app.getHttpServer())
				.post("/users/login")
				.send({ email: testUser.email, password: testUser.password });
			expect(res.statusCode).toBe(401);
		});
		it("should return error when password is wrong", async () => {
			const res = await request(app.getHttpServer())
				.post("/users/login")
				.send({ email: testUser.email, password: "otherpassword" });
			expect(res.statusCode).toBe(401);
		});
	});
});
