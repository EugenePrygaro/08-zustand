import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

const tagDescriptions: { [key: string]: string } = {
  all: "All notes",
  work: "Notes related to work",
  personal: "Personal notes",
  ideas: "Creative ideas and thoughts",
};
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  return {
    title: `Filter: ${slug[0]}`,
    description:
      tagDescriptions[slug[0]] ||
      "Explore your notes with ease using our filter feature.",
  };
};

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const queryClient = new QueryClient();
  const tag = slug[0];
  const isAll = tag === "all";
  const queryKey = isAll ? ["notes", 1, ""] : ["notes", 1, "", tag];
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => fetchNotes(1, 12, "", isAll ? undefined : tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
