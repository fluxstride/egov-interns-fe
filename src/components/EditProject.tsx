"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Loader2Icon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProject } from "../api/project";
import { toast } from "./ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  description: z
    .string()
    .min(1, { message: "Project description is required" }),
  technologies: z.string().min(1, {
    message: "Project technologies are required",
  }),
  link: z
    .string()
    .min(1, { message: "Project link is required" })
    .url({ message: "Project link should be a valid link" }),
  githubRepo: z
    .string()
    .min(1, {
      message: "Project github repo link is required",
    })
    .url({ message: "Project github repo link should be a valid link" }),
});

export const EditProject = ({
  show,
  setShow,
  project,
}: {
  show: boolean;
  setShow: any;
  project: any;
}) => {
  const { user } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      name: project?.name,
      description: project?.description,
      technologies: project?.technologies,
      link: project?.link,
      githubRepo: project?.githubRepo,
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => editProject(data, user.id, project.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      setShow(false);
      toast({ description: "Project updated successfully", duration: 1000 });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    mutate(data as unknown as any);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }

    setShow(open);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={show}>
      <DialogContent className="overflow-y-auto h-full sm:h-[90%] display flex flex-col gap-4">
        <div className="space-y-2">
          <DialogTitle>Edit project information</DialogTitle>
          <DialogDescription className="mt-2">
            Edit project information
          </DialogDescription>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Project Name*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    Project Description*
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    Technologies Used*
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    List of technologies and language used seperated by comma
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Project Link*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="githubRepo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    Github Repo Link*
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="mt-8 flex gap-1 items-center"
              disabled={isPending}
            >
              {isPending ? "Saving changes" : "Save changes"}
              {isPending && <Loader2Icon className="w-4 h-4 animate-spin" />}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
