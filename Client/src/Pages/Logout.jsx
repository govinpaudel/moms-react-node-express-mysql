import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
const Logout = () => {
  const {logout} = useAuth();
  useEffect(() => {
    logout();
  }, []);

  return <div>Logout</div>;
};

export default Logout;
