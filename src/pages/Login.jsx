import React, { useRef, useState } from "react";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextProvider";
import { useAlert } from "../contexts/alertContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useStateContext();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post(`/admin/login`, {
        email: email,
        password: password,
      });
      
      if (response.status == 200) {
        setUser(response.data.user);
        setToken(response.data.token);

        localStorage.setItem('USER', JSON.stringify(response.data.user));
        showAlert("Login successful!", "success");
      }
    } catch (error) {
      if (error.response.data.errors) {
        Object.values(error.response.data.errors).flat().forEach((errorMessage) => {
          showAlert(`${errorMessage}`, "error");
        });
      } else if (error.response.data.message) {
        showAlert(`${error.response.data.message}`, "error"); 
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-2">
      <Card className="p-4 md:p-8 w-[500px] items-center border-gray-200 shadow-lg">
        <div className="w-full text-center mb-4 pt-2">
          <div className="bg-purple-600 p-3 rounded-lg mb-8">
            <img 
                src="/rockygo_logo.png" 
                alt="RockyGo" 
                className="h-7 flex mx-auto" 
            />
          </div>
          <Typography variant="h3" className="font-bold text-gray-800 mb-2">
            Welcome Back
          </Typography>
          <Typography className="text-gray-600 font-normal">
            Please enter your credentials to continue
          </Typography>
        </div>

        <form
          className="mt-4 w-full space-y-5 flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <Typography className="text-gray-700 font-medium">
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
            <Typography className="text-gray-700 font-medium">
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
            className="w-full bg-purple-600 hover:bg-purple-400 transition-colors py-3 text-base font-medium !-mb-1"
          >
            Sign In
          </Button>

          {/* <Typography className="text-center text-gray-600 !mb-1">
            Don't have an account?{" "}
            <Link
              to="/admin/signup"
              className="font-medium text-blue-500 underline"
            >
              Sign up
            </Link>
          </Typography> */}
        </form>
      </Card>
    </div>
  );
}

export default Login;