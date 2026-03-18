import axios from "axios";
import { cookies } from "next/headers";

const serverApi = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Cookie: cookieHeader,
      Origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    },
  });
};

export default serverApi;
