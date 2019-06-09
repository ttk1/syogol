window.onload = () => {
    const container = document.getElementById('container');
    const share = document.getElementById('share');
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    require('./share_button.js').share(share);
    return require('./gol.js').start(canvas, getParam('data'));
}

function getParam(key) {
    try {
        return window.location.search
        .replace(/^\?/, '').split('&')
        .map(x => x.split('='))
        .find(x => x[0] == key)[1];
    } catch(e) {
        return undefined;
    }
}