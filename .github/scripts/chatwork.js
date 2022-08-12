const { URLSearchParams } = require('url');
const fetch = require('node-fetch');
const encodedParams = new URLSearchParams();
const token = process.env.CHATWORK_TOKEN;
const issueUrl = process.env.ISSUE_URL;
const message =
`[toall][info][title]リンクチェック結果[/title]
リンクエラーが見つかりました。下記を確認してください。
${issueUrl}[/info]`;

(() => {
    encodedParams.set('self_unread', '1'); // 既読にはしない
    encodedParams.set('body', message);
    
    const url = 'https://api.chatwork.com/v2/rooms/room_id/messages';
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ChatWorkToken': token
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
