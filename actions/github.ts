"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function saveToken(formData: FormData) {
  const token = formData.get("token") as string;
  if (!token) return { error: "Token is required" };

  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    return { error: "Invalid PAT. Please check permissions." };
  }

  cookies().set("github_pat", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/dashboard");
}

export async function getRepos() {
  const cookieStore = cookies();
  const token = cookieStore.get("github_pat")?.value;
  if (!token) redirect("/");

  const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    if (response.status === 401) {
      cookies().delete("github_pat");
      redirect("/");
    }
    throw new Error("Failed to fetch");
  }

  return response.json();
}

export async function deleteRepo(owner: string, repo: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("github_pat")?.value;
  
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) throw new Error("Failed to delete repository");
  
  revalidatePath("/dashboard");
  return { success: true };
}
