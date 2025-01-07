"use client";

import { deleteProject, fetchProjects } from "@/api/project";
import { AddProject } from "@/components/AddProject";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Github,
  Globe2,
  Loader2,
  MoreVertical,
  PencilRuler,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { EditProject } from "./EditProject";

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
  githubRepo: string;
}

const UserProjects = ({ userId }: { userId: string }) => {
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [activeProject, setActiveProject] = useState<any>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(userId),
    staleTime: Infinity,
  });

  const projects: Project[] = data?.data;

  const queryClient = useQueryClient();

  const closeProjectDeletion = () => {
    setShowDeleteModal(false);
    setActiveProject(null);
  };

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId, user.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ description: "Project deleted successfully", duration: 1000 });
      closeProjectDeletion();
    },
    onError: (error: any) => {
      toast({
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 mt-4">
        {Array.from({ length: 2 }).map((_, index) => {
          return (
            <div
              className="border-2 border-slate-100 shadow-sm py-6 px-4 rounded-lg"
              key={index}
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <div className="space-y-[2px]">
                  <Skeleton className="h-1 w-1 rounded-full" />
                  <Skeleton className="h-1 w-1 rounded-full" />
                  <Skeleton className="h-1 w-1 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-4 w-[250px] mt-3" />
              <Skeleton className="h-4 w-24 mt-6" />
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex justify-between mt-12">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center">
        <p className="font-bold">Projects</p>
        {userId === user.id && <AddProject />}
      </div>
      <div className="space-y-6 mt-4">
        {projects.length === 0 && <p>No projects to show</p>}
        {projects &&
          projects.map((project) => (
            <div
              key={project.id}
              className="border-2 border-slate-100 shadow-sm py-6 px-4 mt-2 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-bold">{project.name}</h2>

                {userId === user.id && (
                  <DropdownMenu
                    onOpenChange={(open) => {
                      if (open) {
                        return setActiveProject(project);
                      }
                      setShowDropdownMenu(false);
                    }}
                    open={showDropdownMenu && activeProject?.id === project.id}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 rounded-full"
                        onClick={() => setShowDropdownMenu(true)}
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setShowEditModal(true);
                          setShowDropdownMenu(false);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <p className="text-sm mt-2">{project.description}</p>
              <h3 className="font-semibold mt-4 flex items-center gap-1">
                <p>Build with</p> <PencilRuler className="w-4 h-4" />
              </h3>
              <>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.technologies
                    .split(",")
                    .map((item: string, id: number) => (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="font-semibold"
                      >
                        {item}
                      </Badge>
                    ))}
                </div>
              </>
              <div className="flex justify-between mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center  gap-1 border-slate-700"
                  asChild
                >
                  <Link
                    href={project.githubRepo}
                    title={project.githubRepo}
                    prefetch
                  >
                    <Github className="w-4 h-4" />
                    <p className="text-xs font-bold">View code</p>
                  </Link>
                </Button>
                <Button
                  className="flex items-center  gap-1"
                  size="sm"
                  asChild
                  title={project.link}
                >
                  <Link href={project.link}>
                    <Globe2 className="w-4 h-4" />
                    <p className="text-xs">View project</p>
                  </Link>
                </Button>
              </div>
            </div>
          ))}
      </div>

      <AlertDialog open={showDeleteModal}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={closeProjectDeletion}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={() => mutate(activeProject.id)}
            >
              {isDeleting ? (
                <div className="flex items-center gap-1">
                  <p>Deleting</p>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditProject
        show={showEditModal}
        setShow={setShowEditModal}
        project={activeProject}
      />
    </div>
  );
};

export default UserProjects;
