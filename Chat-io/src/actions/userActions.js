import { UPDATE_USER } from "../constants";

export const updateUser = username => {
  return {
    type: UPDATE_USER,
    payload: { username }
  };
};
