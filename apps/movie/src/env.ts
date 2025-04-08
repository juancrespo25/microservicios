import { z } from "zod";
import dotenv from 'dotenv';
dotenv.config({ path: "./.env" });

const envSchema = z.object({
    PORT: z.coerce.number().default(3500),
    DB_HOST: z.string().default("localhost"),
    DB_PORT: z.coerce.number().default(3306),
    DB_USER: z.string().default("user"),
    DB_PASS: z.string().default("password"),
    DB_NAME: z.string().default("database"),
    RABBITMQ_HOST: z.string().default("localhost"),
    EXCHANGE_NAME: z.string().default("movie"),
    EXCHANGE_TYPE: z.enum(["topic", "direct", "fanout"]).default("fanout"),
    EXCHANGE_OPTIONS_DURABLE: z.coerce.boolean().default(true),
    ROUTING_KEY: z.string().default("movie"),
    KAFKA_BROKER: z.string().default("localhost:9092"),
    KAFKA_GROUP_ID: z.coerce.number().default(1000),
    KAFKA_TOPIC_MESSAGE: z.string().default("movie"),
    CLIENT_ID: z.string().default("movie")
});

type EnvSchema = z.infer<typeof envSchema>;

export const env: EnvSchema = envSchema.parse(process.env);