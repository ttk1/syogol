exports.share = element => {
    const share_button = document.createElement('a');
    share_button.innerHTML = 'Tweet #SYOGOL';
    share_button.href = 'https://twitter.com/intent/tweet?button_hashtag=SYOGOL&ref_src=twsrc%5Etfw';
    share_button.classList.add('twitter-hashtag-button');
    //share_button.dataset.size = 'large';
    share_button.dataset.text = 'ライフゲームのパターンを作りました。';
    share_button.dataset.url = window.location;
    share_button.dataset.lang = 'ja';
    share_button.dataset.showCount = 'false';
    const widgets_script = document.createElement('script');
    widgets_script.async = true;
    widgets_script.src = 'https://platform.twitter.com/widgets.js';
    widgets_script.charset = 'utf-8';
    element.appendChild(share_button);
    element.appendChild(widgets_script);
}