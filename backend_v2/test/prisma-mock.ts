import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import Prisma from "../prisma/PrismaClient";

jest.mock("../prisma/PrismaClient", () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
	mockReset(prismaMock);
});

export const prismaMock = Prisma as unknown as DeepMockProxy<PrismaClient>;
