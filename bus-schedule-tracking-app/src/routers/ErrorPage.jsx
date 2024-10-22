import { useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>An error has occured.</h1>
      
      <h2>{error.statusText}</h2>  
      <h2>{error.message}</h2>
      
    </div>
  );
}