import { apiRequest } from "@/services/api";
import { User } from "@/types/auth";

export async function getCurrentUser(): Promise<User> {
  return await apiRequest("/me");
}