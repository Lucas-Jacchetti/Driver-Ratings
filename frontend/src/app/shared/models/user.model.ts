export interface UserSummaryDTO {
  id: string;
  name: string;
}

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  // TODO: campo ainda nao retornado pelo backend -- adicionado aqui so pra o front
  // (admin guard/sidebar) ja ficar pronto assim que as roles forem implementadas la.
  role?: 'Admin' | 'User';
}
