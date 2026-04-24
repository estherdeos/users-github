import { IUser } from './user.model';

export interface ISearchUsers {
  items: IUser[];
  total_count: number;
}
