import { API } from ".";

export const loginUser = async (username: string, password: string) => {
  return (await API.post("/auth/login", { username, password })).data;
};

export const registerUser = async (data: any) => {
  return (await API.post("/auth/signup", data)).data;
};
