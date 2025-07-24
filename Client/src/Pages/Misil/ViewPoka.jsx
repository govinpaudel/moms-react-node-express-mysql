import axiosInstance from '../../axiosInstance';
import  { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './ViewPoka.scss';
import { toast } from 'react-toastify';
import { Modal } from 'bootstrap';

const ViewPoka = () => {
    const location = useLocation();
    const [header, setheader] = useState([]);
    const [details, setdetails] = useState([]);
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    const initialdata = {
        id: 0,
        poka_id: location.state.id,
        miti: '',
        minum: '',
        nibedakname: '',
        nibedakaddress: '',
        jaggadhaniname: '',
        jaggadhaniaddress: '',
        created_by_user_id: loggedUser.id
    }
    const [misil, setmisil] = useState(initialdata);
    const Url = import.meta.env.VITE_API_URL + "Misil/";
    const modalRef = useRef(null);
    const modalInstanceRef = useRef(null);
    const openModal = () => {
        setmisil(initialdata);
        if (!modalInstanceRef.current) {
            modalInstanceRef.current = new Modal(modalRef.current);
        }
        modalInstanceRef.current.show();
    };
    const closeModal = () => {
        modalInstanceRef.current?.hide();
    };

    const loadHeaderData = async () => {
        const data = {
            id: location.state.id
        }
 const url="misil/getPokaById";
    const response=await axiosInstance.post(url,data)
        
        console.log(response);
        setheader(response.data.data[0]);
    }
    const loadPokaDetails = async () => {
        const data = {
            id: location.state.id
        }
        const url="misil/getPokaDetailsById";
        const response=await axiosInstance.post(url,data)
        
        console.log(response);
        setdetails(response.data.data);
    }


    const handleSumbit = async (e) => {
        e.preventDefault();
        console.log(misil);
        const url="misil/AddOrUpdateMisil";
        const response=await axiosInstance.post(url,data)        
        console.log(response);
        if (response.data.status == true) {
            toast.success(response.data.message);
            setmisil(initialdata);
            loadPokaDetails();
            loadHeaderData();
            closeModal();
        }
    }
    const handleChange = (e) => {
        setmisil({ ...misil, [e.target.name]: e.target.value })
        console.log(misil);
    }
    const changeFormat = (e) => {
        const x = e.target.value;
        const y = x.replaceAll('.', '-')
        const z = y.replaceAll('/', '-')
        setmisil({ ...misil, miti: z })
    }

    const handleEdit = async (e) => {
        openModal();
        console.log(e)
        const data = {
            id: e
        }
        const url="misil/getMisilById";
        const response=await axiosInstance.post(url,data);        
        console.log(response);
        setmisil(response.data.data[0])
    }
    const handleDelete = async (e) => {
        const yes = confirm("के तपाई यो मिसिल हटाउन चहानुहुन्छ ?")
        if (yes) {
            const data = {
                id: e,
                poka_id: location.state.id
            }
            const url="misil/deleteMisilById";
            const response=await axiosInstance.post(url,data);            
            console.log(response);
            if (response.data.status == true) {
                toast.success(response.data.message);
                loadHeaderData();
                loadPokaDetails();
            }
        }

    }
    useEffect(() => {
        loadHeaderData();
        loadPokaDetails();
    }, [])
    return (
        <section className='maindiv'>
            <div className="modal fade" ref={modalRef} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">मिसिल संशोधन तथा दर्ता फाराम</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <form onSubmit={handleSumbit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor='miti' className='label-control'>मिति</label>
                                    <input type="text" name='miti' className='form-control' onKeyUp={changeFormat} onChange={handleChange} value={misil.miti} required autoComplete='off' />
                                </div>
                                <div className="mb-3">
                                    <label className='label-control'>मिसिल नं</label>
                                    <input type="text" name='minum' className='form-control' onChange={handleChange} value={misil.minum} required autoComplete='off' />
                                </div>
                                <div className="mb-3">
                                    <label className='label-control'>निवेदकको नाम</label>
                                    <input type="text" name='nibedakname' className='form-control' onChange={handleChange} value={misil.nibedakname} required autoComplete='off' />
                                </div>
                                <div className="mb-3">
                                    <label className='label-control'>निवेदकको ठेगाना</label>
                                    <input type="text" name='nibedakaddress' className='form-control' onChange={handleChange} value={misil.nibedakaddress} required autoComplete='off' />
                                </div>
                                <div className="mb-3">
                                    <label className='label-control'>जग्गाधनीको नाम</label>
                                    <input type="text" name='jaggadhaniname' className='form-control' onChange={handleChange} value={misil.jaggadhaniname} required autoComplete='off' />
                                </div>
                                <div className="mb-3">
                                    <label className='label-control'>जग्गाधनीको ठेगाना</label>
                                    <input type="text" name='jaggadhaniaddress' className='form-control' onChange={handleChange} value={misil.jaggadhaniaddress} required autoComplete='off' />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <input type="submit" value="सेभ गर्नुहोस्" className='btn btn-primary' />
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">रद्द गर्नुहोस्</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col">
                    <h3 className='headertext'>आ.व:</h3>
                    <h3 className='headertext'>{header.aaba_name}</h3>
                </div>
                <div className="col">
                    <h3 className='headertext'>मिसिल प्रकार:</h3>
                    <h3 className='headertext'>{header.misil_type_name}</h3>
                </div>
                <div className="col">
                    <h3 className='headertext'>पोका नं: </h3>
                    <h3 className='headertext'>{header.misil_poka_name}</h3>
                </div>
                <div className="col">
                    <h3 className='headertext'>फाँट:</h3>
                    <h3 className='headertext'>{header.fant}</h3>
                </div>
                <div className="col">
                    <h3 className='headertext'>मिसिल संख्या:</h3>
                    <h3 className='headertext'>{header.misilcount}</h3>
                </div>
                <div className="col">
                    <h3 className='headertext'>प्रयोगकर्ता:</h3>
                    <h3 className='headertext'>{header.nepname}</h3>
                </div>
                <div className="col">
                    <h3 className='headertext'>कैफियत:</h3>
                    <h3 className='headertext'>{header.remarks}</h3>
                </div>
            </div>
            <div className="float-end no-print">
                <button className="btn btn-primary" onClick={openModal}>
                    <h3>(+) मिसिल थप गर्नुहोस्</h3>
                </button>
            </div>
            <div className='maindiv-row'>
                <table className='listvoucher__list__table'>
                    <thead><tr>
                        <th>मिति</th>
                        <th>मिसिल नं</th>
                        <th>निवेदकको नाम</th>
                        <th>निवेदकको ठेगाना</th>
                        <th>जग्गाधनीको नाम</th>
                        <th>जग्गाधनीको ठेगाना</th>
                        <th className='no-print'>कृयाकलाप</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            details ? details.map(
                                (item, i) => {
                                    return <tr key={i}>
                                        <td>{item.miti}</td>
                                        <td>{item.minum}</td>
                                        <td>{item.nibedakname}</td>
                                        <td>{item.nibedakaddress}</td>
                                        <td>{item.jaggadhaniname}</td>
                                        <td>{item.jaggadhaniaddress}</td>
                                        <td className='no-print'><button className='btnedit' onClick={
                                            () => {
                                                handleEdit(item.misil_id)
                                            }
                                        }>संशोधन</button>
                                            <button className='btndelete' onClick={
                                                () => { handleDelete(item.misil_id) }}>हटाउनुहोस्</button></td>
                                    </tr>
                                }
                            ) : null
                        }
                    </tbody>
                </table>
            </div>

        </section>

    )
}

export default ViewPoka