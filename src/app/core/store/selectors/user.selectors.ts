import {IAppState} from '../state/app.state';

export const selectCurrentUser = (state: IAppState) => state?.user?.user;
export const selectCurrentRole= (state: IAppState) => state?.user?.user?.role;
