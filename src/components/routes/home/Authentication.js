import React, { useEffect, useState } from "react";
import ErrorMessage from "../../common/errors/ErrorMessage";

export default function Authentication({ handleSignIn, error }) {
	return (
			<div className="flex-col-center h-100 justify-content-center">
				<h1 className="mb-3">Apiary Development</h1>
                <button className="btn btn-lt-blue" onClick={handleSignIn}>Sign In</button>
			</div>
	);
}
// Adding a comment to test AP-266
