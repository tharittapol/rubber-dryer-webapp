import ProfileEditor from "@/components/profiles/ProfileEditor";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileEditor mode="edit" id={id} />;
}