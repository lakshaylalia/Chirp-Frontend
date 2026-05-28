import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function signUp({ userName, email, password }) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      userName,
      email,
      password,
    });

    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.log(error.response.data);
    throw new Error(error.response.data.message, { cause: error });
  }
}

export async function login({ email, password }) {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );

    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error.response.data);
    throw new Error(error.response.data.message, { cause: error });
  }
}

export async function verifyAccount({ email, code }) {
  try {
    const response = await axios.post(`${API_URL}/auth/verify`, {
      email,
      code,
    });
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error.response.data);
    throw new Error(error.response.data.message, { cause: error });
  }
}

export async function sendOTP({ email }) {
  try {
    const response = await axios.post(`${API_URL}/auth/send-otp`, { email });
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.log(error.response.data);
    throw new Error(error.response.data.message, { cause: error });
  }
}

export async function logout() {
  try {
    const response = await axios.get(`${API_URL}/auth/logout`, {withCredentials: true});
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error.response.data);
    throw new Error(error.response.data.message, { cause: error });
  }
}

export function googleAuth() {
  window.location.href = `${API_URL}/auth/google/callback`;
}

export async function getCurrentUser() {
  try {
    const response = await axios.get(`${API_URL}/u`, {
      withCredentials: true,
    });
    console.log(await response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error.response.data);
    throw new Error(error.response.data.message, { cause: error });
  }
}