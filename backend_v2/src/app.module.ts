import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./Users/users.module";

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "6h" },
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
