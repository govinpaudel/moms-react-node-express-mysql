import React, { useState } from 'react'
import MinLandValue from './MinLandValue';
import './CalcMainPage.scss';
import { useNavigate } from 'react-router-dom';
import AddSubArea from './AddSubArea';
import DivideArea from './DivideArea';
const CalcMainPage = () => {
  const [tab,setTab]=useState(1)
  const navigate=useNavigate();
  return (
    <section className='CalcMainPage'>
      <div className="buttons">
        <button className='tabbutton' onClick={()=>{
        navigate('/apphome')
      }}>
        पछाडी जानुहोस्
      </button>
      <button className='tabbutton' onClick={()=>{
        setTab(1);
      }}>
        न्यूनतम मुल्य गणना
      </button>
      <button className='tabbutton' onClick={()=>{
        setTab(2);
      }}>
        क्षेत्रफल जोड घटाउ
      </button> 
      <button className='tabbutton' onClick={()=>{
        setTab(3);
      }}>
        क्षेत्रफल भाग लगाउनुहोस्
      </button>      
      </div>
    <div className="pages">
    { tab==1 ? <MinLandValue/>:null } 
    { tab==2 ? <AddSubArea/>:null } 
    { tab==3 ? <DivideArea/>:null } 
    </div>
    </section>
  )
}

export default CalcMainPage