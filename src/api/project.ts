import { API } from ".";

export const addProject = async (data: any, userId: string) => {
  await API.post(`/users/${userId}/projects`, data);
};

export const editProject = async (
  data: any,
  userId: string,
  projectId: string,
) => {
  await API.patch(`/users/${userId}/projects/${projectId}`, data);
};

export const fetchProjects = async (userId: string) => {
  return (await API.get(`/users/${userId}/projects`)).data;
};

export const deleteProject = async (projectId: string, userId: string) => {
  await API.delete(`users/${userId}/projects/${projectId}`);
};
