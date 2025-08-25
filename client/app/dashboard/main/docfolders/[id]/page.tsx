// client/app/dashboard/main/docfolders/[id]/page.tsx
import FoldersDetail from "@/components/Folders.Detail";
import { notFound } from "next/navigation";

export default function DocFolderDetailPage({
  params,
}: {
  params: { id?: string };
}) {
  const id = params?.id;
  if (!id) return notFound(); // safety

  return <FoldersDetail folderId={id} />;
}
