import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL as string;

const adapter = new PrismaPg({ connectionString });
const prismaClient = new PrismaClient({ adapter });

export default prismaClient;
