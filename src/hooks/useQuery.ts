import queryString from "query-string";
import { useLocation } from "react-router-dom";

export function useQuery() {
  const location = useLocation();

  const urlObject = queryString.parseUrl(location.pathname + location.search);
  console.log(urlObject);
}
