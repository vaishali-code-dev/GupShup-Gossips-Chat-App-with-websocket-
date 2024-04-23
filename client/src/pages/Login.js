import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ButtonUsage, CustomTypography, Input } from "components";
import { loginUserInitialValues } from "../constant";
import { loginUser } from "apis/login";
import useToaster from "hooks/useToaster";
import { AuthContext } from "context/authContext";

const Login = () => {
  const [formData, setFormData] = useState(loginUserInitialValues);
  const { currentUser, setUserDetails } = useContext(AuthContext);
  const Navigate = useNavigate();
  const { showToast } = useToaster();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleChange = ({ target: { value, id } }) => {
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleLogin = async () => {
    try {
      let {
        data: { user },
      } = await loginUser(formData);
      setUserDetails(user);
      sessionStorage.setItem("token", user?.token);
      showToast("Logged in successfully.");
      Navigate("/dashboard");
      setFormData(loginUserInitialValues);
    } catch (error) {
      showToast("Something wrong");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-backDropBg">
      <div className="py-6 w-full m-6 md:w-2/5 md:m-0 bg-primaryLightBg rounded-2xl flex flex-col justify-evenly shadow-xl">
        <CustomTypography label=" GhupShup & Gossips" variant="h5" className="ubuntu-medium" wrapperClassName="mb-4" />
        <form onSubmit={handleSubmit} className="w-full flex justify-center">
          <div className="flex flex-col gap-6 w-3/4">
            <Input label="Email" value={formData.email} id="email" handleChange={handleChange} />
            <Input label="Password" type="password" value={formData.password} id="password" handleChange={handleChange} />
            <ButtonUsage label="LOGIN" type="submit" />
          </div>
        </form>
        <div>
          <CustomTypography label="Don't have an account?" variant="body2" wrapperClassName="mt-4" />
          <Link to="/signup">
            <CustomTypography label="Signup here" variant="body1" className="cursor-pointer underline !mt-3 ubuntu-medium" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
