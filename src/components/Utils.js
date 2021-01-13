export function waitSec(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout*1000);
    });
}