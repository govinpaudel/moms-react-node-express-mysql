import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/apphome");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card text-center shadow-lg border-0"
        style={{
          backgroundColor: "#181818",
          color: "#fff",
          maxWidth: "420px",
          width: "100%",
        }}
      >
        <div className="card-body p-4">
          <div className="mb-3">
            <span className="fs-1 text-warning">🚫</span>
          </div>

          <h4 className="text-warning mb-2">पहुँच अस्वीकृत</h4>

          <p className="text-light mb-4">
            तपाईंलाई यो पृष्ठ हेर्ने अनुमति छैन।
          </p>

          <div className="alert alert-warning py-2 mb-3">
            ५ सेकेन्डमा होम पृष्ठमा फर्किँदैछ...
          </div>

          <button
            className="btn btn-outline-warning"
            onClick={() => navigate("/apphome")}
          >
            अहिले फर्कनुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
