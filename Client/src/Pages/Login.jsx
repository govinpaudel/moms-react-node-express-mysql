import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.scss";
import { toast } from "react-toastify";
import MainHeaderComponent from "../Components/MainHeaderComponent";
import { Circles } from "react-loader-spinner";
import { useAuth } from "../Context/AuthContext";


const Login = () => {
  const initialdata = { username: "", password: "", aabaid: 0 };
  const { login, isAuthenticated } = useAuth();
  const [aabas, setAabas] = useState([]);
  const [defaaba, setDefAaba] = useState(null);
  const [formData, setFormData] = useState(initialdata);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const Url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "aabaid") {
      setDefAaba(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/apphome", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.username || !formData.password) {
      toast.warning("Please fill the form");
      return;
    }

    setSubmitting(true);

    const payload = {
      ...formData,
      todaydate: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(`${Url}login`, payload);
      if (response.data.status === true) {
        const userData = {
          ...response.data.data,
          aabaid: defaaba,
        };
        login({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          data: userData,
        });
        toast.success(response.data.message || "लगइन सफल भयो");
        navigate("/apphome", { replace: true });
      } else {
        toast.warning(response.data.message || "लगइन असफल भयो");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------- API ------------------------- */

  const loadAabas = async () => {
    try {
      const response = await axios.get(`${Url}getAllAabas`);
      if (typeof response.data === "string") {
        toast.error("सर्भर प्रमाणीकरण असफल भयो । कृपया केही समयपछि पुनः प्रयास गर्नुहोस्।");
        return;
      }
      const list = response.data.data || [];
      setAabas(list);
      const currentAaba = list.find(a => a.is_current === "1");
    if (currentAaba) {
      setDefAaba(currentAaba.id);
    }
    } catch (error) {
      console.error(error);
      toast.error("डाटा लोड गर्न सकिएन");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------- effects ------------------------- */

  // Initial load
  useEffect(() => {
    document.title = "MOMS | प्रयोगकर्ता लगईन";
    loadAabas();
  }, []);


  // Sync aaba with form
  useEffect(() => {
    if (defaaba) {
      setFormData((prev) => ({
        ...prev,
        aabaid: defaaba,
      }));
    }
  }, [defaaba]);

  /* ------------------------- UI ------------------------- */

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

        <form className="login__form-inner" onSubmit={onSubmit}>
          <input
            type="text"
            name="username"
            placeholder="प्रयोगकर्ताको नाम"
            className="login__form-inner__item__input"
            onChange={handleChange}
            required
          />

          <hr />

          <input
            type="password"
            name="password"
            placeholder="पासवर्ड"
            className="login__form-inner__item__input"
            onChange={handleChange}
            required
          />

          <hr />

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

          <hr />

          <input
            type="submit"
            value={submitting ? "प्रवेश हुँदैछ..." : "लगईन गर्नुहोस्"}
            disabled={!defaaba || submitting}
            className="login__form-inner__item__button"
          />
        </form>
      </div>
    </section>
  );
};

export default Login;
