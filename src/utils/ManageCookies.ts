function getCookie(name: string) {
    const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return cookieValue ? JSON.parse(cookieValue.pop() || "") : [];
}

// @ts-ignore
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${JSON.stringify(value)}; expires=${expires}; path=/`;
}