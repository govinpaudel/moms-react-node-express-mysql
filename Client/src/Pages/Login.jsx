import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.scss";
import { toast } from "react-toastify";
import MainHeaderComponent from "../Components/MainHeaderComponent";
import { Circles } from "react-loader-spinner";

const Login = () => {
  const initialdata = { username: "", password: "", aabaid: 0 };

  const [aabas, setAabas] = useState([]);
  const [defaaba, setDefAaba] = useState(null);
  const [formData, setFormData] = useState(initialdata);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const Url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Parse safely
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");

  /* ------------------------- handlers ------------------------- */

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

      // InfinityFree HTML detection
      if (typeof response.data === "string") {
        toast.error("सर्भर प्रमाणीकरण असफल भयो । कृपया केही समयपछि पुनः प्रयास गर्नुहोस्।");
        return;
      }

      if (response.data.status === true) {
        const userData = {
          ...response.data.data,
          aabaid: defaaba,
        };

        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("loggedUser", JSON.stringify(userData));

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

      setAabas(response.data.data || []);
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

    if (loggedUser) {
      navigate("/apphome", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set default aaba
  useEffect(() => {
    if (aabas.length) {
      const current = aabas.find((a) => a.is_current === 1);
      if (current) {
        setDefAaba(current.id);
      }
    }
  }, [aabas]);

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
