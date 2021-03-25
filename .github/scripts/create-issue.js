const { Octokit } = require("@octokit/action");
const octokit = new Octokit();
const owner = "Jpsern";
const repo = process.env.TARGET_REPO;
//const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

(async () => {
  console.log("execute async...");
  const { data } = await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner,
    repo,
    title: "My test issue",
  });
  console.log("Issue created: %s", data.html_url);
})();
