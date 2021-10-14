const { Octokit } = require("@octokit/action");
const octokit = new Octokit();
const [ owner ] = process.env.GITHUB_REPOSITORY.split("/");
const repo = process.env.TARGET_REPO;

(async () => {
  const { data } = await octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner,
    repo, 
    state: 'open',
    labels: ['bug', 'brokenlinks']
  });
  console.log(
    data.map(value => {
      value['number']
    })
  );
})();
