import React from 'react';
import { NavLink } from 'react-router-dom';
import MainHeaderComponent from '../Components/MainHeaderComponent';
import "./Apphome.scss"

const AppHome = () => {
  return (
    <section className='apphome'>
        <MainHeaderComponent/>        
        <div className='apphome__list'>
            <div className='apphome__list__item'>
            <NavLink to={'/voucher'}>भौचर व्यवस्थापन प्रणाली</NavLink>
            </div>
            <div className='apphome__list__item'>
            <NavLink to={'/bargikaran'} >वर्गिकरण व्यवस्थापन प्रणाली</NavLink>
            </div>
            <div className='apphome__list__item'>
            <NavLink to={'/misil'}>मिसिल व्यवस्थापन प्रणाली</NavLink>
            </div>
        </div>
        <div className='apphome__list'>
            <div className='apphome__list__item'>
            <NavLink to={'/admin'}>एडमिन प्यानल</NavLink>
            </div>
            <div className='apphome__list__item'>
            <NavLink to={'/superadmin'} >सुपर एडमिन प्यानल</NavLink>
            </div>
            <div className='apphome__list__item'>
            <NavLink to={'/changepassword'} >पासर्वड परिवर्तन</NavLink>
            </div>
        </div>
        <div className='apphome__list'>
            <div className='apphome__list__item'>
            <NavLink to={'/logout'}>लगआउट</NavLink>
            </div>
            <div className='apphome__list__item'>
            <NavLink>   </NavLink>
            </div>
            <div className='apphome__list__item'>
            <NavLink>   </NavLink>
            </div>
        </div>
    </section>
  )
}

export default AppHome