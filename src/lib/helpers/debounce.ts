export function debounce<F extends (...args: any[]) => any>(fn: F, delay = 500) {
	let timeoutId: ReturnType<typeof setTimeout>;

	return (...args: Parameters<F>): Promise<ReturnType<F>> => {
		return new Promise((resolve) => {
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				resolve(fn(...args));
			}, delay);
		});
	};
}
