import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Types matching the GraphQL response structure we need
export interface ContributionDay {
    contributionCount: number;
    date: string;
    weekday: number; // 0 = Sunday, 1 = Monday, etc.
}

export interface Week {
    contributionDays: ContributionDay[];
}

export interface LanguageParam {
    size: number;
    node: {
        name: string;
        color: string;
    };
}

export interface Repository {
    name: string;
    languages: {
        edges: LanguageParam[];
    };
}

export interface UserData {
    name: string;
    avatarUrl: string;
    contributionsCollection: {
        totalCommitContributions: number;
        totalIssueContributions: number;
        totalPullRequestContributions: number;
        contributionCalendar: {
            totalContributions: number;
            weeks: Week[];
        };
        commitContributionsByRepository: {
            repository: {
                name: string;
                description: string | null;
                stargazerCount: number;
                languages: {
                    nodes: {
                        name: string;
                        color: string;
                    }[];
                };
            };
            contributions: {
                totalCount: number;
            };
        }[];
    };
    topRepositories: {
        nodes: Repository[];
    };
}

export interface LanguageStat {
    name: string;
    color: string;
    size: number;
    percentage: number;
}

export interface WrappedStats {
    username: string; // We'll pass this through or get from name
    name: string;
    avatarUrl: string;
    totalContributions: number;
    longestStreak: number;
    currentStreak: number;
    busiestDay: { date: string; count: number };
    topLanguages: LanguageStat[];
    personality: "Weekend Warrior" | "9-to-5 Pro" | "The Architect" | "Bug Hunter";
    rank: string;
    contributionBreakdown: {
        commits: number;
        issues: number;
        prs: number;
    };
    weeks: Week[]; // Raw calendar data for visualization
    topProject: {
        name: string;
        commits: number;
        description: string;
        stars: number;
        language: { name: string; color: string } | null;
    } | null;
}

export function calculateStats(data: UserData): WrappedStats {
    const calendar = data.contributionsCollection.contributionCalendar;

    // Total contributions from the summary field
    const total = calendar.totalContributions;

    // Flatten days
    const days: ContributionDay[] = [];
    calendar.weeks.forEach((week) => {
        week.contributionDays.forEach((day) => {
            // API returns valid dates within the calendar range
            if (day.date) {
                days.push(day);
            }
        });
    });

    // Streaks
    let currentStreak = 0;
    let maxStreak = 0;
    let tempCurrent = 0;

    for (const day of days) {
        if (day.contributionCount > 0) {
            tempCurrent++;
            if (tempCurrent > maxStreak) maxStreak = tempCurrent;
        } else {
            tempCurrent = 0;
        }
    }
    currentStreak = tempCurrent;

    // Busiest Day & Weekday vs Weekend Logic
    let maxDayCount = 0;
    let busiestDayDate = "";
    let weekendContributions = 0;
    let weekdayContributions = 0;

    days.forEach((day) => {
        // Track busiest day (specific date)
        if (day.contributionCount > maxDayCount) {
            maxDayCount = day.contributionCount;
            busiestDayDate = day.date;
        }

        // Weekday vs Weekend (0=Sunday, 6=Saturday)
        if (day.contributionCount > 0) {
            if (day.weekday === 0 || day.weekday === 6) {
                weekendContributions += day.contributionCount;
            } else {
                weekdayContributions += day.contributionCount;
            }
        }
    });

    // Calculate Personality
    const totalForPersonality = weekendContributions + weekdayContributions;
    const weekendRatio = totalForPersonality > 0 ? weekendContributions / totalForPersonality : 0;

    let personality: WrappedStats['personality'] = "9-to-5 Pro";
    if (weekendRatio > 0.2) personality = "Weekend Warrior";

    // Add more personalities
    if (data.contributionsCollection.totalIssueContributions > data.contributionsCollection.totalCommitContributions) {
        personality = "Bug Hunter";
    }
    if (data.contributionsCollection.totalPullRequestContributions > 100) {
        personality = "The Architect";
    }

    // Top Languages
    const languageMap: Record<string, { size: number; color: string }> = {};

    if (data.topRepositories && data.topRepositories.nodes) {
        data.topRepositories.nodes.forEach((repo) => {
            if (repo.languages && repo.languages.edges) {
                repo.languages.edges.forEach((edge) => {
                    if (!languageMap[edge.node.name]) {
                        languageMap[edge.node.name] = { size: 0, color: edge.node.color };
                    }
                    languageMap[edge.node.name].size += edge.size;
                });
            }
        });
    }

    const totalBytes = Object.values(languageMap).reduce((acc, curr) => acc + curr.size, 0);
    const topLanguages = Object.entries(languageMap)
        .map(([name, { size, color }]) => ({
            name,
            color,
            size,
            percentage: totalBytes > 0 ? Math.round((size / totalBytes) * 100) : 0,
        }))
        .sort((a, b) => b.size - a.size) // sort by size desc
        .slice(0, 3); // top 3


    // Rank
    let rank = "Tourist";
    if (total >= 1000) rank = "10x Engineer";
    else if (total >= 500) rank = "Senior Dev";
    else if (total >= 200) rank = "Contributor";
    else if (total >= 100) rank = "Hobbyist";
    else rank = "Tourist";

    // Top Project
    let topProject = null;
    if (data.contributionsCollection.commitContributionsByRepository && data.contributionsCollection.commitContributionsByRepository.length > 0) {
        const topRepo = data.contributionsCollection.commitContributionsByRepository[0];
        topProject = {
            name: topRepo.repository.name,
            commits: topRepo.contributions.totalCount,
            description: topRepo.repository.description || "",
            stars: topRepo.repository.stargazerCount,
            language: topRepo.repository.languages.nodes[0] ? {
                name: topRepo.repository.languages.nodes[0].name,
                color: topRepo.repository.languages.nodes[0].color
            } : null
        };
    }

    return {
        username: data.name || "User",
        name: data.name,
        avatarUrl: data.avatarUrl,
        totalContributions: total,
        longestStreak: maxStreak,
        currentStreak,
        busiestDay: { date: busiestDayDate, count: maxDayCount },
        topLanguages,
        personality,
        rank,
        contributionBreakdown: {
            commits: data.contributionsCollection.totalCommitContributions,
            issues: data.contributionsCollection.totalIssueContributions,
            prs: data.contributionsCollection.totalPullRequestContributions
        },
        weeks: calendar.weeks,
        topProject
    };
}
