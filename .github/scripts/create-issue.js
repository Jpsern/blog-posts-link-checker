const { Octokit } = require("@octokit/action");
const octokit = new Octokit();
const [ owner ] = process.env.GITHUB_REPOSITORY.split("/");
const repo = process.env.TARGET_REPO;

(async () => {
  console.log("execute async...");
  console.log([owner, repo]);
  // const { data } = await octokit.request("POST /repos/{owner}/{repo}/issues", {
  //   owner,
  //   repo,
  //   title: "My test issue",
  // });
  // console.log("Issue created: %s", data.html_url);
})();
