import React from "react";
import "./MainHeaderComponent.scss";

const MainHeaderComponent = (props) => {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const { headerText} = props;
  return (
    <div className="wrapper">
      <h2>{headerText}</h2>     
      <h3>{loggedUser?loggedUser.office_name:null}</h3>  
      <h4>({loggedUser?loggedUser.state_name:null})</h4>  
    </div>
  );
};

export default MainHeaderComponent;
