import css from "./UserListComponent.module.css";
import picture_2x from "../../images/picture_2x.png";
import { ReactComponent as ReactLogo } from "../../svg/logo.svg";

export const UserListComponent = ({ userInfo, changeFollowing }) => {
  const { user, tweets, followers, avatar, id, isFollowing } = userInfo;
  return (
    <li key={id} className={css.card}>
      <ReactLogo className={css.logo} />
      <img src={picture_2x} alt="card background" />
      <div className={css.line}></div>
      <div className={css.ellipse}></div>
      <img src={avatar} alt={`${user} avatar`} className={css.avatar} />
      <div className={css.info}>
        <p>{tweets.toLocaleString()} TWEETS</p>
        <p>{followers.toLocaleString()} FOLLOWERS</p>
      </div>
      <button
        className={isFollowing ? css.buttonIsFollowing : css.button}
        onClick={() => changeFollowing(isFollowing, id, followers)}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </li>
  );
};
