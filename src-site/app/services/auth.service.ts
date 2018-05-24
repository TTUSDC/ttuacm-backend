import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
// import { BehaviourSubject } from 'rxjs/BehaviourSubject';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
  private authToken: string = 'default';
  private user: object; // Change this to a behavior subject

  private signUpEP: string = 'http://localhost:80/users/register';
  private loginEP: string = 'http://localhost:80/users/login';
  private forgotEP: string = 'http://localhost:80/users/forgot';
  private resetEP: string = 'http://localhost:80/users/reset';
  private confirmationEP: string = 'http://localhost:80/users/confirmation';
  constructor(private http: HttpClient) { }

  private userObs = new BehaviorSubject<object>({});
  public currentUserObs = this.userObs.asObservable();

  private userEmail = new BehaviorSubject<string>(`No Email`);
  public currentEmail = this.userEmail.asObservable();

  public registerUser(newUser) {
    const headers = new HttpHeaders();
    headers.append('Content-type', 'application/json');

    // Add the map part
    const post = this.http.post(this.signUpEP, newUser, { headers: headers });

    return post;
  }

  // Allows the email to be sent around
  public setEmail(message: string): void {
    this.userEmail.next(message);
  }

  public setUser(user: object): void {
    this.userObs.next(user);
  }

  /**
   * This will attempt to login the user
   * @param existingUser A valid login attempt
   */
  public authenticateUser(existingUser): Observable<object> {
    const headers = new HttpHeaders();
    headers.append('Content-type', 'application/json');

    const post = this.http.post(this.loginEP, existingUser, { headers: headers });

    return post;
  }

  /**
   * Runs when the user logs in correctly
   * @param token The token given by the API
   * @param user The user that just logged in; similar to a session... I think
   */
  public storeUserData(token, user) {
    localStorage.setItem('id_token', token);

    this.authToken = token;
    this.user = user;
  }

  /**
   * Grabs the token from the local storage
   */
  public loadToken() {
    const token: string = localStorage.getItem('id_token');
    this.authToken = token;
  }

  private getToken() {
    this.loadToken();
    return this.authToken;
  }

  /**
   * Checks the local storage for an token and checks if it is a valid token
   * @returns {boolean} false if the token is valid, true if the token is not
   */
  public loggedIn() {
    return tokenNotExpired('id_token');
  }

  /**
   * Clears the local storage so that the JWT is no longer available until
   * they log in again
   */
  public logOut() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  /**
   * Sends to fogot login endpoint which accepts only an email in the body
   */
  public forgotUser(userEmail): Observable<object> {
    const headers = new HttpHeaders;
    headers.append(`Content-type`, `application/json`);

    const post = this.http.post(this.forgotEP, {email: userEmail}, { headers: headers });

    return post;
  }

  public sendConfirmation(email): Observable<object> {
    const headers = new HttpHeaders;
    headers.append(`Content-type`, `application/json`);

    const post: Observable<object> = this.http.post(this.confirmationEP, email, { headers: headers });

    return post;
  }

  public resetPassword(password): Observable<object> {
    const headers = new HttpHeaders;
    headers.append(`Content-type`, `application/json`);

    const endpoint = `${ this.resetEP }/${this.getToken().split(' ')[1]}`;
    const post = this.http.post(endpoint, password, {headers: headers});

    return post;
  }

}
