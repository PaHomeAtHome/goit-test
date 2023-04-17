import { UserListComponent } from "../UserListComponent/UserListComponent";
import css from "./UserList.module.css";

export const UserList = ({ users, changeFollowing }) => {
  return (
    <ul className={css.list}>
      {users.map((userInfo) => (
        <UserListComponent
          key={userInfo.id}
          userInfo={userInfo}
          changeFollowing={changeFollowing}
        />
      ))}
    </ul>
  );
};
