import { useContext } from "react";
import { UserRegistrationData } from "../components/UserContext";
import axios from "axios";


const API = process.env.EXPO_PUBLIC_APP_URL + "/ChatApp";

export const createNewAccount = async (
  userRegistrationData: UserRegistrationData
) => {
  let formData = new FormData();
  formData.append("firstName", userRegistrationData.firstName);
  formData.append("lastName", userRegistrationData.lastName);
  formData.append("countryCode", userRegistrationData.countryCode);
  formData.append("contactNo", userRegistrationData.contactNo);
  formData.append("password", userRegistrationData.password);
  formData.append("profileImage", {
    uri: userRegistrationData.profileImage,
    name: "profile.png",
    type: "image/png",
  } as any);

  const response = await fetch(API + "/UserController", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    const json = await response.json();
    return json;
  } else {
    return "OOPS! Account creation failed!";
  }
};

export const uploadProfileImage = async (userId: string, imageUri: string) => {
  let formData = new FormData();
  formData.append("userId", userId);
  formData.append("profileImage", {
    uri: imageUri,
    type: "image/png", // change if PNG
    name: "profile.png",
  } as any);

  const response = await fetch(API + "/ProfileController", {
    method: "POST",
    body: formData,
  });
  if (response.ok) {
    return await response.json();
  } else {
    console.warn("Profile image uploading failed!");
  }
};

export const authSignIn = async (callingCode: string, mobile: string, password: string) => {
  try {
    const response = await axios.post(`${API}/UserAuthController`, {
      callingCode,
      mobile,
      password,
    });

    return response.data; // return only the useful data
  } catch (error: any) {
    console.error("SignIn error:", error);
    throw error; // rethrow to handle in component
  }
};