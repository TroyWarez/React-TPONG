import React, { useState } from "react";

export default function Login() {
  document.title = "TPONG Sign in";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  }
  return (
  <div className="auth-form-container">
  <form onSubmit={handleSubmit}>
    <label>
      Email:
      <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="mail@email.com" id="email" name="email" />
    </label>
      <input value={email} onChange={(e) => setPassword(e.target.value)}type="password" placeholder="********" id="password" name="password" />
      <button type="submit">TPONG Login In</button>
  </form>
  </div>
  )
}
