const { Octokit } = require("@octokit/action");
const octokit = new Octokit();
const [ owner ] = process.env.GITHUB_REPOSITORY.split("/");
// const repo = process.env.TARGET_REPO;
const repo = "test-product";

(async () => {
  console.log("execute async...");
  const { data } = await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner,
    repo,
    title: `Found broken link(${process.env.CURRENT_DATE})`,
    body: "https://github.com/Jpsern/blog-posts-link-checker/blob/master/link-check-result.txt",
    labels: ['bug']
  });
  console.log("Issue created: %s", data.html_url);
})();
