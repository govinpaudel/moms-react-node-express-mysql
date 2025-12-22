const Datasync = () => {


  return (
    <div className='container'>
      <div className="row">
        <div className="col">
          <input type="date" className='form-control' />
        </div>
        <div className="col">
          <button className='btn btn-primary'>डाटा डाउनलोड गर्नुहोस्</button>
        </div>
        <div className="col">
          <input type="text" placeholder='Ip Address' className='form-control' />
        </div>
        <div className="col">
          <button className='btn btn-info'>डाटा सेभ गर्नुहोस्</button>
        </div>
      </div>

    </div>
  )
}

export default Datasync
