import { API } from "@/api";
import { registerUser } from "@/api/auth";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

const useSignup = () => {
  const { setUser } = useAuth();

  const { mutate: signup, isPending: isSigningUp } = useMutation({
    mutationFn: async (data: any) => {
      const response = await registerUser(data);
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

  return {
    signup,
    isSigningUp,
  };
};

export default useSignup;
