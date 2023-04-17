import css from "./Alert.module.css";

export const Alert = ({ children }) => {
  return <div className={css.alert}>{children}</div>;
};
