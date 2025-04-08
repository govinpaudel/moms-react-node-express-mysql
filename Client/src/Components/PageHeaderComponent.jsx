import React from "react";
import "./PageHeaderComponent.scss";

const PageHeaderComponent = (props) => {
  const { officeText,headerText, icon } = props;
  return (
    <div className="wrapper">
      <h4>{officeText}</h4>
      <h2>{headerText}</h2>
      <span className="no-print">{icon}</span>
    </div>
  );
};

export default PageHeaderComponent;
