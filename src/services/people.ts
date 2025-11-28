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

const patchPeople = async (payload: Persona) => {
  console.log(payload);
  const { data } = await axiosClient.patch(`v1/personas/${payload.id}/`, payload);
  return data;
};

const deletePeople = async (id: number) => {
  const { data } = await axiosClient.delete(`v1/personas/${id}/`);
  return data;
};

export { getPeople, postPeople, patchPeople, deletePeople };
