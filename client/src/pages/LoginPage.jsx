import { useState } from "react";
import assets from "../assets/assets";

function LoginPage() {
  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDataSubmitted, setIsDataSumitted] = useState(false);
  const [bio, setBio] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currState === "Sign Up" && !isDataSubmitted) {
      setIsDataSumitted(true);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-lg">
      {/* ------ left ------ */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />

      {/* ------ right ------ */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/5 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSumitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {currState === "Sign Up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </>
        )}

        {currState === "Sign Up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="provide a short bio..."
            required
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-linear-to-r from-blue-500 to-blue-900 text-white font-medium rounded-md cursor-pointer"
        >
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="flex flex-col gap-2">
          {currState === "Sign Up" ? (
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSumitted(false);
                }}
                className="font-medium text-blue-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Create an account{" "}
              <span
                onClick={() => {
                  setCurrState("Sign Up");
                }}
                className="font-medium text-blue-500 cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
