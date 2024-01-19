const { Octokit } = require("@octokit/core");
// default headers
export const assignHeaders = token => {
	return {
		"Content-Type": "application/json",
		Authorization: "Bearer " + token
	};
};

// handles all fetch calls and assigns errors
export const fetchJson = async (url, options, onCancel, defaultError) => {
	try {
		let error = null;
		console.log(url)
		const response = await fetch(url, options);

		if (response.status === 204) {
			return null;
		} else 
		if (response.status === 401) {
			error = "Your token is invalid. Please refresh the page.";
		} else if (response.status === 500 || response.status === 400) {
			console.log(response)
			error = defaultError
				? defaultError
				: response.status === 500? `A 500 error was returned from ${url}! Please try again later if it is impacting your functionality.`:
				"A 400 error has been returned! Please try again later.";
		}
		
		if (error) {
			return Promise.reject(error);
		}

		const payload = response.json();

		return payload;
	} catch (error) {
		if (error.name !== "AbortError") {
			throw error;
		}
		return Promise.resolve(onCancel);
	}
};

// creates discussion on Github for bug report
export const createIssue = async (issue, signal) => {
	const octokit = new Octokit({
		auth: process.env.REACT_APP_GITHUB_TOKEN
	});

	return await octokit.request("POST /repos/{owner}/{repo}/issues", {
		owner: "verawaterandpower",
		repo: "ApiaryReactHomePage",
		title: issue.subject,
		body: `From ${issue.submittedBy.displayName}: ${issue.description}`,
		assignees: ["veratroy", "balcamo", "mikdermit"],
		labels: [issue.type]
	});
};

export const createTicket = async (ticket, signal) => {
	const url = new URL(`${process.env.REACT_APP_DESK365_URL}/tickets/create`);
	const headers = {
		"Content-Type": "application/json",
		Authorization: process.env.REACT_APP_DESK365_TOKEN
	};
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify(ticket),
		signal
	};
	return await fetchJson(url, options, []);
};