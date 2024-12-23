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
        setUser(response.data.user.first_name);
        setToken(response.data.token);

        showAlert("Login successful!", "success");
      }
    } catch (error) {
      showAlert("An error occurred. Please try again.", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-2">
      <Card className="p-4 md:p-8 w-[500px] items-center shadow-xl rounded-xl bg-white border border-gray-100">
        <div className="w-full text-center mb-4">
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
              className="!border-gray-200 focus:!border-gray-900"
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
              className="!border-gray-200 focus:!border-gray-900"
              labelProps={{
                className: "hidden",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-400 transition-colors py-3 text-base font-medium"
          >
            Sign In
          </Button>

          <Typography className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/admin/signup"
              className="font-medium text-blue-500 underline"
            >
              Sign up
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}

export default Login;
