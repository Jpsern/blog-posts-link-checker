const octokit = new Octokit();
const owner = "Jpsern";
const repo = "test-product";

const { data } = await octokit.request("POST /repos/{owner}/{repo}/issues", {
  owner,
  repo,
  title: "My test issue",
});
console.log("Issue created: %s", data.html_url);
