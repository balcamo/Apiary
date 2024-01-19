import React, { useEffect, useState } from "react";
import { signIn, silentSignIn } from "../utils/auth/authProvider";
import Authentication from "./routes/home/Authentication";
import PageLayout from "./layout/PageLayout";

export default function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [tokens, setTokens] = useState();
	const [error, setError] = useState();

	const handleSignIn = async () => {
		setError()
		signIn()
			.then(response => {
				setTokens(response.tokens); // returns all tokens in an object
				setIsAuthenticated(response.isAuthenticated); // returns true or false
			})
			.catch(setError);
	};
	console.log("test")
	return (
		<div id='App'>
			{
				// if user is not authenticated or if tokens are still being retrieved, display Authentication page
				!isAuthenticated || !tokens.length <= 0 ? (
					<Authentication handleSignIn={handleSignIn} />
				) : (
					<PageLayout
						tokens={tokens}
						setIsAuthenticated={setIsAuthenticated}
					/>
				)
			}
		</div>
	);
}
// Adding a comment to test AP-266
