import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter';
import "./MainHeaderComponent.scss";
const edate = new Date().toISOString().slice(0, 10);
const ndate = adToBs(edate);


const MainHeaderComponent = (props) => {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const { headerText} = props;
  return (
    <div className="wrapper no-print">
      <h2>{headerText}</h2>
      <h2 className='nepali'>ई.संः{edate}</h2>     
      <h2 className='nepali'>बि.सं.{ndate}</h2>     
      <h3>{loggedUser?loggedUser.office_name:null}</h3>  
      {loggedUser && <h4>({loggedUser.state_name})</h4>}
    </div>
  );
};

export default MainHeaderComponent;
