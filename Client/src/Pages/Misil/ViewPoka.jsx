import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ViewPoka.scss';

const ViewPoka = () => {
    const location = useLocation();
    const [header, setheader] = useState([]);
    const Url = import.meta.env.VITE_API_URL + "Misil/";
    const loadHeaderData = async () => {
        const data = {
            id: location.state.id
        }
        const response = await axios({
            method: 'post',
            url: Url + 'getPokaById',
            data: data
        })
        console.log(response);
        setheader(response.data.data[0]);

    }

    useEffect(() => {
        loadHeaderData();
    }, [])
    return (
        <section>
            <div className='bg-amber-600'>
            <div>
            <h3 className='text-amber-300 text-2xl'>आ.व.</h3>
                <h3 className='text-amber-300'>{header.aaba_name}</h3>                
            </div>
            <div>
            <h3 className='text-amber-300 text-2xl'>पोका नं</h3>
                <h3 className='text-amber-300'>{header.misil_poka_name}</h3>                
            </div>
            <div>
            <h3 className='text-amber-300 text-2xl'>फाँट </h3>
                <h3 className='text-amber-300'>{header.fant}</h3>                
            </div>
            <div>
            <h3 className='text-amber-300 text-2xl'>प्रयोगकर्ता</h3>
                <h3 className='text-amber-300'>{header.nepname}</h3>                
            </div>
            <div>
            <h3 className='text-amber-300 text-2xl'>कैफियत</h3>
                <h3 className='text-amber-300'>{header.remarks}</h3>                
            </div>
            </div>
            
        </section>

    )
}

export default ViewPoka