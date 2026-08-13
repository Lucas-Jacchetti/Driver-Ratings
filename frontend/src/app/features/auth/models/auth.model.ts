import { UserResponseDTO } from '../../../shared/models/user.model';

export interface GoogleLoginRequest {
  idToken: string;
}

export interface AuthResponseDTO {
  token: string;
  user: UserResponseDTO;
}
