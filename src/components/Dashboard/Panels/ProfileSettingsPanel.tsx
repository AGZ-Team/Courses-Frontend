"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import { updateUserProfile, updateUserProfileWithFiles } from "@/services/userProfileService";
import { motion } from "motion/react";
import { Upload, X, Shield, Star, User, Phone, Mail, FileText } from "lucide-react";

export default function ProfileSettingsPanel() {
  const t = useTranslations("dashboardProfile");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { user, updateUser } = useAuthStore();
  const { refetch } = useUserProfile();
  const [saving, setSaving] = useState(false);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const pictureObjectUrlRef = (globalThis as any)._pictureObjectUrlRef ?? { current: null as string | null };
  // Store ref on globalThis to avoid recreating across Fast Refresh in dev.
  ;(globalThis as any)._pictureObjectUrlRef = pictureObjectUrlRef;
  const [hasLocalPictureSelection, setHasLocalPictureSelection] = useState(false);
  const [idCardFaceFile, setIdCardFaceFile] = useState<File | null>(null);
  const [idCardBackFile, setIdCardBackFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    area_of_expertise: user?.area_of_expertise || '',
    bio: user?.bio || '',
    picture: (user?.picture || '') as string | File,
  });

  useEffect(() => {
    if (user) {
      // CRITICAL: Only update picture if we don't have a local file selection
      // This prevents the backend URL from overwriting a user's newly selected file
      setFormData(prev => ({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        area_of_expertise: user.area_of_expertise || '',
        bio: user.bio || '',
        // Keep the previous picture if it's a File object (user-selected file)
        // Otherwise use the backend URL
        picture: hasLocalPictureSelection && prev.picture instanceof File 
          ? prev.picture 
          : (user.picture || ''),
      }));

      // Only set preview from backend if the user hasn't just selected a local file.
      if (!hasLocalPictureSelection && user.picture) {
        setPicturePreview(user.picture);
      }
    }
  }, [user, hasLocalPictureSelection]);

  // Cleanup object URL when component unmounts.
  useEffect(() => {
    return () => {
      if (pictureObjectUrlRef.current) {
        URL.revokeObjectURL(pictureObjectUrlRef.current);
        pictureObjectUrlRef.current = null;
      }
    };
  }, [pictureObjectUrlRef]);

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(isAr ? 'خطأ' : 'Error', {
        description: isAr ? 'الرجاء اختيار ملف صورة' : 'Please select an image file',
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(isAr ? 'خطأ' : 'Error', {
        description: isAr ? 'حجم الصورة كبير جداً (الحد الأقصى 10MB)' : 'Image is too large (max 10MB)',
      });
      return;
    }

    // Create preview (object URL is instant and avoids large base64 strings)
    try {
      if (pictureObjectUrlRef.current) {
        URL.revokeObjectURL(pictureObjectUrlRef.current);
      }
      const objectUrl = URL.createObjectURL(file);
      pictureObjectUrlRef.current = objectUrl;
      setHasLocalPictureSelection(true);
      setPicturePreview(objectUrl);
    } catch {
      // Fallback to FileReader if object URLs are blocked for any reason
      const reader = new FileReader();
      reader.onloadend = () => {
        setHasLocalPictureSelection(true);
        setPicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Store file for submission
    setFormData({ ...formData, picture: file as any });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let updatedUser;
      
      // Check if we have any files to upload (picture, ID cards)
      const pictureIsFile = formData.picture && typeof formData.picture === 'object' && 'name' in formData.picture;
      const hasIdCards = idCardFaceFile || idCardBackFile;
      
      if (pictureIsFile || hasIdCards) {
        // Send each image in a separate request for better reliability
        // Backend handles up to 5MB per file
        
        console.log('Files detected. Uploading each image separately...');
        
        // Step 1: Update text fields first (no files)
        const textFields = {
          username: formData.username,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          area_of_expertise: formData.area_of_expertise,
          bio: formData.bio,
        };
        
        // Only send text fields if any are non-empty
        const hasTextChanges = Object.values(textFields).some(v => v && v.trim());
        if (hasTextChanges) {
          console.log('Updating text fields...');
          try {
            updatedUser = await updateUserProfile(textFields as any);
          } catch (error) {
            console.log('Text update skipped or failed:', error);
          }
        }
        
        // Step 2: Upload profile picture separately
        if (pictureIsFile && formData.picture instanceof File) {
          const pictureFile = formData.picture as File;
          console.log(`Uploading profile picture separately: ${pictureFile.name} (${pictureFile.size} bytes)`);
          
          const pictureFd = new FormData();
          pictureFd.append('picture', pictureFile);
          
          try {
            updatedUser = await updateUserProfileWithFiles(pictureFd);
            console.log('✓ Profile picture uploaded');
          } catch (error) {
            console.error('Profile picture upload failed:', error);
            throw error;
          }
        }
        
        // Step 3: Upload ID card front separately
        if (idCardFaceFile && idCardFaceFile instanceof File) {
          console.log(`Uploading ID front separately: ${idCardFaceFile.name} (${idCardFaceFile.size} bytes)`);
          
          const idFrontFd = new FormData();
          idFrontFd.append('id_card_face', idCardFaceFile);
          
          try {
            updatedUser = await updateUserProfileWithFiles(idFrontFd);
            console.log('✓ ID card front uploaded');
          } catch (error) {
            console.error('ID front upload failed:', error);
            throw error;
          }
        }
        
        // Step 4: Upload ID card back separately
        if (idCardBackFile && idCardBackFile instanceof File) {
          console.log(`Uploading ID back separately: ${idCardBackFile.name} (${idCardBackFile.size} bytes)`);
          
          const idBackFd = new FormData();
          idBackFd.append('id_card_back', idCardBackFile);
          
          try {
            updatedUser = await updateUserProfileWithFiles(idBackFd);
            console.log('✓ ID card back uploaded');
          } catch (error) {
            console.error('ID back upload failed:', error);
            throw error;
          }
        }
      } else {
        // Use regular JSON update for non-file data
        console.log('No files detected. Sending JSON update...');
        updatedUser = await updateUserProfile(formData as any);
      }
      
      // updatedUser should always be defined if we got this far (no exception thrown)
      if (updatedUser) {
        updateUser(updatedUser);
        
        // Clean up object URL if it was used
        if (pictureObjectUrlRef.current) {
          URL.revokeObjectURL(pictureObjectUrlRef.current);
          pictureObjectUrlRef.current = null;
        }
        
        // Update form state with saved data - IMPORTANT: picture must be string URL, not File
        setFormData({
          username: updatedUser.username || '',
          email: updatedUser.email || '',
          first_name: updatedUser.first_name || '',
          last_name: updatedUser.last_name || '',
          phone: updatedUser.phone || '',
          area_of_expertise: updatedUser.area_of_expertise || '',
          bio: updatedUser.bio || '',
          picture: updatedUser.picture || '', // Always string URL from backend
        });
        
        // Update picture preview to show the saved URL (not blob)
        setHasLocalPictureSelection(false); // Allow backend URL to show
        if (updatedUser.picture) {
          setPicturePreview(updatedUser.picture);
        }
      }
      
      // Reset file state after successful upload
      setIdCardFaceFile(null);
      setIdCardBackFile(null);
      
      toast.success(isAr ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully', {
        description: isAr
          ? 'تم تحديث بيانات حسابك.'
          : 'Your account information has been updated.',
      });
      
      await refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Form submission error:', {
        errorMessage,
        errorFull: error,
      });
      toast.error(isAr ? 'فشل حفظ التغييرات' : 'Failed to save changes', {
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="px-4 lg:px-6 pb-20">
      <div className="mb-8 space-y-2 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold bg-linear-to-r from-[#0b0b2b] to-[#1a1a4a] bg-clip-text text-transparent"
        >
          {t("title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500"
        >
          {t("subtitle")}
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto"
      >
        <Card className="border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-xl overflow-hidden rounded-3xl ring-1 ring-gray-100">
          <CardContent className="p-0">


            <div className="p-8 pb-10">
              {/* Avatar Section */}
              <div className="relative mb-10 flex flex-col items-center sm:flex-row sm:items-end sm:justify-between gap-6">
                <div className="relative group">
                  <div 
                    onClick={() => document.getElementById('picture')?.click()}
                    className="relative h-40 w-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden ring-1 ring-gray-100 dark:ring-white/10 cursor-pointer"
                  >
                    {picturePreview ? (
                      <img
                        src={picturePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                        onError={() => {
                          // Local preview failed - user selected invalid file
                          setPicturePreview(null);
                          setHasLocalPictureSelection(false);
                        }}
                      />
                    ) : user?.picture ? (
                      <img
                        src={user.picture}
                        alt="User profile picture"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                        onError={() => {
                          // Backend image failed to load - fall back to initials
                          setPicturePreview(null);
                        }}
                      />
                    ) : (
                      <div 
                        className="flex h-full w-full items-center justify-center bg-[#0bb2b0] text-white text-4xl font-bold"
                        aria-label={`Profile initials: ${user?.first_name?.[0]}${user?.last_name?.[0]}`}
                      >
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  {/* Show backend image link if picture exists but preview failed */}
                  {!picturePreview && user?.picture && (
                    <a 
                      href={user.picture}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-primary hover:underline whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isAr ? 'عرض الصورة' : 'View Image'}
                    </a>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-right rtl:sm:text-left space-y-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h2>
                  <p className="text-gray-500 font-medium">{user?.email}</p>
                  <div className="flex gap-2 justify-center sm:justify-end rtl:sm:justify-start">
                    <Button 
                      type="button"
                      onClick={() => document.getElementById('picture')?.click()}
                      variant="outline" 
                      className="rounded-full border-gray-200 hover:bg-gray-50 hover:text-[#0b0b2b]"
                    >
                      {isAr ? 'تغيير الصورة' : 'Change Photo'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hidden file input for picture upload */}
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                  className="hidden"
                />

                <motion.div variants={item} className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#0b0b2b]">
                      <User className="h-5 w-5 text-primary" />
                      {isAr ? 'المعلومات الشخصية' : 'Personal Information'}
                    </h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">{t("profile.username")}</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all duration-200"
                          placeholder={t("profile.placeholders.username")}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">{t("profile.firstName")}</Label>
                          <Input
                            id="firstName"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            className="h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all duration-200"
                            placeholder={t("profile.placeholders.firstName")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">{t("profile.lastName")}</Label>
                          <Input
                            id="lastName"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            className="h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all duration-200"
                            placeholder={t("profile.placeholders.lastName")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#0b0b2b]">
                      <Mail className="h-5 w-5 text-primary" />
                      {isAr ? 'معلومات الاتصال' : 'Contact Details'}
                    </h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("profile.email")}</Label>
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all duration-200 pl-10 rtl:pl-4 rtl:pr-10"
                            placeholder={t("profile.placeholders.email")}
                          />
                          <Mail className="absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("profile.phone")}</Label>
                        <div className="relative">
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all duration-200 pl-10 rtl:pl-4 rtl:pr-10"
                            placeholder={t("profile.placeholders.phone")}
                          />
                          <Phone className="absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={item} className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-[#0b0b2b]">
                    <Star className="h-5 w-5 text-primary" />
                    {isAr ? 'الخبرة والنبذة' : 'Expertise & Bio'}
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="expertise">{t("profile.expertise")}</Label>
                      <Input
                        id="expertise"
                        value={formData.area_of_expertise}
                        onChange={(e) => setFormData({ ...formData, area_of_expertise: e.target.value })}
                        className="h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all duration-200"
                        placeholder={t("profile.placeholders.expertise")}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">{isAr ? "نبذة عنك" : "Bio"}</Label>
                      <textarea
                        id="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder={isAr ? "اكتب نبذة قصيرة عنك" : "Write a short bio about yourself"}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-900 shadow-sm outline-none transition-all duration-200 hover:border-primary/40 focus:bg-white focus:border-primary focus:ring-[3px] focus:ring-primary/20 resize-none"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={item} className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-[#0b0b2b]">
                    <Shield className="h-5 w-5 text-primary" />
                    {isAr ? "بطاقة الهوية" : "Identity Documents"}
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <IDCardUploader
                      label={isAr ? "صورة الهوية الأمامية" : "ID Card Front"}
                      imageSrc={user?.id_card_face}
                      id="idFront"
                      onUpload={setIdCardFaceFile}
                    />
                    <IDCardUploader
                      label={isAr ? "صورة الهوية الخلفية" : "ID Card Back"}
                      imageSrc={user?.id_card_back}
                      id="idBack"
                      onUpload={setIdCardBackFile}
                    />
                  </div>
                </motion.div>

                <motion.div variants={item} className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="min-w-[140px] h-12 rounded-full bg-[#0b0b2b] hover:bg-[#1a1a4a] text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:shadow-blue-900/40 hover:-translate-y-0.5"
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <span className="font-semibold text-base">{t("profile.save")}</span>
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function IDCardUploader({ 
  label, 
  imageSrc, 
  id,
  onUpload 
}: { 
  label: string, 
  imageSrc?: string | null, 
  id: string,
  onUpload?: (file: File | null) => void 
}) {
  const [preview, setPreview] = useState<string | null>(imageSrc || null);
  const [fileName, setFileName] = useState<string>("");
  const objectUrlRef = (globalThis as any)[`_${id}_objectUrlRef`] ?? { current: null as string | null };
  // Store ref on globalThis to avoid recreating across Fast Refresh in dev.
  ;(globalThis as any)[`_${id}_objectUrlRef`] = objectUrlRef;
  const [hasLocalSelection, setHasLocalSelection] = useState(false);

  // Update preview when imageSrc changes (e.g., after save or user change)
  useEffect(() => {
    if (!hasLocalSelection && imageSrc) {
      setPreview(imageSrc);
      setFileName(""); // Clear file name since this is a saved image URL
    }
  }, [imageSrc, hasLocalSelection]);

  // Cleanup object URL when component unmounts.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [objectUrlRef]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Error", {
        description: "Please select an image file",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Error", {
        description: "Image is too large (max 10MB)",
      });
      return;
    }

    // Create preview (object URL is instant and avoids huge base64 strings)
    try {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;
      setHasLocalSelection(true);
      setPreview(objectUrl);
      setFileName(file.name);
      onUpload?.(file);
    } catch {
      // Fallback to FileReader if object URLs are blocked
      const reader = new FileReader();
      reader.onloadend = () => {
        setHasLocalSelection(true);
        setPreview(reader.result as string);
        setFileName(file.name);
        onUpload?.(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreview(null);
    setFileName("");
    setHasLocalSelection(false);
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
    if (onUpload) {
      onUpload(null);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="block text-sm font-medium text-gray-700">
        {label}
      </Label>

      <div className="relative">
        <div
          onClick={() => document.getElementById(id)?.click()}
          className="relative cursor-pointer group"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 hover:border-primary hover:bg-primary/5 transition-all group-hover:bg-primary/5">
            {preview ? (
              <>
                <img 
                  src={preview} 
                  alt={label} 
                  className="h-full w-full object-cover group-hover:opacity-75 transition-opacity"
                  onError={() => {
                    // Local preview failed - user selected invalid file
                    setPreview(null);
                    setHasLocalSelection(false);
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="h-6 w-6 text-white" />
                </div>

                {/* Clear button */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-primary transition-colors">
                <FileText className="h-8 w-8 opacity-50" />
                <span className="text-xs font-medium">Click to upload</span>
              </div>
            )}
          </div>

          <Input
            id={id}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        
        {/* Show backend image link if no preview but imageSrc exists (image failed to load) */}
        {!preview && imageSrc && (
          <a 
            href={imageSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-xs text-primary hover:underline text-center"
            onClick={(e) => e.stopPropagation()}
          >
            View saved image
          </a>
        )}
      </div>

      {fileName && (
        <p className="text-xs text-gray-500 truncate">
          Selected: {fileName}
        </p>
      )}
    </div>
  );
}
