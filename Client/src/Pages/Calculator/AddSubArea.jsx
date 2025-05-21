import { useState, useEffect } from 'react';
import './AddSubArea.scss'
import { ropaniToDaam } from '../../Utils/ropaniToDaam';
import { daamToRopani } from '../../Utils/daamToRopani';

const AddSubArea = () => {
    const initialdata = { area: '', unit: 0 };
    const [adata, setadata] = useState(initialdata);
    const [sdata, setsdata] = useState(initialdata);
    const [addData, setAddData] = useState();
    const [subData, setSubData] = useState();
    const [jondetotal, setjodnetotal] = useState(0)
    const [ghataunetotal, setghataunetotal] = useState(0)
    const [diff,setDiff]=useState(0);

    const changeadata = (e) => {
        const x = e.target.value;
        console.log('x', x);
        const y = x.replaceAll(".", "-");
        setadata({ ...adata, area: y });
    }
    const changesdata = (e) => {
        const x = e.target.value;
        console.log('x', x);
        const y = x.replaceAll(".", "-");
        setsdata({ ...sdata, area: y });
    }
    const handleaChange = (e) => {
        setadata({ ...adata, [e.target.name]: e.target.value })
    }
    const handlesChange = (e) => {
        setsdata({ ...sdata, [e.target.name]: e.target.value })
    }
    const handleAdd = (e) => {
        e.preventDefault();
        var x = [];
        if (localStorage.getItem('adddata')) {
            x = JSON.parse(localStorage.getItem('adddata'));
        }
        console.log(x);
        x.push(adata);
        console.log(x);
        localStorage.setItem('adddata', JSON.stringify(x));
        loadStorageData();
        setadata(initialdata);
        sumdata();
    }
    const handleSub = (e) => {
        e.preventDefault();
        var x = [];
        if (localStorage.getItem('subdata')) {
            x = JSON.parse(localStorage.getItem('subdata'));
        }
        console.log(x);
        x.push(sdata);
        console.log(x);
        localStorage.setItem('subdata', JSON.stringify(x));
        loadStorageData();
        setsdata(initialdata);
        sumdata();
    }
    const loadStorageData = () => {
        setAddData(JSON.parse(localStorage.getItem('adddata')));
        setSubData(JSON.parse(localStorage.getItem('subdata')));
    }
    useEffect(() => {
        loadStorageData();
    }, [])
    useEffect(() => {
        const tot = ropaniToDaam(adata.area);
        setadata({ ...adata, areaunits: tot });
    }, [adata.area])

    useEffect(() => {
        sumdata();
    }, [addData, subData])

    useEffect(() => {
        const tot = ropaniToDaam(sdata.area);
        setsdata({ ...sdata, areaunits: tot });
    }, [sdata.area])

    const clearadddata = () => {
        const confirm = window.confirm('के तपाई सबै डाटा हटाउन चाहानु हुन्छ ?')
        if (confirm) {
            localStorage.removeItem('adddata');
            loadStorageData();
        }
    }
    const clearsubdata = () => {
        const confirm = window.confirm('के तपाई सबै डाटा हटाउन चाहानु हुन्छ ?')
        if (confirm) {
            localStorage.removeItem('subdata');
            loadStorageData();

        }
    }
    const sumdata = () => {
        var x = 0;
        var y = 0;
        if (addData) {
            addData.forEach((a) => {
                x = x + a.areaunits
                console.log("jodne data", a);
            })
        }
        if (subData) {
            subData.forEach((a) => {
                y = y + a.areaunits
            })
        }
        setjodnetotal(x);
        setghataunetotal(y);
        setDiff(x-y);
    }
    return (
        <section className='addsubarea'>
            <div className="add">
                <h1 className='heading'>जोड्ने क्षेत्रफल</h1>
                <form onSubmit={handleAdd}>
                    <table className='listvoucher__list__table'><thead><tr><th>रो.आ.पै.दा</th><th>कृयाकलाप</th></tr></thead>
                        <tbody>

                            <tr>
                                <td>
                                    <input type="text" name="area" onKeyUp={changeadata} className="form-input" onChange={handleaChange} value={adata.area} required />
                                </td>
                                <td> <input type="submit" value="सेभ गर्नुहोस्" className='button small' /><button onClick={clearadddata} className='button small'>डाटा हटाउनुहोस्</button></td></tr>

                        </tbody></table>
                </form>
                <table className='listvoucher__list__table'><thead><tr><th>रो.आ.पै.दा</th></tr></thead>
                    <tbody>
                        {addData ? addData.map((item, i) => {
                            return <tr key={i}><td>{item.area}</td></tr>
                        }) : null}
                        <tr><td>जम्मा :</td> <td>{daamToRopani(jondetotal)}</td></tr>
                    </tbody>
                </table>
                <h1 className='heading'>बाँकी क्षेत्रफल: {daamToRopani(diff)}</h1>

            </div>
            <div className="sub">
                <h1 className='heading'>घटाउने क्षेत्रफल</h1>
                <form onSubmit={handleSub}>
                    <table className='listvoucher__list__table'><thead><tr><th>रो.आ.पै.दा</th><th>कृयाकलाप</th></tr></thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input type="text" name="area" onKeyUp={changesdata} className="form-input" onChange={handlesChange} value={sdata.area} required />
                                </td>
                                <td> <input type="submit" value="सेभ गर्नुहोस्" className='button small' /><button onClick={clearsubdata} className='button small'>डाटा हटाउनुहोस्</button></td></tr>

                        </tbody></table>
                </form>
                <table className='listvoucher__list__table'><thead><tr><th>रो.आ.पै.दा</th></tr></thead>
                    <tbody>
                        {subData ? subData.map((item, i) => {
                            return <tr key={i}><td>{item.area}</td></tr>
                        }) : null}
                        <tr><td>जम्मा :</td> <td>{daamToRopani(ghataunetotal)}</td></tr>
                    </tbody>
                </table>

            </div>
        </section>
    )
}

export default AddSubArea