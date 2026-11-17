
import { supabase } from "../../lib/supabase";

export type NewsItem = {
  id: string;
  date: string;
  title: string;
  preview: string;
  content: string;
  image?: string;
  created_at?: string;
};

const ADMIN_ID = 1421627625;
const FUNCTION_NAME = "manage-news-";

type TelegramWebApp = {
  initData?: string;
  initDataUnsafe?: {
    user?: {
      id?: number;
    };
  };
};

function getTelegramWebApp(): TelegramWebApp | undefined {
  return (
    window as Window & {
      Telegram?: {
        WebApp?: TelegramWebApp;
      };
    }
  ).Telegram?.WebApp;
}

export function isNewsAdmin(): boolean {
  const userId = getTelegramWebApp()?.initDataUnsafe?.user?.id;
  return Number(userId) === ADMIN_ID;
}

async function callNewsFunction(body: Record<string, unknown>) {
  const initData = getTelegramWebApp()?.initData;

  if (!initData) {
    throw new Error("Открой приложение через Telegram");
  }

  const { data, error } = await supabase.functions.invoke(
    FUNCTION_NAME,
    {
      body: { ...body, initData },
    },
  );

  if (error) {
    console.error("Ошибка функции новостей:", error);
    throw error;
  }

  if (!data?.success) {
    throw new Error(data?.error || "Операция не выполнена");
  }

  return data;
}

export async function getNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select("id, date, title, preview, content, image, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка загрузки новостей:", error);
    throw error;
  }

  return (data ?? []).map((item) => ({
    ...item,
    id: String(item.id),
    image: item.image ?? undefined,
  }));
}

export async function getNewsById(
  id: string,
): Promise<NewsItem | undefined> {
  const { data, error } = await supabase
    .from("news")
    .select("id, date, title, preview, content, image, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Ошибка загрузки статьи:", error);
    throw error;
  }

  if (!data) return undefined;

  return {
    ...data,
    id: String(data.id),
    image: data.image ?? undefined,
  };
}

export async function addNews(
  item: Omit<NewsItem, "id" | "created_at">,
): Promise<NewsItem> {
  const data = await callNewsFunction({
    action: "create",
    item,
  });

  if (!data.news) {
    throw new Error("Сервер не вернул созданную новость");
  }

  return {
    ...data.news,
    id: String(data.news.id),
    image: data.news.image ?? undefined,
  };
}

export async function updateNews(
  id: string,
  item: Omit<NewsItem, "id" | "created_at">,
): Promise<NewsItem> {
  const data = await callNewsFunction({
    action: "update",
    id,
    item,
  });

  if (!data.news) {
    throw new Error("Сервер не вернул обновлённую новость");
  }

  return {
    ...data.news,
    id: String(data.news.id),
    image: data.news.image ?? undefined,
  };
}

export async function deleteNews(id: string): Promise<void> {
  await callNewsFunction({
    action: "delete",
    id,
  });
}
