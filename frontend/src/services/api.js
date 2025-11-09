import axios from "axios";

export const api = axios.create({
  baseURL: "https://gc-back-ingsw3-roy-726155499113.southamerica-east1.run.app/",
  headers: {
    "Content-Type": "application/json",
  },
});
