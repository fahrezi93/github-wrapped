# GitHub Wrapped MVP Walkthrough

The GitHub Wrapped application has been successfully upgraded with advanced stats, a "Story" interface, and sharing capabilities.

## Prerequisites
To run the application, you need a GitHub Personal Access Token.

1. Create a [GitHub PAT](https://github.com/settings/tokens) with `read:user` scope.
2. Create a `.env.local` file in the root directory:
   ```env
   GITHUB_TOKEN=your_token_here
   ```

## Running the Application
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).

## Features Verified
- **Landing Page**: Minimalist input form.
- **Server Action**: Securely fetches detailed contribution data (commits, PRs, issues, languages).
- **Story UI**: 
  - **Intro**: Personalized greeting.
  - **The Numbers**: Total contribution count.
  - **The Streak**: Longest streak visualization.
  - **Top Languages**: Most used languages breakdown.
  - **Personality**: "Weekend Warrior" vs "9-to-5 Pro" analysis.
  - **Summary**: Downloadable card sharing your year in code.
- **Share**: One-click download of the summary card.
- **Responsive Design**: Mobile-first fullscreen experience.

## Testing
1. Enter a valid GitHub username (e.g., `torvalds` or `leerob`).
2. Tap right/left to navigate slides.
3. Verify the correct calculations for streaks and stats.
4. On the final slide, click "Save Card" to test the image generation.
