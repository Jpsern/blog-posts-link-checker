import { URLSearchParams } from 'url';
import fetch from 'node-fetch';
import { Octokit } from '@octokit/action';
import outdent from 'outdent';

(async () => {
    const octokit = new Octokit();
    const [ owner ] = process.env.GITHUB_REPOSITORY.split("/");
    const repo = process.env.TARGET_REPO;
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/issues", {
        owner,
        repo,
        state: 'open',
        labels: ['bug', 'brokenlinks']
    });
    const message = outdent`
        [toall][info][title]リンクチェック結果[/title]
        リンクエラーが見つかりました。下記を確認してください。
        ${data[0]['html_url']}[/info]
    `;
    
    const encodedParams = new URLSearchParams();
    encodedParams.set('self_unread', '1'); // 既読にはしない
    encodedParams.set('body', message);
    const url = `https://api.chatwork.com/v2/rooms/${process.env.CHATWORK_ROOMID}/messages`;
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ChatWorkToken': process.env.CHATWORK_TOKEN
        },
        body: encodedParams
    };
    
    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => {
            console.log(err);
            process.exit(1);
        });
})();
