import React from "react";
import "./MainHeaderComponent.scss";

const MainHeaderComponent = (props) => {
  const { headerText} = props;
  return (
    <div className="wrapper">
      <h2>{headerText}</h2>     
    </div>
  );
};

export default MainHeaderComponent;
