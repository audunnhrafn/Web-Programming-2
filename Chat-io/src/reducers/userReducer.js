import { UPDATE_USER } from "../constants";

const initialState = {
  username: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER:
      return action.payload;
    default:
      return state;
  }
}
