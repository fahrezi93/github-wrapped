"use server";

import { calculateStats, type WrappedStats, type UserData } from "@/lib/utils";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

const query = `
  query($username: String!) {
    user(login: $username) {
      name
      avatarUrl
      contributionsCollection {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
        commitContributionsByRepository(maxRepositories: 5) {
          repository {
            name
            description
            stargazerCount
            languages(first: 1) {
              nodes {
                name
                color
              }
            }
          }
          contributions {
            totalCount
          }
        }
      }
      topRepositories(first: 6, orderBy: {field: STARGAZERS, direction: DESC}) {
        nodes {
          name
          languages(first: 3) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchUserStats(formData: FormData): Promise<{ error?: string; data?: WrappedStats }> {
  const username = formData.get("username") as string;

  if (!username) {
    return { error: "Username is required" };
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { error: "GitHub Token not configured on server" };
  }

  try {
    const res = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 60 }, // Cache for 60s
    });

    if (!res.ok) {
      return { error: `GitHub API Error: ${res.statusText}` };
    }

    const json = await res.json();

    if (json.errors) {
      // Handle "Could not resolve to a User" specifically if possible, or generic
      return { error: json.errors[0].message || "User not found or API error" };
    }

    if (!json.data || !json.data.user) {
      return { error: "User not found" };
    }

    const userData: UserData = json.data.user;
    const stats = calculateStats(userData);

    return { data: stats };

  } catch (err: any) {
    console.error(err);
    return { error: "Internal Server Error" };
  }
}
