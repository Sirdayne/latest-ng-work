import { UserI } from '../../../models/user.interface';

export interface UserState {
  user: UserI;
}

export const initialUserState: UserState = {
  user: {} as UserI,
};
