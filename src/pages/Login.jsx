import React, { useState } from "react";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextProvider";
import { useAlert } from "../contexts/alertContext";

function Login() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useStateContext();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axiosClient.post(`/admin/login`, {
        email: email,
        password: password,
      });

      if (response.status == 200) {
        setUser(response.data.user);
        setToken(response.data.token);
        setSubmitting(false);
        localStorage.setItem("USER", JSON.stringify(response.data.user));
        showAlert("Login successful!", "success");
      }
    } catch (error) {
      if (error.response.data.errors) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((errorMessage) => {
            showAlert(`${errorMessage}`, "error");
          });
      } else if (error.response.data.message) {
        showAlert(`${error.response.data.message}`, "error");
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-2">
      <Card className="w-[500px] items-center border-gray-200 p-4 shadow-lg md:p-8">
        <div className="mb-4 w-full pt-2 text-center">
          <div className="mb-8 rounded-lg bg-purple-600 p-3">
            <img
              src="/rockygo_logo.png"
              alt="RockyGo"
              className="mx-auto flex h-7"
            />
          </div>
          <Typography variant="h3" className="mb-2 font-bold text-gray-800">
            Welcome Back
          </Typography>
          <Typography className="font-normal text-gray-600">
            Please enter your credentials to continue
          </Typography>
        </div>

        <form
          className="mt-4 flex w-full flex-col space-y-5"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <Typography className="font-medium text-gray-700">
              Email Address
            </Typography>
            <Input
              size="lg"
              placeholder="your@email.com"
              className="!border-gray-400 focus:!border-gray-900"
              labelProps={{
                className: "hidden",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Typography className="font-medium text-gray-700">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="Enter your password"
              className="!border-gray-400 focus:!border-gray-900"
              labelProps={{
                className: "hidden",
              }}
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className={`!-mb-1 w-full bg-purple-600 py-3 text-base font-medium transition-colors hover:bg-purple-400 ${
              submitting ? "disabled cursor-not-allowed opacity-50" : ""
            }`}
          >
            {submitting ? "Signing In..." : "Sign In"}
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            <Link
              to="/admin/forgotpassword"
              className="font-medium text-blue-500 underline"
            >
              Forgot Password?
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}

export default Login;
