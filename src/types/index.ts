export interface Persona {
  id?: number;
  tipo_documento: string;
  documento: string;
  nombres: string;
  apellidos: string;
  hobbie: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: { name: string } | null;
}