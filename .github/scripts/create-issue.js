import { Octokit } from "@octokit/action";
import * as fs from 'fs';

(async () => {
  const octokit = new Octokit();
  const [ owner ] = process.env.GITHUB_REPOSITORY.split("/");
  const repo = process.env.TARGET_REPO;
  await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner,
    repo,
    title: `Found broken links. (${process.env.CURRENT_DATE})`,
    body: fs.readFileSync("link-check-result.md", "utf-8"),
    assignee: owner,
    labels: ['bug', 'brokenlinks']
  });
})();
