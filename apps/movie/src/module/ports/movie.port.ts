import { Movie } from "../application/movie"

export type MoviePort = {
    save(movie: Movie):Promise<Movie>
    sendNotification(movie: Movie):Promise<void>
    receiveNotification(consumer: (message: any)=> void): Promise<void>
    getOne(movieId: string):Promise<Movie | null>
    getAll():Promise<Movie[]>
    getByPage(page: number, limit: number):Promise<{movies:Movie[], total:number}>
}