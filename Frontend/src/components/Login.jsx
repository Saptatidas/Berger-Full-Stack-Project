import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import './Login.css'


  function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault(); // prevent page reload

    try{
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();

      if (!res.ok) {
        // throw new Error("Invalid response from server");
        setError(data.message || "Login failed. Please try again."); // backend message or fallback
        return;
      }

      // const data = await res.json();
      console.log("Login successful:", data); // use this for debugging
      setError("");

      // Save token in localStorage
      localStorage.setItem("token", data.token); 
      localStorage.setItem("role", data.role);

      // Redirect based on role
      if (data.role === "admin") {
        navigate("/login/full");
        console.log("admin");
      } else {
        navigate("/login/restrict");
        console.log("user");
      }

    } catch (error) {
      setError("Invalid username or password");
      console.error("Login error:", error);
    }
    
    console.log("Username:", username);
    console.log("Password:", password);
    // Here you can call an API or do further validation

  };


  return (
    // <form 
    //   className="login-card" 
    //   onSubmit={handleSubmit} 
    //   aria-label="Login form"
    // >
    //   <div className="title-badge">Login</div>

    //   {error && <div className="error-message">{error}</div>}

    //   <div className="field">
    //     <label htmlFor="username">Username</label>
    //     <input
    //       type="email"
    //       id="username"
    //       name="username"
    //       placeholder="Enter your username"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //       required
    //       autoComplete="username"
    //       aria-required="true"
    //     />
    //   </div>

    //   <div className="field">
    //     <label htmlFor="password">Password</label>
    //     <input
    //       type="password"
    //       id="password"
    //       name="password"
    //       placeholder="Enter your password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       required
    //       autoComplete="current-password"
    //       aria-required="true"
    //     />
    //   </div>

    //   <div className="submit-wrapper">
    //     <button type="submit">Login</button>
    //   </div>
    // </form>

    <div className="flex min-h-screen items-center justify-center bg-[#e5e5e5]">
    <form
      className="w-90 rounded-lg bg-white border-[1.5px] border-[#7b7878a0] p-6 shadow-lg/20"
      onSubmit={handleSubmit}
      aria-label="Login form"
    >
      {/* Title */}
      <div className="mt-5 mb-7 flex justify-center">
        <div className="px-6 py-1 text-3xl font-bold tracking-wide">
          LOGIN
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 text-center text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Username */}
      <div className="mb-5">
        <label
          htmlFor="username"
          className="block text-md font-normal text-black mb-1"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          aria-required="true"
          className="w-full rounded-md bg-[#dbdbdb3c] px-3 py-2 mb-2 text-black border border-[#7b7878b8] shadow-md placeholder-[#534a4aaf] outline-none hover:bg-[#dbdbdb99] focus:ring-2 focus:ring-[#7b7878b0]"
        />
      </div>

      {/* Password */}
      <div className="mb-9">
        <label
          htmlFor="password"
          className="block text-md font-normal text-black mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          aria-required="true"
          className="w-full rounded-md bg-[#dbdbdb3c] px-3 py-2 mb-2 text-black border border-[#7b7878b8] shadow-md placeholder-[#534a4aaf] outline-none hover:bg-[#dbdbdb99] focus:ring-2 focus:ring-[#7b7878b0]"
        />
      </div>

      {/* Button */}
      <div className="mt-5 mb-7 flex justify-center">
        <button
          type="submit"
          className="px-7 py-2 rounded-xl bg-[#726d6d] border border-[#7b787882] font-semibold text-white hover:bg-[#252629e3]"
        >
          Login
        </button>
      </div>
    </form>
  </div>

  );
}

export default Login;
