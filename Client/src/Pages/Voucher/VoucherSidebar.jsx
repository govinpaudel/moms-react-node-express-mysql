import { NavLink } from "react-router-dom";
import "./VoucherSidebar.scss";
import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";

const VoucherSidebar = () => {
  const loggedUser = JSON.parse(localStorage?.getItem("loggedUser"));
  const [data, setdata] = useState([])
  const { axiosInstance } = useAuth();
  const loadsidebardata = async () => {
    const data = {
      user_id: loggedUser.id,
      module: 'Voucher'
    }
    console.log("getting sidebar list", data)
    const response = await axiosInstance.post("/getSidebarlist", data);
    console.log('Resultcame', response)
    setdata(response.data.data);

  }


  useEffect(() => {
    loadsidebardata();
  }, [])

  return (
    <section id="sidebar" className="sidebar no-print">
      <div className="sidebar__menus">
        <h5 className="sidebar__menus__menu-text">{loggedUser.role_name}</h5>
        <h6 className="sidebar__menus__menu-text">( {loggedUser.username} )</h6>
        <ul>
          <li>
            <NavLink to={'/apphome'}>पछाडि जानुहोस्</NavLink>
          </li>
          {data ? data.map((item, i) => {
            return (
              <li key={i}>
                <NavLink to={item.path}>{item.name}</NavLink>
              </li>
            );
          }) : null}

          <li >
            <NavLink to={"/logout"}>लगआउट</NavLink>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default VoucherSidebar;
