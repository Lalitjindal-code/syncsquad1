import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, User } from "lucide-react";

interface ProfileData {
  name: string;
  dob: string;
  gender: string;
  nationality: string;
  preferredLanguage: string;
}

interface ProfileViewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData | null;
  onUpdate: (profile: ProfileData) => void;
}

export const ProfileViewEditModal = ({
  isOpen,
  onClose,
  profile,
  onUpdate,
}: ProfileViewEditModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    dob: "",
    gender: "",
    nationality: "",
    preferredLanguage: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatGender = (gender: string) => {
    return gender
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatLanguage = (lang: string) => {
    return lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isEditing ? "Edit Profile" : "Your Profile"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your profile information below."
              : "View your profile details. Click Edit to make changes."}
          </DialogDescription>
        </DialogHeader>

        {!isEditing ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Full Name</Label>
              <p className="text-foreground font-medium">{profile.name}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Date of Birth</Label>
              <p className="text-foreground font-medium">{formatDate(profile.dob)}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Gender</Label>
              <p className="text-foreground font-medium">{formatGender(profile.gender)}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Nationality</Label>
              <p className="text-foreground font-medium">{profile.nationality}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Preferred Language</Label>
              <p className="text-foreground font-medium">{formatLanguage(profile.preferredLanguage)}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dob">Date of Birth *</Label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger id="edit-gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-nationality">Nationality *</Label>
                <Input
                  id="edit-nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-preferredLanguage">Preferred Language *</Label>
                <Select
                  value={formData.preferredLanguage}
                  onValueChange={(value) => setFormData({ ...formData, preferredLanguage: value })}
                >
                  <SelectTrigger id="edit-preferredLanguage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="odia">Odia</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                    <SelectItem value="gujarati">Gujarati</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                    <SelectItem value="kannada">Kannada</SelectItem>
                    <SelectItem value="malayalam">Malayalam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        )}

        {!isEditing && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

