import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useAlert } from "../../contexts/alertContext";
import axiosClient from "../../axiosClient"; 
import Loading from "../../components/layout/Loading";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [buttonState, setButtonState] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const disableButton = () => {
    setButtonState(!buttonState);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosClient.post("/forgot-password", { email });
      showAlert("Code sent to your email", "success")
      localStorage.setItem("email", email)
      navigate("/admin/emailcode");
    } catch (error) {
      console.log(error);
      showAlert("Email was not found.", "error")
    }finally{
      setLoading(false);
    }
  };

  return (
    <>
    {loading && <Loading/>}
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-2 text-center">
        <form
          onSubmit={handleSubmit}
          className="flex w-[500px] items-center justify-center rounded-md border-2 border-white bg-white p-10 drop-shadow-lg"
        >
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="flex min-w-full justify-center rounded bg-purple-600">
              <img className="scale-50" src="/rockygo_logo.png"></img>
            </div>
            <Typography color="purple" variant="h6" className="font-normal">
              Enter your email and we will send you a<br></br>confirmation
              letter
            </Typography>
            <div className="flex flex-col items-center gap-5">
              <Input
                icon={<Mail />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                type="email"
                size="lg"
                label="Enter email here"
                color="purple"
              ></Input>
              <div className="flex w-full flex-col gap-2">
                <Button
                  size="md"
                  className="w-full"
                  type="submit"
                  variant="outlined"
                  color="purple"
                  onClick={disableButton}
                >
                  Submit Code
                </Button>
                <Link to="/admin/login">
                  <Button
                    className="min-w-[400px] bg-purple-600 hover:bg-purple-400"
                    variant="filled"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
