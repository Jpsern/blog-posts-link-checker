const octokit = new Octokit();
const { data } = await octokit.request("POST /repos/{owner}/{repo}/issues", {
  owner: "Jpsern",
  repo: "test-product",
  title: "My test issue",
});
console.log("Issue created: %s", data.html_url);
