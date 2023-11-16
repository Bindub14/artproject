import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link } from "../../lib-components/Link";
import { userService } from "services";
import { useDispatch } from "react-redux";
import {
  resetUserDetails,
  setLoggedInUserDetails,
  setTheme,
} from "Commons/Actions";
import { useAuth } from "components/Auth/AuthProvide";
import { useEffect, useState } from "react";
import { showNotification } from "components/Notification/Actions";
import moment from "moment";
import styled from "./login.module.css";
import Button from "@mui/material/Button";
import { ErrorTooltip } from "./register";
const LoginComponent = () => {
  const [isvalid, setIsvalid] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const { auth, user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email id")
      .required("Username is required"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const togglePasswordVisiblity = () => {
    passwordShown ? setPasswordShown(false) : setPasswordShown(true);
  };
  useEffect(() => {
    if (user) {
      router.push("/product/diamonds", null, { shallow: true });
    }
  }, []);
  async function onSubmit(credentials) {
    return userService
      .login(credentials)
      .then((response) => {
        if (response?.data?.valid) {
          setIsvalid(!isvalid);
          dispatch(setLoggedInUserDetails(response.data));
          dispatch(setTheme(response.data?.theme));
          auth.signIn(response.data, 1000);
          const timeStamp = moment();
          window.localStorage.setItem("lastTimeStamp", timeStamp);
          window.localStorage.setItem(
            "access_token",
            response.data?.access_token
          );
          // userService.getUserDetails().then((userResponse) => {
          //   console.log(userResponse);
          // });
          setTimeout(() => {
            const returnUrl = router.query.redirectUrl || "/product/diamonds";
            router.push(returnUrl, null, { shallow: true });
          }, 2000);
        } else if (!response?.data?.valid) {
          setIsvalid(isvalid);
          dispatch(
            showNotification({
              open: true,
              message: response?.data?.msg,
              severity: "error",
            })
          );
        }
      })
      .catch(() => dispatch(resetUserDetails()));
  }

  return (
    <div className={styled.container}>
      <a href="/" className={`${styled.logo}`}>
        <img
          src="/images/mainLogoMain.jpeg"
          alt="logo"
          className={styled.logoimage}
        />
      </a>

      <div className={styled.leftContainer}>
        <div className={styled.form_container}>
          <div className="font-bold text-2xl text-[#475467] mb-5">
            Log in to Artisan
          </div>
          <div className={styled.subHeader}>
            Welcome back! Please enter your details.
          </div>
          <div className={styled.formcontainer}>
            <div className={styled.forminput}>
              <label className={styled.formlabel}> Email </label>
              <input
                type="text"
                className={`${styled.inputcontainer} ${styled.placeholder} ${
                  errors.email?.message && styled.inputError
                }`}
                placeholder="Email"
                {...register("email")}
              />
              {errors.email?.message && (
                <div
                  className={styled.invalidLabel}
                  style={{
                    zIndex: "10",
                    top: "75%",
                    transform: "translateY(-75%)",
                  }}
                >
                  <ErrorTooltip message={errors.email?.message} />
                </div>
              )}
            </div>
            <div className={styled.forminput}>
              <label className={styled.formlabel}>Password </label>

              <div className={styled.visiblityPasswordWrapper}>
                <input
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  className={`${styled.inputcontainer} ${
                    styled.passwordPlaceholder
                  } ${errors.password?.message && styled.inputError}`}
                  placeholder="........"
                  {...register("password")}
                />
                <span
                  onClick={togglePasswordVisiblity}
                  className={styled.PasswordVisibitly}
                  style={errors.password?.message ? { right: "10px" } : {}}
                >
                  {passwordShown ? "Hide" : "Show"}
                </span>
              </div>
              {errors.password?.message && (
                <div
                  className={styled.invalidLabel}
                  style={{
                    zIndex: "10",
                    top: "75%",
                    transform: "translateY(-75%)",
                  }}
                >
                  <ErrorTooltip message={errors.password?.message} />
                </div>
              )}
            </div>
            <div className={styled.linkActions}>
              <Link
                className={styled.linkActionButton}
                href="/account/reset_password_component"
              >
                Forgot Password?
              </Link>
              <Link
                className={styled.linkActionButton}
                href="/account/register"
              >
                Create Account
              </Link>
            </div>
            <Button
              variant="contained"
              sx={{
                textTransform: "capitalize",
              }}
              className={`${styled.buttoncolor} ${styled.login}`}
              onClick={handleSubmit(onSubmit)}
            >
              {isvalid ? (
                <img
                  src="/images/tickicon.png"
                  alt="imgicon"
                  height="15px"
                  width="20px"
                />
              ) : (
                "Log In"
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className={styled.rightContainer}>
        <img
          src="/images/assets/ring.png"
          alt="right banner"
          className={styled.rign}
        />
      </div>
    </div>
  );
};
LoginComponent.requireAuth = false;
export default LoginComponent;
