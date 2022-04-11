import {createAction, props} from '@ngrx/store';
import { UserI } from '../../../models/user.interface';

export const clearUser = createAction(
  '[User] Clear State'
);

export const setUser = createAction(
  '[User] Update user',
  props<{ user: UserI }>()
);

