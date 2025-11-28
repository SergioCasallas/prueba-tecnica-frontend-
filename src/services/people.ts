import axiosClient from "../api/axiosClient";
import type { Persona } from "../types";

const getPeople = async () => {
  const { data } = await axiosClient.get("v1/personas/");
  return data;
};

const postPeople = async (payload: Persona) => {
  const { data } = await axiosClient.post("v1/personas/", payload);
  return data;
};

export { getPeople, postPeople };
