import React, { useState } from "react";
import {
  Card,
  Typography,
  Input,
  Button,
  Checkbox,
} from "@material-tailwind/react";
import axiosClient from "../axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../contexts/alertContext";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    try {
      const response = await axiosClient.post(`/admin/register`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      });

      if (response.status === 201) {
        showAlert("Registration successful!", "success");
        navigate("/admin/login");
      }
    } catch (error) {
      if (error.response.data.errors) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((errorMessage) => {
            showAlert(`${errorMessage}`, "error");
          });
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card color="white" shadow={false} className="p-8 w-[500px] items-center">
        <Typography variant="h4" color="blue-gray" className="font-bold">
          Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to register.
        </Typography>
        <form className="mt-8 mb-2 w-full" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              First Name
            </Typography>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              size="lg"
              label="Enter first name here..."
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Last Name
            </Typography>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              size="lg"
              label="Enter last name here..."
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Email
            </Typography>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="lg"
              label="Enter email here..."
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              size="lg"
              label="********"
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Confirm Password
            </Typography>
            <Input
              autoComplete="off"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              size="lg"
              label="********"
            />
          </div>
          <div className="mt-3">
            <Checkbox
              checked={agree}
              onChange={() => setAgree(!agree)} // Toggle checkbox state
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center font-normal"
                >
                  I agree the
                  <a
                    href="#"
                    className="font-medium transition-colors hover:text-gray-900"
                  >
                    &nbsp;Terms and Conditions
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
          </div>
          <Button
            type="submit"
            disabled={!agree}
            className="w-full bg-purple-500 hover:bg-purple-400 transition-colors py-3 mt-3 text-base font-medium"
          >
            Sign Up
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <Link
              to="/admin/login"
              className="font-medium text-blue-500 underline"
            >
              Sign In
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}

export default Signup;
