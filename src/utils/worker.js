self.addEventListener('message', (event) => {
    setInterval(() => {
        self.postMessage('tick');
    }, 1000);

    // Clean up the worker when the component unmounts
    return () => {
        worker.terminate();
    }
});
