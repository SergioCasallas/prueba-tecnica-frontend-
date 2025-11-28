export interface Persona {
  id?: number;
  tipoDocumento: string;
  documento: string;
  nombres: string;
  apellidos: string;
  hobbie: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: { name: string } | null;
}