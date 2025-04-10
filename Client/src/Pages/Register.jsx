import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.scss";
import { toast } from "react-toastify";
import MainHeaderComponent from "../Components/MainHeaderComponent";

const Register = () => {
  const navigate = useNavigate();
  const Url = import.meta.env.VITE_API_URL + "auth/";
  console.log("url came", Url);
  const [offices, setOffices] = useState([{}]);
  const loadOffices = async () => {
    try {
      const response = await axios({
        method: "get",
        url: Url + "getAllOffices",        
      });
      setOffices(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const OnSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data= Object.fromEntries(formData);
    console.log(data);
    if (
      data.contactno.length == 0 ||
      data.email.length == 0 ||
      data.password.length == 0 ||
      data.confirmpassword.length == 0 ||
      data.officeid.length == 0
    ) {
      toast.warning("Please fill the form");
      return;
    }
    if (data.password != data.confirmpassword) {
      toast.warning("password and confirm password doesnot match");
      return;
    }
    try {
      const response = await axios({
        method: "post",
        url: Url + "register",
        data: data,
      });
      if (response.data.status == true) {
        toast.success(response.data.message);
        navigate("/home");
      } else {
        toast.warning(response.data.message);
        console.log(response);
      }
    } catch (error) {
      toast.warning(error);
    }
  };
  useEffect(() => {
    document.title = "MOMS | रजिष्ट्रेशन फाराम";
    loadOffices();
  }, []);
  return (
    <section id="register" className="register">
      <MainHeaderComponent headerText="मालपोत कार्यालय व्यवस्थापन प्रणाली"/>
      <div className="register__form-outer">
        <h5 className="register__form-outer__header-text">रजिष्ट्रेशन फाराम</h5>
        <form className="register__form-inner" onSubmit={OnSubmit}>
          <div className="register__form-inner__div">
          <div className="register__form-inner__div__item">
            <input
              className="register__form-inner__div__item__input"
              type="username"
              name="username"
              autoComplete="off"
              placeholder="username"
              required
            />
          </div>     
          <div className="register__form-inner__div__item">
            <input
              className="register__form-inner__div__item__input"
              type="email"
              name="email"
              autoComplete="off"
              placeholder="email"
              required
            />
          </div>
          <div className="register__form-inner__div__item">
            <input
              className="register__form-inner__div__item__input"
              type="text"
              name="engname"
              autoComplete="off"
              placeholder="full name english"
              required
            />
          </div>
          <div className="register__form-inner__div__item">
            <input
              className="register__form-inner__div__item__input"
              type="text"
              name="nepname"
              autoComplete="off"
              placeholder="पुरा नाम नेपालीमा"
              required
            />
          </div>
          
          </div>
          <div className="register__form-inner__div">
          <div className="register__form-inner__div__item">
            <input
              className="register__form-inner__div__item__input"
              type="text"
              name="contactno"
              autoComplete="off"
              placeholder="contactno"
              required             
            />
          </div>
          <div className="register__form-inner__div__item">
            <input
              className="register__form-inner__div__item__input"
              type="password"
              name="password"
              autoComplete="off"
              placeholder="password"
              required
            />
          </div>
          <div className="register__form-inner__div__item">
            <input
              className="register__form-inner__div__item__input"
              type="password"
              name="confirmpassword"
              autoComplete="off"
              placeholder="re-enter password"
              required
            />
          </div>
          <div className="register__form-inner__div__item">
            <select
              className="register__form-inner__div__item__input"
              name="officeid"
            >
              {offices ? offices.map((data,index) => {
                    return (
                      <option key={index} value={data.id}>
                        {data.office_name}
                      </option>
                    );
                  }):null
                }
            </select>
          </div>
          </div>        
          <div className="register__form-inner__div last">
          <div className="register__form-inner__div__item">
            <input
              type="submit"
              value="रजिष्ट्रर गर्नुहोस्"
              className="register__form-inner__div__item__button"
            />
          </div>
          <div className="register__form-inner__div__item">          
          <h6 className="register__form-outer__footer-text">
          <Link to="/login">प्रयोगकर्ता हो ? कृपया लगईन गर्नुहोस्</Link>
        </h6>
          </div>
          </div>          
        </form>        
      </div>
    </section>
  );
};

export default Register;
