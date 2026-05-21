import { useState, useContext } from "react";
import { useNavigate, } from "react-router-dom";
import { AuthContext } from "../Provider/Authprovider";
import { base_url } from "../../config/config";
const Login = () => {
  const [remail, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();

    const loginData = { remail, pass };

    try {
      const response = await fetch(`${base_url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success && data.token) {
        login(data.token);
        navigate(`/`); 
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg w-full sm:w-96 p-6">
        <div className="text-2xl text-center font-bold mb-10">Sign In</div>

        <form onSubmit={handleLogin}>
          <label className="input input-bordered flex items-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="email"
              className="grow"
              placeholder="Email"
              value={remail}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="input input-bordered flex items-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <input
            className="btn my-2 w-full bg-blue-500 text-white"
            type="submit"
            value="Sign In"
          />

          {error && <div className="text-red-500 text-center mt-2">{error}</div>}

 
        </form>
      </div>
    </div>
  );
};

export default Login;
