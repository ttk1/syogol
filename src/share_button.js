exports.share = () => {
    const share_button = document.createElement('span');
    const a = document.createElement('a');
    a.innerHTML = 'Tweet #SYOGOL';
    a.href = 'https://twitter.com/intent/tweet?button_hashtag=SYOGOL&ref_src=twsrc%5Etfw';
    a.classList.add('twitter-hashtag-button');
    a.dataset.text = 'ライフゲームのパターンを作りました。';
    a.dataset.url = window.location;
    a.dataset.hashtags = 'たまーず工房';
    a.dataset.lang = 'ja';
    a.dataset.showCount = 'false';
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://platform.twitter.com/widgets.js';
    script.charset = 'utf-8';
    share_button.appendChild(a);
    share_button.appendChild(script);
    share_button.style.position = 'absolute';
    return share_button;
}