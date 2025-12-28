import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    let user = localStorage.getItem("loggedUser");
    if (user) {
      localStorage.removeItem("loggedUser");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    navigate("/login");
  }, []);

  return <div>Logout</div>;
};

export default Logout;
