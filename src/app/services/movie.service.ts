import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment';

import { Movie } from '../models/movie.model';
import { Response } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly BASE_API = 'https://api.themoviedb.org/3';
  private readonly BASE_IMAGE_URI = 'https://image.tmdb.org/t/p/w500';
  private _movies = new Subject<Movie[]>();

  constructor(private http: HttpClient) {}

  searchMovies(query: string) {
    const params = new HttpParams()
      .set('api_key', environment.apiKey)
      .set('query', query);

    this.http
      .get<Response>(`${this.BASE_API}/search/movie`, {
        params
      })
      .subscribe(response => this._movies.next(response.results));
  }

  get movies() {
    return this._movies.asObservable();
  }

  getMovie(id: number): Observable<Movie> {
    const params = new HttpParams().set('api_key', environment.apiKey);

    return this.http.get<Movie>(`${this.BASE_API}/movie/${id}`, {
      params
    });
  }

  getPosterPath(movie: Movie): string {
    return this.BASE_IMAGE_URI + movie.poster_path;
  }
}