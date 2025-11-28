import axiosClient from "../api/axiosClient";

const getPeople = async () => {
  const { data } = await axiosClient.get("v1/personas/");
  return data;
};

export { getPeople };
