export interface UserModel {
  email: string;
  name?: string;
  password: string;

  perfil?: string;
  status?: string;

  roleId?: number;
  idUser?: number;
}
