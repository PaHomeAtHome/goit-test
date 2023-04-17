import { Link } from "react-router-dom";
import css from "./Home.module.css";

export const Home = () => {
  return (
    <div className={css.home}>
      <Link to={`/tweets`} className={css.link}>
        TWEETS
      </Link>
    </div>
  );
};
