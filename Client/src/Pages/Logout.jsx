import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
const Logout = () => {
  const navigate=useNavigate();
  const {logout} = useAuth();
  useEffect(() => {
    logout();
    navigate("/login", { replace: true });
  }, []);

  return <div>Logout</div>;
};

export default Logout;
