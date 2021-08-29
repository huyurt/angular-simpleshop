import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable, of} from "rxjs";
import {IUser, User} from "../shared/models/user";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser>(new User());
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {
  }

  loadCurrentUser(token: string): Observable<any> {
    if (token === null || token === '') {
      this.currentUserSource.next(new User());
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<IUser>(this.baseUrl + 'account', {headers})
      .pipe(
        map((user: IUser) => {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        })
      );
  }

  login(values: any) {
    return this.http.post<IUser>(this.baseUrl + 'account/login', values)
      .pipe(
        map((user: IUser) => {
          if (user) {
            localStorage.setItem('token', user.token);
            this.currentUserSource.next(user);
          }
        })
      );
  }

  register(values: any) {
    return this.http.post<IUser>(this.baseUrl + 'account/register', values)
      .pipe(
        map((user: IUser) => {
          localStorage.setItem('token', user.token);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(new User());
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }
}
