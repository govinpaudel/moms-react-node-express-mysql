import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.scss";
import { toast } from "react-toastify";
import MainHeaderComponent from "../Components/MainHeaderComponent";
const Login = () => {
  const initialdata={
    username:"",
    password:"",
    aabaid:0
  }
  const [aabas, setaabas] = useState([]);
  const [defaaba, setdefaaba] = useState();
  const [formData,setFormData]=useState(initialdata);
  const Url = import.meta.env.VITE_API_URL + "auth/";
  const loggedUser = sessionStorage.getItem("loggedUser");
  const navigate = useNavigate();

  const handleChange=(e)=>{    
    if(e.target.name==='aabaid'){
      setdefaaba(e.target.value);
    }
    setFormData({...formData,[e.target.name]:e.target.value});   
  }

  const OnSubmit = async (e) => {
    e.preventDefault();   
    if (formData.username.length == 0 || formData.password.length == 0) {
      toast.warning("Please fill the form");
      return;
    }
    try {     
      console.log("Data Sent to server",formData);
      const response = await axios({
        method: "post",
        url: Url + "login",
        data: formData,
      });
      console.log("response",response);
      if (response.data.status == true) {
        let data1={...response.data.data,"aabaid":defaaba}   
        console.log("data1",data1)            
        sessionStorage.setItem("access_token", JSON.stringify(response.data.access_token));
        sessionStorage.setItem("refresh_token", JSON.stringify(response.data.refresh_token));
        sessionStorage.setItem("loggedUser", JSON.stringify(data1));
        toast.success(response.data.message);
        navigate("/apphome");
      } else {
        console.log("data",response.data.status)
        toast.warning(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.warning(error.response?.data.message);
    }
  };

  const loadAabas = async () => {
    try {
      const response = await axios({
        method: "get",
        url: Url + "getAllAabas",        
      });
      // console.log(response);
      setaabas(response.data.data);
    } catch (error) {
      toast.loading('Waiting for Database connection',error);
      console.log(error);
    }
  };
  const checkLogin = () => {
    if (loggedUser) {
      navigate("/apphome");
    }
  };

  const loadDefaaba=()=>{
    if(aabas){
    aabas.forEach((item) => {
      item.is_current == 1 ? setdefaaba(item.id): null;
    });    
  }
  }; 
  

  useEffect(() => {   
    document.title = "MOMS | प्रयोगकर्ता लगईन";
    loadAabas();
    loadDefaaba();
    checkLogin();
  }, []);

  useEffect(() => {
    if(aabas){
    aabas.forEach((item) => {
      item.is_current == 1 ? setdefaaba(item.id) : null;
    });
  }
    formData.aabaid=defaaba;
  }, [aabas]);
  return (  
    <section id="login" className="login">
      <MainHeaderComponent headerText="मालपोत कार्यालय व्यवस्थापन प्रणाली"/>
      <div className="login__form-outer">
        <h5 className="login__form-outer__header-text">लगईन फाराम</h5>
        <form className="login__form-inner" onSubmit={OnSubmit}>
          <div className="login__form-inner__item">
            <input
              className="login__form-inner__item__input"
              type="text"
              name="username"
              autoComplete="off"
              placeholder="प्रयोगकर्ताको नाम"
              required
              onChange={handleChange}
            />
          </div>
          <div className="login__form-inner__item">
            <input
              className="login__form-inner__item__input"
              type="password"
              name="password"
              autoComplete="off"
              placeholder="पासवर्ड"
              required
              onChange={handleChange}
            />
          </div>
          <div className="login__form-inner__item">
            <select onChange={handleChange}
              className="login__form-inner__item__input"
              name="aabaid"
              value={defaaba}
            >
              {aabas
                ? aabas.map((data) => {
                    return (
                      <option key={data.id} value={data.id}>
                        {data.aaba_name}
                      </option>
                    );
                  })
                : null}
            </select>
          </div>
          <div className="login__form-inner__item">
            <input
              type="submit"
              value="लगईन गर्नुहोस्"
              className="login__form-inner__item__button"
            />
          </div>
        </form>

        <h5 className="login__form-outer__footer-text">
          <Link to="/register">प्रयोगकर्ता होईन ? कृपया रजिष्टर गर्नुहोस्</Link>
        </h5>
        <h5 className="login__form-outer__footer-text">
          <Link to="/resetpassword">पासवर्ड बिर्सनुभयो ? कृपया रिसेट गर्नुहोस्</Link>
        </h5>
      </div>
    </section>
  );
};

export default Login;
