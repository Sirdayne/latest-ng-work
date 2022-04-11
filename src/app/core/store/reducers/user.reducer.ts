import {Action, createReducer, on} from '@ngrx/store';
import { initialUserState, UserState } from '../state/user.state';
import { clearUser, setUser } from '../actions/user.actions';


const reducer = createReducer(
  initialUserState,
  on(setUser, (state, payload) => ({...state, user: payload.user })),
  on(clearUser, (state, payload) => initialUserState),
);

export function userReducer(state: UserState | undefined , action: Action) {
  return reducer(state, action);
}
