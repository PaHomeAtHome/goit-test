import { useRouteError } from "react-router-dom";
import { Alert } from "../Alert/Alert";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <Alert>{error.statusText || error.message}</Alert>
    </div>
  );
}
