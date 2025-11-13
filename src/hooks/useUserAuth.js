import { useAuth } from "@/context/authContext";

export default function useUserAuth() {
  const { userId } = useAuth();
  return Boolean(userId);
}
