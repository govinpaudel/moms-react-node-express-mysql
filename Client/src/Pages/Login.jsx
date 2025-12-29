import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.scss";
import { toast } from "react-toastify";
import MainHeaderComponent from "../Components/MainHeaderComponent";
import { Circles } from "react-loader-spinner";

const Login = () => {
  const initialdata = { username: "", password: "", aabaid: 0 };
  const [aabas, setaabas] = useState([]);
  const [defaaba, setdefaaba] = useState(null);
  const [formData, setFormData] = useState(initialdata);
  const [loading, setLoading] = useState(true);

  const Url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const loggedUser = localStorage.getItem("loggedUser");

  const handleChange = (e) => {
    if (e.target.name === "aabaid") {
      setdefaaba(e.target.value);
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const OnSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.warning("Please fill the form");
      return;
    }

    const newdata = {
      ...formData,
      todaydate: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(Url + "login", newdata);

      // 🔴 InfinityFree HTML detection
      if (typeof response.data === "string") {
        toast.error("सुरक्षा जाँच भइरहेको छ, कृपया पुनः प्रयास गर्नुहोस्।");
        window.location.reload();
        return;
      }

      if (response.data.status === true) {
        const data1 = { ...response.data.data, aabaid: defaaba };

        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("loggedUser", JSON.stringify(data1));

        toast.success(response.data.message);
        navigate("/apphome");
      } else {
        toast.warning(response.data.message || "लगइन असफल भयो");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
      console.error(error);
    }
  };

  const loadAabas = async () => {
    try {
      const response = await axios.get(Url + "getAllAabas");
      // 🔴 InfinityFree HTML detection
      if (typeof response.data === "string") {
        toast.error("सुरक्षा जाँच भइरहेको छ, कृपया पुनः प्रयास गर्नुहोस्।");
        window.location.reload();
        return;
      }
      setaabas(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "MOMS | प्रयोगकर्ता लगईन";
    loadAabas();

    if (loggedUser) {
      navigate("/apphome");
    }
  }, []);

  useEffect(() => {
    if (aabas?.length) {
      const current = aabas.find((item) => item.is_current === 1);
      if (current) setdefaaba(current.id);
    }
  }, [aabas]);

  useEffect(() => {
    if (defaaba) {
      setFormData((prev) => ({ ...prev, aabaid: defaaba }));
    }
  }, [defaaba]);

  return (
    <section id="login" className="login">
      <MainHeaderComponent headerText="मालपोत कार्यालय व्यवस्थापन प्रणाली" />

      {loading && (
        <div className="fullscreen-loader">
          <div className="loader">
            <Circles height={150} width={150} color="#ffdd40" />
            <h2 className="loader-text">कृपया प्रतिक्षा गर्नुहोस् ।</h2>
          </div>
        </div>
      )}

      <div className="login__form-outer">
        <h5 className="login__form-outer__header-text">लगईन फाराम</h5>

        <form className="login__form-inner" onSubmit={OnSubmit}>
          <input
            type="text"
            name="username"
            placeholder="प्रयोगकर्ताको नाम"
            className="login__form-inner__item__input"
            onChange={handleChange}
            required
          />
      <hr/>
          <input
            type="password"
            name="password"
            placeholder="पासवर्ड"
            className="login__form-inner__item__input"
            onChange={handleChange}
            required
          />
 <hr/>
          <select
            name="aabaid"
            value={defaaba || ""}
            onChange={handleChange}
            className="login__form-inner__item__input"
          >
            {aabas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.aaba_name}
              </option>
            ))}
          </select>
<hr/>
          <input
            type="submit"
            value="लगईन गर्नुहोस्"
            disabled={!defaaba}
            className="login__form-inner__item__button"
          />
        </form>
      </div>
    </section>
  );
};

export default Login;
