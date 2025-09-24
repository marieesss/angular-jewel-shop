import { effect, Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay, tap } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private USERS_KEY = 'users';
  private PASSWORD_KEY = 'password';
  private currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();

  // Mock data - utilisateurs de test
  private mockedUsers: User[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Normal User',
      email: 'user@example.com',
      role: 'user',
      createdAt: new Date(),
    },
  ];

  // Mock data - mots de passe (en réalité, ils seraient hashés)
  private mockedPasswords: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com': 'user123',
  };

  private users: User[] = [];
  private passwords: Record<string, string> = {};

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  constructor() {
    effect(() => {
      // Vérifier s'il y a un utilisateur en session
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUser.set(JSON.parse(savedUser));
      }

      const savedUsers = localStorage.getItem(this.USERS_KEY);
      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
      } else {
        this.users = [...this.mockedUsers];
        localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));
      }

      const savedPasswords = localStorage.getItem(this.PASSWORD_KEY);
      if (savedPasswords) {
        this.passwords = JSON.parse(savedPasswords);
      } else {
        this.passwords = { ...this.mockedPasswords };
        localStorage.setItem(this.PASSWORD_KEY, JSON.stringify(this.passwords));
      }
    });
  }

  private saveUsers(): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));
    localStorage.setItem(this.PASSWORD_KEY, JSON.stringify(this.passwords));
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find(u => u.email === credentials.email);
    const password = this.passwords[credentials.email];

    if (user && password === credentials.password) {
      // Simuler un délai réseau
      return of(user).pipe(
        delay(500),
        tap(u => this.setCurrentUser(u))
      );
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    // Vérifier si l'email existe déjà
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    // Créer un nouvel utilisateur
    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name,
      email: userData.email,
      role: 'user',
      createdAt: new Date(),
    };

    // Ajouter aux mock data
    this.users.push(newUser);
    this.passwords[userData.email] = userData.password;

    this.saveUsers();

    // Simuler un délai réseau
    return of(newUser).pipe(delay(500));
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(300));
  }

  async getUserById(userId: number): Promise<User | null> {
    await this.delay(300);
    return this.users.find(u => u.id === userId) || null;
  }

  deleteUser(userId: number): Observable<void> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  getToken(): string | null {
    const user = this.currentUser();
    return user ? `mock-token-${user.id}` : null;
  }

  // Méthode pour définir l'utilisateur connecté (utilisée après login)
  setCurrentUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
