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
  const issueNumbers = data.map(value => value['number']);
  issueNumbers.forEach(issue_number => {
    octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
        owner,
        repo, 
        issue_number,
        body: 'This issue will be closed because the external link error has been resolved.'
    });
    octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
      owner,
      repo, 
      issue_number,
      state: 'closed'
    }); 
  });
})();
