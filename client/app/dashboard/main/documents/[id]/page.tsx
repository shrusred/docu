// client/app/dashboard/main/documents/[id]/page.tsx
import DocumentDetailView from "@/components/Documents.DetailView";

export default function DocumentPage({ params }: { params: { id: string } }) {
  // params.id comes from the [id] segment
  return <DocumentDetailView documentId={params.id} />;
}
