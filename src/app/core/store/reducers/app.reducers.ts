import {IAppState} from '../state/app.state';
import { ActionReducerMap } from '@ngrx/store';
import { userReducer } from './user.reducer';

export const appReducers: ActionReducerMap<IAppState, any> = {
  user: userReducer
};
