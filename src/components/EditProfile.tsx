import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { useAuth } from "@/hooks/useAuth";
import { updateUserProfile } from "@/api/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  firstName: z.string().min(1, { message: "Your first name is required" }),
  lastName: z.string().min(1, { message: "Your last name is required" }),
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  email: z.string().email({ message: "A valid email is required" }),
  bio: z.string().min(1, {
    message: "Bio is required.",
  }),
  dob: z.date({
    required_error: "Your date of birth is required.",
  }),
  schoolName: z.string().min(1, {
    message: "Your school name is required",
  }),
  schoolDepartment: z.string().min(1, {
    message: "Your department name is required",
  }),
});

export const EditProfile = ({ profileData }: { profileData: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      username: profileData.username,
      email: profileData.email,
      bio: profileData.bio ?? "Feel free to follow me, I don't bite 😁",
      schoolName: profileData.schoolName,
      schoolDepartment: profileData.schoolDepartment,
      dob: new Date(profileData.dob),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateUserProfile(profileData.id, data),
    onSettled: async (data, error: any) => {
      if (error) {
        return toast({
          description: error.response.data.message,
          variant: "destructive",
        });
      }

      setUser(data.profile);
      router.replace(`/${data.profile.username}`);
      setIsOpen(false);
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) =>
    mutate(data as unknown as any);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen || isPending}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll h-full sm:h-[90%] flex flex-col gap-4">
        <div className="space-y-2">
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription className="mt-2">
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Username*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Email*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">First Name*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Last Name*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Bio*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">School Name*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schoolDepartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    School Department*
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth*</FormLabel>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? new Date(profileData.dob)}
                        onSelect={(e) => {
                          field.onChange(e);
                          setIsCalendarOpen(false);
                        }}
                        initialFocus
                        required
                        captionLayout="dropdown"
                        fromYear={1900}
                        toYear={2024}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-8" disabled={isPending}>
              {isPending ? "Saving changes" : "Save changes"}
              {isPending && (
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-white ml-4"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
