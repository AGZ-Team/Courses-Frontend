"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import { updateUserProfile, updateUserProfileWithFiles } from "@/services/userProfileService";

export default function ProfileSettingsPanel() {
  const t = useTranslations("dashboardProfile");
  const locale = useLocale();
  const isAr = locale === "ar";

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-6 space-y-1 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#0b0b2b]">{t("title")}</h1>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
      </div>

      <Card className="mx-auto max-w-6xl rounded-3xl border border-gray-100 bg-white/95 shadow-[0_10px_40px_rgba(13,13,18,0.05)] transition-shadow duration-200 hover:shadow-[0_16px_50px_rgba(13,13,18,0.09)]">
        <CardHeader className="border-b border-gray-100 pb-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className={`w-full ${isAr ? "items-end" : "items-start"}`}
          >
            {/* Mobile: stacked full-width pills. Desktop: equal-width horizontal pills filling the rail. */}
            <TabsList className="mt-2 flex w-full flex-col gap-2 rounded-full bg-gray-100/80 p-2 shadow-sm sm:flex-row sm:flex-wrap">
              <TabsTrigger
                value="profile"
                className="w-[50%] rounded-full px-5 py-2 text-xs sm:flex-1 sm:px-8 sm:py-2 sm:text-sm md:text-[15px] font-medium text-gray-600 transition-all duration-150 hover:bg-primary/10 hover:text-[#0b0b2b] hover:shadow-sm data-[state=active]:bg-[#0bb2b0] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_20px_rgba(11,178,176,0.45)]"
              >
                {t("tabs.profile")}
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="w-[50%] rounded-full px-5 py-2 text-xs sm:flex-1 sm:px-8 sm:py-2 sm:text-sm md:text-[15px] font-medium text-gray-600 transition-all duration-150 hover:bg-primary/10 hover:text-[#0b0b2b] hover:shadow-sm data-[state=active]:bg-[#0bb2b0] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_20px_rgba(11,178,176,0.45)]"
              >
                {t("tabs.password")}
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="w-[50%] rounded-full px-4 py-2 text-xs sm:flex-1 sm:px-8 sm:py-2 sm:text-sm md:text-[15px] font-medium text-gray-600 transition-all duration-150 hover:bg-primary/10 hover:text-[#0b0b2b] hover:shadow-sm data-[state=active]:bg-[#0bb2b0] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_20px_rgba(11,178,176,0.45)]"
              >
                {t("tabs.social")}
              </TabsTrigger>
              <TabsTrigger
                value="closeAccount"
                className="w-[50%] rounded-full px-5 py-2 text-xs sm:flex-1 sm:px-8 sm:py-2 sm:text-sm md:text-[15px] font-medium text-gray-600 transition-all duration-150 hover:bg-primary/10 hover:text-[#0b0b2b] hover:shadow-sm data-[state=active]:bg-[#0bb2b0] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_20px_rgba(11,178,176,0.45)]"
              >
                {t("tabs.closeAccount")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="w-full tab-panel-slide">
              <ProfileTab isAr={isAr} />
            </TabsContent>
            <TabsContent value="password" className="w-full tab-panel-slide">
              <PasswordTab isAr={isAr} />
            </TabsContent>
            <TabsContent value="social" className="w-full tab-panel-slide">
              <SocialTab isAr={isAr} />
            </TabsContent>
            <TabsContent value="closeAccount" className="w-full tab-panel-slide">
              <CloseAccountTab isAr={isAr} />
            </TabsContent>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6 pb-6">
          {/* The content is rendered inside TabsContent components above */}
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileTab({ isAr }: { isAr: boolean }) {
  const t = useTranslations("dashboardProfile.profile");
  const { user, shouldShowIdCards, updateUser } = useAuthStore();
  const { refetch } = useUserProfile();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    area_of_expertise: user?.area_of_expertise || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        area_of_expertise: user.area_of_expertise || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('Submitting profile update:', formData);
      const updatedUser = await updateUserProfile(formData);
      console.log('Profile updated successfully:', updatedUser);
      updateUser(updatedUser);
      toast.success(isAr ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully', {
        description: isAr
          ? 'تم تحديث بيانات حسابك.'
          : 'Your account information has been updated.',
      });
      
      // Refetch profile to ensure we have the latest data
      await refetch();
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', errorMessage);
      toast.error(isAr ? 'فشل حفظ التغييرات' : 'Failed to save changes', {
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Avatar row */}
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {user?.picture ? (
            <img 
              src={user.picture} 
              alt="Profile" 
              className="h-20 w-20 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-primary/10 to-primary/5 text-primary text-xl font-semibold ring-2 ring-white shadow-sm">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
          )}
          <div className={`${isAr ? "text-right" : "text-left"}`}>
            <p className="text-sm font-medium text-[#0b0b2b]">{t("avatarTitle")}</p>
            <p className="text-xs text-gray-500">{t("avatarHelp")}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Button
            type="button"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 hover:shadow-md cursor-pointer"
          >
            Upload
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-gray-200 bg-white/80 px-5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary cursor-pointer"
          >
            Remove
          </Button>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6 max-w-4xl mx-auto">
        {/* Row 1: Username & Email */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
              {t("username")}
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder={t("placeholders.username")}
              className="rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              {t("email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t("placeholders.email")}
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Row 2: First & Last name */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
              {t("firstName")}
            </Label>
            <Input
              id="firstName"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              placeholder={t("placeholders.firstName")}
              className="rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">
              {t("lastName")}
            </Label>
            <Input
              id="lastName"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              placeholder={t("placeholders.lastName")}
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Row 3: Phone & Expertise */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
              {t("phone")}
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t("placeholders.phone")}
              className="rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="expertise" className="mb-1 block text-sm font-medium text-gray-700">
              {t("expertise")}
            </Label>
            <Input
              id="expertise"
              value={formData.area_of_expertise}
              onChange={(e) => setFormData({ ...formData, area_of_expertise: e.target.value })}
              placeholder={t("placeholders.expertise")}
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Row 4: Bio */}
        <div>
          <Label htmlFor="bio" className="mb-1 block text-sm font-medium text-gray-700">
            {isAr ? "نبذة عنك" : "Bio"}
          </Label>
          <textarea
            id="bio"
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder={isAr ? "اكتب نبذة قصيرة عنك" : "Write a short bio about yourself"}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition hover:border-primary/40 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 resize-none"
          />
        </div>

        {/* ID Cards - Only for instructors and superusers */}
        {shouldShowIdCards() && (
          <div className="border-t border-gray-100 pt-6 space-y-5">
            <h3 className="text-sm font-semibold text-[#0b0b2b]">
              {isAr ? "بطاقة الهوية" : "ID Card"}
            </h3>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="idFront" className="mb-1 block text-sm font-medium text-gray-700">
                  {isAr ? "صورة الهوية الأمامية" : "ID Card Front"}
                </Label>
                {user?.id_card_face && (
                  <img src={user.id_card_face} alt="ID Front" className="mb-2 h-32 w-full object-cover rounded-lg" />
                )}
                <Input
                  id="idFront"
                  type="file"
                  accept="image/*"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="idBack" className="mb-1 block text-sm font-medium text-gray-700">
                  {isAr ? "صورة الهوية الخلفية" : "ID Card Back"}
                </Label>
                {user?.id_card_back && (
                  <img src={user.id_card_back} alt="ID Back" className="mb-2 h-32 w-full object-cover rounded-lg" />
                )}
                <Input
                  id="idBack"
                  type="file"
                  accept="image/*"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-2 flex justify-end border-t border-gray-100 pt-4">
          <Button
            type="submit"
            disabled={saving}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 hover:shadow-md cursor-pointer disabled:opacity-50"
          >
            {saving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : t("save")}
          </Button>
        </div>
      </form>
    </div>
  );
}

function PasswordTab({ isAr }: { isAr: boolean }) {
  const t = useTranslations("dashboardProfile.password");

  return (
    <div className="space-y-5 pt-6 md:space-y-6 max-w-5xl mx-auto">
      <div className="max-w-xl">
        <p className="text-sm text-gray-500">{t("description")}</p>
      </div>

      {/* Row 1: Current password */}
      <div>
        <Field
          label={t("current")}
          id="currentPassword"
          type="password"
          placeholder={t("placeholders.current")}
        />
      </div>

      {/* Row 2: New password */}
      <div>
        <Field
          label={t("new")}
          id="newPassword"
          type="password"
          placeholder={t("placeholders.new")}
        />
      </div>

      {/* Row 3: Confirm new password */}
      <div>
        <Field
          label={t("confirm")}
          id="confirmPassword"
          type="password"
          placeholder={t("placeholders.confirm")}
        />
      </div>

      <div className="mt-2 flex justify-end border-t border-gray-100 pt-4">
        <Button
          type="button"
          className="rounded-full bg-primary px-8 py-2.5 text-sm md:text-base font-semibold text-white shadow-sm transition hover:bg-primary/90 hover:shadow-md cursor-pointer"
        >
          {t("save")}
        </Button>
      </div>
    </div>
  );
}

function SocialTab({ isAr }: { isAr: boolean }) {
  const t = useTranslations("dashboardProfile.social");

  return (
    <div className="space-y-5">
      <div className="max-w-xl">
        <p className="text-sm text-gray-500">{t("description")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label={t("twitter")}
          id="twitter"
          placeholder={t("placeholders.twitter")}
        />
        <Field
          label={t("facebook")}
          id="facebook"
          placeholder={t("placeholders.facebook")}
        />
        <Field
          label={t("instagram")}
          id="instagram"
          placeholder={t("placeholders.instagram")}
        />
        <Field
          label={t("linkedin")}
          id="linkedin"
          placeholder={t("placeholders.linkedin")}
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 hover:shadow-md cursor-pointer"
        >
          {t("save")}
        </Button>
      </div>
    </div>
  );
}

function CloseAccountTab({ isAr }: { isAr: boolean }) {
  const t = useTranslations("dashboardProfile.closeAccount");

  return (
    <div className="space-y-4">
      <p className="text-sm text-red-500">{t("description")}</p>
      <Button
        type="button"
        variant="outline"
        className="rounded-full border-red-200 px-6 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 cursor-pointer"
      >
        {t("button")}
      </Button>
    </div>
  );
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none transition hover:border-primary/40 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
      />
    </div>
  );
}

function NotificationToggle({ label }: { label: string }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/80 px-3.5 py-2.5 text-sm text-gray-800 shadow-sm transition hover:border-primary/30 hover:bg-white hover:shadow-md">
      <span>{label}</span>
      <button
        type="button"
        className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-300 transition-colors hover:bg-primary/60"
      >
        <span className="inline-block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform" />
      </button>
    </label>
  );
}

