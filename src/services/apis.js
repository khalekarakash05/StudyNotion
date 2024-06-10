const BASE_URL =  process.env.REACT_APP_BASE_URL;

export const endpoints = {
    SENDOTP_API: BASE_URL + "/user/sendotp",
    SIGNUP_API: BASE_URL + "/user/signup",
    LOGIN_API: BASE_URL + "/user/login",
    RESETPASSTOKEN_API: BASE_URL + "/user/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/user/reset-password",
  }
  

export const categories = {
    CATEGORIES_API: BASE_URL + '/course/showcategories',
}