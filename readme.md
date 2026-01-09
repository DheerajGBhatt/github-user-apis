## Objective

Build a **Node.js REST API** that retrives data for a given GitHub user.

The API integrates with the **GitHub REST API** to measure developer impact, list projects, and analyze language usage.

**Timebox:** 60 minutes

**Focus:** API design, async orchestration, problem-solving, and JavaScript fundamentals

---

## Setup

### GitHub Token

This API requires a GitHub personal access token to make authenticated requests to the GitHub API.

**Generate your token here:** [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic)

#### Local Development

add your token in the .env file :

```bash
 GITHUB_TOKEN=your_token_here
```

#### GitHub Actions / CI/CD

To run tests in GitHub Actions, add your token to GitHub repository secrets:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GITHUB_TOKEN`
5. Value: Your personal access token
6. Click **Add secret**

Your GitHub Actions workflows will now have access to the token via `${{ secrets.GITHUB_TOKEN }}`

**Learn more:** [Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)

### Installation & Running

```bash
# Install dependencies
npm install

# Start the server
npm start

# Run tests
npm test
```

The server will start on `http://localhost:3000` by default.

---

## API Endpoints

| Method   | Endpoint                       | Description                                   |
| -------- | ------------------------------ | --------------------------------------------- |
| `POST` | `/users`                     | Get leaderboard                               |
| `GET`  | `/users/:username/projects`  | List all public repositories for a user       |
| `GET`  | `/users/:username/languages` | Get language distribution across user's repos |

## API Requirements

### `POST /users` — Rank Multiple Developers

Tracks multiple GitHub users and computes an **Impact Score** for each based on recent public activity. Returns a leaderboard sorted by score in descending order.

#### Request Format

Accepts an array of GitHub usernames (1-100 users):

```json
{
  "usernames": ["octocat", "torvalds", "gaearon"]
}
```

#### Data Source

- GitHub API: [`GET /users/{username}/events/public`](https://docs.github.com/en/rest/activity/events#list-public-events-for-a-user)
- Use **last 50 events only** per user

#### Scoring Rules

Each GitHub activity contributes differently to the Impact Score:

<table>
  <thead>
    <tr>
      <th>Event Type</th>
      <th>Activity</th>
      <th align="center">Points</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>PushEvent</code></td>
      <td>Commit pushed</td>
      <td align="center"><strong>+1</strong></td>
      <td>Every commit to any branch</td>
    </tr>
    <tr>
      <td><code>PullRequestEvent</code></td>
      <td>PR opened</td>
      <td align="center"><strong>+5</strong></td>
      <td>Creating a new pull request</td>
    </tr>
    <tr>
      <td><code>PullRequestReviewEvent</code></td>
      <td>PR reviewed</td>
      <td align="center"><strong>+3</strong></td>
      <td>Reviewing someone else's PR</td>
    </tr>
    <tr>
      <td><code>PullRequestEvent</code></td>
      <td>PR merged</td>
      <td align="center"><strong>+10</strong></td>
      <td>When <code>payload.pull_request.merged === true</code></td>
    </tr>
  </tbody>
</table>

> **Note:** Only the **last 50 public events** are analyzed for score calculation.

#### Response Format

```json
{
  "leaderboard": [
    { "username": "torvalds", "score": 150, "success": true },
    { "username": "octocat", "score": 42, "success": true },
    { "username": "gaearon", "score": 38, "success": true }
  ],
  "failed": [{ "username": "nonexistent-user", "error": "User not found" }]
}
```

> **Note:** The `failed` array is only included if one or more users fail to process.

---

### `GET /users/:username/projects` — List Projects

Returns all **public repositories** owned by the user.

#### Required Fields

- `name`
- `stargazers_count`
- `primary_language`

#### Data Source

- GitHub API: [`GET /users/{username}/repos`](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user)

---

### `GET /users/:username/languages` —  Get Languages Distribution

Analyzes the user’s **language distribution** across all repositories.

#### Logic Flow

1. Fetch all public repositories
2. For each repository, fetch language byte data

   `GET /repos/{owner}/{repo}/languages`
3. Aggregate total bytes per language
4. Convert totals into **percentage distribution**

#### Example Output

```json
{
  "JavaScript": "70%",

  "TypeScript": "30%"
}

```

## What We're Looking For

* **Problem-solving skills** - Debug and fix existing authentication issues
* **API design knowledge** - Implement RESTful endpoints following best practices
* **External API integration** - Work with PokeAPI and handle external data
* **JavaScript proficiency** - Write clean, maintainable JavaScript code
* **Error handling** - Proper HTTP status codes and error responses
* **Code quality** - Clean, readable, and maintainable code
* **Testing awareness** - Ensure all provided tests pass
* **System design** - Battle simulation logic and Pokemon data management

## Evaluation Criteria

* Complete and correct functionality
* Proper error handling and status codes
* Clean code structure and JavaScript best practices
* Readable and maintainable code
* Consistent with existing patterns
* Good validation and security practices
* All tests passing
* Clear commit messages and comments
* External API integration working correctly
* Battle simulation logic implemented properly
* Just make sure add comment explaining complicated parts for code
