import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ARTICLES,
  getArticleById,
} from "@/components/BookLogCarousel/articles";
import NotebookArticle from "@/components/Menu/NotebookArticle";
import Footer from "@/components/sections/Footer/Footer";

type Props = { params: Promise<{ articleId: string }> };

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ articleId: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { articleId } = await params;
  const article = getArticleById(articleId);
  if (!article) return { title: "Reading · Haz." };
  return {
    title: `${article.title} · Haz.`,
    description: article.excerpt,
  };
}

export default async function ReadingArticlePage({ params }: Props) {
  const { articleId } = await params;
  const article = getArticleById(articleId);
  if (!article) notFound();

  return (
    <>
      <NotebookArticle article={article} paper="blank" />
      <Footer />
    </>
  );
}
