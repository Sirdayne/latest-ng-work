import {IAppState} from '../state/app.state';

export const selectCurrentUser = (state: IAppState) => state?.user?.user;
