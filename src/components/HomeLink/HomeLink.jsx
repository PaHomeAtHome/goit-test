import { Link } from "react-router-dom";
import css from "./HomeLink.module.css";

export const HomeLink = () => {
  return (
    <Link to={`/`} className={css.link}>
      BACK
    </Link>
  );
};
