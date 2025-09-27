import { useAuth } from "@/context/authContext";

export default function useUserAuth() {
  const { user } = useAuth();
  return Boolean(user);
}
