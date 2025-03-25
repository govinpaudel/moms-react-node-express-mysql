import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.scss";
import { toast } from "react-toastify";
import { BsInfoCircleFill } from "react-icons/bs";
import PageHeaderComponent from "../Components/PageHeaderComponent";
import MainHeaderComponent from "../Components/MainHeaderComponent";
const Login = () => {
  const [aabas, setaabas] = useState([]);
  const [defaaba, setdefaaba] = useState();
  const Url = import.meta.env.VITE_API_URL + "auth/";
  console.log("url came", Url);
  const loggedUser = sessionStorage.getItem("loggedUser");
  const navigate = useNavigate();

  const OnSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    if (data.email.length == 0 || data.password.length == 0) {
      toast.warning("Please fill the form");
      return;
    }
    try {
      const response = await axios({
        method: "post",
        url: Url + "login",
        data: data,
      });
      console.log("response",response);
      if (response.data.status == 200) {
        let data1={...response.data.data,"aabaid":data.aabaid}   
        console.log("data1",data1)            
        sessionStorage.setItem("access_token", JSON.stringify(response.data.access_token));
        sessionStorage.setItem("refresh_token", JSON.stringify(response.data.refresh_token));
        sessionStorage.setItem("loggedUser", JSON.stringify(data1));
        toast.success(response.data.message);
        navigate("/");
      } else {
        console.log("data",response.data.status)
        toast.warning(response.data.message);
      }
    } catch (error) {
      toast.warning(error.response.data.message);
    }
  };

  const loadAabas = async () => {
    try {
      const response = await axios({
        method: "get",
        url: Url + "getAllAabas",
        
      });
      setaabas(response.data.data);
    } catch (error) {
      toast.loading('Waiting for Database connection');
      console.log(error);
    }
  };
  const checkLogin = () => {
    if (loggedUser) {
    }
  };
  useEffect(() => {
    loadAabas();
    checkLogin();
  }, []);
  useEffect(() => {
    aabas.forEach((season) => {
      season.is_current == 1 ? setdefaaba(season.id) : null;
    });
  }, [aabas]);
  return (
    <section id="login" className="login">
      <MainHeaderComponent headerText="मालपोत कार्यालय व्यवस्थापन प्रणाली"/>
      <div className="login__form-outer">
        <h5 className="login__form-outer__header-text">Login Form</h5>
        <form className="login__form-inner" onSubmit={OnSubmit}>
          <div className="login__form-inner__item">
            <input
              className="login__form-inner__item__input"
              type="email"
              name="email"
              autoComplete="off"
              placeholder="email"
              required
            />
          </div>
          <div className="login__form-inner__item">
            <input
              className="login__form-inner__item__input"
              type="password"
              name="password"
              autoComplete="off"
              placeholder="password"
              required
            />
          </div>
          <div className="login__form-inner__item">
            <select
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
              value="Login"
              className="login__form-inner__item__button"
            />
          </div>
        </form>

        <h5 className="login__form-outer__footer-text">
          <Link to="/register">Not A User ? Please register.</Link>
        </h5>
      </div>
    </section>
  );
};

export default Login;
