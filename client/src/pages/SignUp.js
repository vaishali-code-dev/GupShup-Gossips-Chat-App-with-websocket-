import React, { useState } from "react";
import { io } from "socket.io-client";
import { ButtonUsage, CustomTypography, Input } from "components";
import { signUserInitialValues } from "../constant";
import { signUpUser } from "apis/login";
import { Link, useNavigate } from "react-router-dom";
import useToaster from "hooks/useToaster";
import { isValidEmail } from "helpers";

const SignUp = () => {
  const [formData, setFormData] = useState(signUserInitialValues);
  const [errors, setErrors] = useState({});
  const Navigate = useNavigate();
  const { showToast } = useToaster();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignUp();
    setFormData(signUserInitialValues);
  };

  const handleChange = ({ target: { value, id } }) => {
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSignUp = async () => {
    try {
      if (!isValidEmail(formData.email)) {
        setErrors({ ...errors, email: "Please type correct email." });
      } else {
        setErrors({});
        let res = await signUpUser({ ...formData, email: String(formData?.email)?.toLowerCase() });
        showToast("User created successfully.");
        Navigate("/");
      }
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
            <Input label="Name" value={formData.fullName} id="fullName" handleChange={handleChange} />
            <Input
              label="Email"
              value={formData.email}
              id="email"
              handleChange={handleChange}
              error={errors.email}
              helperText={errors.email}
            />
            <Input label="Password" type="password" value={formData.password} id="password" handleChange={handleChange} />
            <ButtonUsage label="SIGNUP" type="submit" />
          </div>
        </form>
        <div>
          <CustomTypography label="Already have an account?" variant="body2" wrapperClassName="mt-4" />
          <Link to="/">
            <CustomTypography label="Login here" variant="body1" className="cursor-pointer underline !mt-3 ubuntu-medium" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
