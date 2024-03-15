onmessage = (e) => {
    setInterval(() => {
        postMessage('tick');
    }, 1000);
}
