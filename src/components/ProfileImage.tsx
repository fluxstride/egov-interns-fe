import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import Image from "next/image";

export const ProfileImage = ({ profileData }: { profileData: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [showImageFallback, setShowImageFallback] = useState(false);

  useEffect(() => {
    setShowImageFallback(false);
    console.log("profile image changed");
  }, [user]);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="p-0 w-20 h-20 rounded-full overflow-hidden bg-slate-50 hover:bg-slate-50 border-slate-200 border-2 text-black font-medium text-2xl">
          {showImageFallback ? (
            <>
              <span>
                {`${profileData.firstName[0].toUpperCase()}${profileData.lastName[0].toUpperCase()}`}
              </span>
              <span className="sr-only">Profile Image</span>
            </>
          ) : (
            <Image
              src={profileData.profileImage ?? "/"}
              alt="Profile Image"
              width={300}
              height={300}
              className="w-full h-full object-cover object-center"
              onError={() => setShowImageFallback(true)}
            />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] aspect-square overflow-y-hidden w-[90%] p-0 rounded-lg grid place-items-center">
        {showImageFallback ? (
          <>
            <span>No Profile image</span>
            <span className="sr-only">Profile Image</span>
          </>
        ) : (
          <Image
            src={profileData.profileImage ?? "/"}
            alt="Profile Image"
            width={300}
            height={300}
            className="w-full h-full object-cover object-center"
            onError={() => setShowImageFallback(true)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
