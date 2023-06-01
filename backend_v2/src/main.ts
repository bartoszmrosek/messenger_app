import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import PrismaService from "./Prisma/prisma.service";

const CORS_OPTIONS = {
	credentials: true,
	origin:
		process.env.NODE_ENV === "development" ? "http://localhost:5173/" : "",
};

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(helmet());
	app.enableCors(CORS_OPTIONS);
	app.useGlobalPipes(new ValidationPipe());

	const prismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);

	await app.listen(3000);
}
bootstrap();
