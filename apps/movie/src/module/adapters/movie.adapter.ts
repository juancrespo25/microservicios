import { IsNull } from "typeorm";
import { DatabaseBootstrap, RabbitmqBootstrap } from "../../bootstrap";
import { Movie } from "../application";
import { MoviePort } from "../ports";
import { MovieEntity } from "./entities/movie.entity";
import { MovieDto } from "./dtos";
import type { ConsumeMessage } from "amqplib";
import { env } from '../../env';


export class MovieAdapter implements MoviePort {
    async save(movie: Movie): Promise<Movie> {

        const repository = DatabaseBootstrap.dataSource.getRepository(MovieEntity)

        const movieEntity = MovieDto.fromDomainToData(movie) as MovieEntity

        await repository.save(movieEntity);
        return movie;
    }


    async getOne(movieId: string): Promise<Movie | null> {
        const repository = DatabaseBootstrap.dataSource.getRepository(MovieEntity)

        const movieEntity = await repository.findOne({where: { movieId, deletedAt: IsNull() }, relations: ["actors"]});

        if (!movieEntity) {
            return null;
        }

        return MovieDto.fromDataToDomain(movieEntity) as Movie;
    }

    async getAll(): Promise<Movie[]> {
        const repository = DatabaseBootstrap.dataSource.getRepository(MovieEntity)

        const MovieEntities = await repository.find({where: {deletedAt: IsNull() }, relations: ["actors"]});

        return MovieDto.fromDataToDomain(MovieEntities) as Movie[];

    }
    async getByPage(page: number, limit: number): Promise<{ movies: Movie[]; total: number }> {
        const repository = DatabaseBootstrap.dataSource.getRepository(MovieEntity)

        const [MovieEntities, total] = await repository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            where: { deletedAt: IsNull() },
            relations: ["actors"],
        })

        const movies = MovieDto.fromDataToDomain(MovieEntities) as Movie[];

        return { movies, total };
    }

    sendNotification(movie: Movie):Promise<void>{
        const channel= RabbitmqBootstrap.channel;
        const exchangeName = "exchange-movie";
        const exchangeType = "fanout";
        const exchangeOptions = {
            durable: true,
        };
        const routingKey = "movie.created";
        const message = JSON.stringify(movie.properties);

        channel.assertExchange(exchangeName, exchangeType, exchangeOptions);
        channel.publish(exchangeName, routingKey, Buffer.from(message),{
            persistent: true
        });

        return;
    }

    async receiveNotification(consumer: (message: ConsumeMessage) => void) {

        const channel = RabbitmqBootstrap.channel;
        const exchangeName = env.EXCHANGE_NAME;
        const exchangeType = env.EXCHANGE_TYPE;
        const exchangeOptions = { durable: env.EXCHANGE_OPTIONS_DURABLE };
        const routingKey = env.ROUTING_KEY;

        channel.assertExchange(exchangeName, exchangeType, exchangeOptions);
        const queue = await channel.assertQueue("", { exclusive: true });

        await channel.bindQueue(queue.queue, exchangeName, routingKey);

        await channel.consume(queue.queue, consumer, { noAck: true })
    }

}