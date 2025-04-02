import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    let user = sessionStorage.getItem("loggedUser");
    if (user) {
      sessionStorage.removeItem("loggedUser");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
    }
    navigate("/login");
  }, []);

  return <div>Logout</div>;
};

export default Logout;
