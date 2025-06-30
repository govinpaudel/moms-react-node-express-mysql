import React from "react";
import "./MainHeaderComponent.scss";

const MainHeaderComponent = (props) => {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const { headerText} = props;
  return (
    <div className="wrapper no-print">
      <h2>{headerText}</h2>     
      <h3>{loggedUser?loggedUser.office_name:null}</h3>  
      {loggedUser && <h4>({loggedUser.state_name})</h4>}
    </div>
  );
};

export default MainHeaderComponent;
