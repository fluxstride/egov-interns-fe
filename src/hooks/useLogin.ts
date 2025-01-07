import { API } from "@/api";
import { loginUser } from "@/api/auth";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

const useLogin = () => {
  const { setUser } = useAuth();

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: async (data: any) => {
      const response = await loginUser(data.username, data.password);
      const token = response.token;
      localStorage.setItem("token", token);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return response;
    },
    onSuccess: async (data) => {
      setUser(data.user);
    },
    onError: (error: any) => {
      toast({
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });

  return { login, isLoggingIn };
};

export default useLogin;
