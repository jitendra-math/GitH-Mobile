"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// --- EXISTING FUNCTIONS ---

export async function saveToken(formData: FormData) {
  const token = formData.get("token") as string;
  if (!token) return { error: "Token is required" };

  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) return { error: "Invalid PAT. Please check permissions." };

  cookies().set("github_pat", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/dashboard");
}

export async function logoutUser() {
  cookies().delete("github_pat");
  redirect("/");
}

export async function getRepos() {
  const token = cookies().get("github_pat")?.value;
  if (!token) redirect("/");

  const response = await fetch(
    "https://api.github.com/user/repos?sort=updated&per_page=100",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 0 },
    }
  );

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
  const token = cookies().get("github_pat")?.value;
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

// --- NEW ADVANCED GIT API FUNCTIONS ---

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github.v3+json",
  "X-GitHub-Api-Version": "2022-11-28",
});

export async function fetchBranches(owner: string, repo: string) {
  const token = cookies().get("github_pat")?.value;
  if (!token) throw new Error("No token");
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches`,
    { headers: getHeaders(token) }
  );
  if (!res.ok) throw new Error("Failed to fetch branches");
  return res.json();
}

export async function getRepoTree(
  owner: string,
  repo: string,
  branch: string = "main"
) {
  const token = cookies().get("github_pat")?.value;
  if (!token) throw new Error("No token");
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: getHeaders(token) }
  );
  if (!res.ok) throw new Error("Failed to fetch tree");
  const data = await res.json();
  return data.tree;
}

export async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  branch: string = "main"
) {
  const token = cookies().get("github_pat")?.value;
  if (!token) throw new Error("No token");
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    { headers: getHeaders(token) }
  );
  if (!res.ok) throw new Error("Failed to fetch file content");
  return res.json();
}

export async function fetchCommitHistory(
  owner: string,
  repo: string,
  branch: string = "main"
) {
  const token = cookies().get("github_pat")?.value;
  if (!token) throw new Error("No token");
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=15`,
    { headers: getHeaders(token) }
  );
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

// --- NEW: Update repository metadata (name, description, visibility) ---
export async function updateRepo(
  owner: string,
  repo: string,
  data: {
    name?: string;
    description?: string;
    private?: boolean;
  }
) {
  const token = cookies().get("github_pat")?.value;
  if (!token) return { error: "No token" };

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to update repository");
    }

    const updatedRepo = await res.json();
    revalidatePath("/dashboard");
    return { success: true, repo: updatedRepo };
  } catch (error: any) {
    return { error: error.message || "Update failed" };
  }
}

// Internal helper functions for Multi-file Commit
async function createBlob(
  token: string,
  owner: string,
  repo: string,
  content: string
) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/blobs`,
    {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ content, encoding: "base64" }),
    }
  );
  if (!res.ok) throw new Error("Failed to create blob");
  const data = await res.json();
  return data.sha;
}

// Main function to commit multiple files
export async function commitMultipleFiles(
  owner: string,
  repo: string,
  branch: string,
  files: any[]
) {
  const token = cookies().get("github_pat")?.value;
  if (!token) throw new Error("No token");

  try {
    let res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`,
      { headers: getHeaders(token) }
    );
    if (!res.ok) throw new Error("Failed to get branch ref");
    const refData = await res.json();
    const latestCommitSha = refData.object.sha;

    res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`,
      { headers: getHeaders(token) }
    );
    const commitData = await res.json();
    const baseTreeSha = commitData.tree.sha;

    const treeItems = await Promise.all(
      files.map(async (file) => {
        if (file.isDelete) {
          return { path: file.path, mode: "100644", type: "blob", sha: null };
        } else {
          const blobSha = await createBlob(
            token,
            owner,
            repo,
            file.contentBase64
          );
          return { path: file.path, mode: "100644", type: "blob", sha: blobSha };
        }
      })
    );

    res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
    });
    if (!res.ok) throw new Error("Failed to create tree");
    const newTreeData = await res.json();

    const message = files.some((f) => f.isDelete)
      ? "Updates & Deletions via Repo Manager 🚀"
      : "Update via Repo Manager 🚀";
    res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits`,
      {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({
          message,
          tree: newTreeData.sha,
          parents: [latestCommitSha],
        }),
      }
    );
    if (!res.ok) throw new Error("Failed to create commit");
    const newCommitData = await res.json();

    res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      {
        method: "PATCH",
        headers: getHeaders(token),
        body: JSON.stringify({ sha: newCommitData.sha }),
      }
    );
    if (!res.ok) throw new Error("Failed to update branch ref");

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Commit failed" };
  }
}

export async function rollbackToCommit(
  owner: string,
  repo: string,
  branch: string,
  targetCommitSha: string
) {
  const token = cookies().get("github_pat")?.value;
  if (!token) throw new Error("No token");

  try {
    let res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`,
      { headers: getHeaders(token) }
    );
    if (!res.ok) throw new Error("Failed to get branch ref");
    const refData = await res.json();
    const latestBranchCommitSha = refData.object.sha;

    res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits/${targetCommitSha}`,
      { headers: getHeaders(token) }
    );
    if (!res.ok) throw new Error("Failed to get target commit");
    const targetCommitObj = await res.json();
    const oldTreeSha = targetCommitObj.tree.sha;

    const shortSha = targetCommitSha.substring(0, 7);
    const commitMessage = `Rollback to commit ${shortSha} via Repo Manager ⏪`;

    res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits`,
      {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({
          message: commitMessage,
          tree: oldTreeSha,
          parents: [latestBranchCommitSha],
        }),
      }
    );
    if (!res.ok) throw new Error("Failed to create rollback commit");
    const newCommitData = await res.json();

    res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      {
        method: "PATCH",
        headers: getHeaders(token),
        body: JSON.stringify({ sha: newCommitData.sha }),
      }
    );
    if (!res.ok) throw new Error("Failed to update branch ref");

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Rollback failed" };
  }
}