import { API } from ".";

export const updateUserProfile = async (userId: string, data: any) => {
  return (await API.patch("/profile/" + userId, data)).data;
};

export const getUserProfile = async () => {
  return (await API.get("/profile/me")).data;
};

export const getProfileByUsername = async (username: string) => {
  return (await API.get(`/profile/${username}`)).data;
};

export const uploadProfileImage = async (data: any) => {
  return (
    await API.patch("/profile/me/image", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  ).data;
};
