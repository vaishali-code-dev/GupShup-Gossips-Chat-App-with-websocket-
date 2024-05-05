import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { ButtonUsage, CustomTypography, Input } from "components";
import { loginUserInitialValues } from "constant";
import { loginUser } from "apis/login";
import useToaster from "hooks/useToaster";
import { AuthContext } from "context/authContext";
import { isValidEmail } from "helpers";
import { googleLoginApi } from "apis/login";
import GoogleSvgComponent from "assets/icons/google";
import { googleLoginUser } from "apis/login";
import { LOGIN_TYPE } from "constant";
import Loader from "assets/icons/loader";

const Login = () => {
  const [formData, setFormData] = useState(loginUserInitialValues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState("");
  const { setUserDetails } = useContext(AuthContext);
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
      setIsLoading(LOGIN_TYPE.normal);
      if (!isValidEmail(formData.email)) {
        setErrors({ ...errors, email: "Please type correct email." });
      } else {
        setErrors({});
        let {
          data: { user },
        } = await loginUser({ ...formData, email: String(formData?.email)?.toLowerCase() });
        setUserDetails(user);
        sessionStorage.setItem("token", user?.token);
        showToast("Logged in successfully.");
        Navigate("/dashboard");
        setFormData(loginUserInitialValues);
      }
    } catch (error) {
      showToast("Something wrong");
    } finally {
      setIsLoading("");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setIsLoading(LOGIN_TYPE.gAuth);
        const {
          data: { email, name, picture },
        } = await googleLoginApi(codeResponse);
        const {
          data: { user },
        } = await googleLoginUser({
          email,
          name,
          profilePhoto: picture,
        });
        setUserDetails(user);
        Navigate("/dashboard");
      } catch (error) {
        showToast(`Login failed: ${error}`);
      } finally {
        setIsLoading("");
      }
    },
    onError: (error) => showToast(`Login failed: ${error}`),
  });

  return (
    <div className="flex justify-center items-center w-full h-screen bg-primaryWhite">
      <div className="py-6 w-full m-6 md:w-2/5 md:m-0 bg-primaryLightBg rounded-2xl flex flex-col justify-evenly shadow-xl">
        <div className="flex justify-center bg-transparent mt-2">
          <img src="https://ideogram.ai/api/images/direct/jxP3AVFZRY66SJ7DVhNBJg.png" className="w-40 mix-blend-multiply" />
        </div>
        <CustomTypography label=" GupShup & Gossips" variant="h5" className="ubuntu-medium" wrapperClassName="my-4" />
        <form onSubmit={handleSubmit} className="w-full flex justify-center">
          <div className="flex flex-col gap-6 w-3/4">
            <Input
              label="Email"
              value={formData.email}
              id="email"
              handleChange={handleChange}
              error={errors.email}
              helperText={errors.email}
              variant="standard"
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              id="password"
              variant="standard"
              handleChange={handleChange}
            />
            {isLoading === LOGIN_TYPE.normal ? (
              <ButtonUsage variant="outlined" size="small" className="w-full" />
            ) : (
              <ButtonUsage label="LOGIN" type="submit" />
            )}
          </div>
        </form>
        <div className="flex justify-center pt-4">
          <ButtonUsage variant="outlined" size="small" onClick={googleLogin} className="w-52">
            {isLoading === LOGIN_TYPE.gAuth ? (
              <Loader />
            ) : (
              <div className="flex gap-2 items-center">
                <GoogleSvgComponent />
                <CustomTypography variant="body2" label="Sign in with Google" />
              </div>
            )}
          </ButtonUsage>
        </div>
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
