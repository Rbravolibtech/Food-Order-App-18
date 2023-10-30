import { useCallback, useState, useEffect } from "react";

async function sendHttpRequest(url, config) {
	const response = await fetch(url, config);
	const resData = await response.json();

	if (!response.ok) {
		throw new Error(
			resData.message || "SOMETHING WENT WRONG, FAILED TO SEND REQUEST.",
		);
	}
	return resData;
}

export default function useHttp(url, config, initialData) {
	const [data, setData] = useState(initialData);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	function clearData() {
		setData(initialData);
	}

	const sendRequest = useCallback(
		async function sendRequest(data) {
			setIsLoading(true);

			try {
				const resData = await sendHttpRequest(url, { ...config, body: data });
				setData(resData);
			} catch (error) {
				setError(error.message || "SOMETHING WENT WRONG");
			}
			setIsLoading(false);
		},
		[url, config],
	);

	useEffect(() => {
		if (!config || config.method === "GET" || !config.method || !config) {
			sendRequest();
		}
	}, [sendRequest, config, url]);

	return {
		data,
		isLoading,
		error,
		sendRequest,
		clearData,
	};
}
