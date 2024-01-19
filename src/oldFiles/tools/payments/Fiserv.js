import React, { Component } from "react";
import fetch from "isomorphic-fetch";
import { Button, Form, Input } from "reactstrap";
import LoadingSpinner from "../../LoadingSpinner";
import * as urls from "../../../utils/urlsConfig";
import * as fileSaver from "file-saver";
import { number } from "prop-types";

class Fiserv extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//uploaded:React.createRef(),
			sbURL: urls.springbrook + "Payment/PaymentFile",
			icommsURL: urls.icommsURL + "Sftp/FileByName?serviceName=fiserv",
			loading: false,
			uploaded: [],
			fileName: "",
			sharepointFile: [],
			fileDate: "",
			availableFiles: [],
			selectedFile: number,
			submitAvailable: false
		};
		this.toggleLoading = this.toggleLoading.bind(this);
		this.getFromIcomms = this.getFromIcomms.bind(this);
		this.saveFile = this.saveFile.bind(this);
		this.getAvailableFiles = this.getAvailableFiles.bind(this);
	}

	toggleLoading() {
		this.setState({ loading: !this.state.loading });
	}

	componentDidMount() {
		this.getAvailableFiles();
	}
	getAvailableFiles() {
		this.setState({ loading: true });
		fetch(urls.icommsURL + "Sftp/Directory?serviceName=fiserv", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + this.props.auth.icommsAuthAccessToken
			}
		})
			.then(function (response) {
				if (response.ok) {
					return response;
				} else if (response.status === 401) {
					alert("Your token has expired. Please refresh the page.");
					this.setState({ loading: false });
				} else if (response.status === 502) {
					alert(
						"Fiserv is not currently available. Please check back later."
					);
					var error = new Error(response.statusText);
					throw error;
				} else {
					var error = new Error(response.statusText);
					throw error;
				}
			})
			.then(res => res.json())
			.then(data => {
				//this.state.customers = data;
				console.log(data);
				for (var i = 0; i < data.length; i++) {
					if (!data[i].isDirectory) {
						this.state.availableFiles.push(data[i]);
					}
				}
				this.setState({ loading: false });
			})
			.catch(e => {
				console.log(e);
				this.setState({ loading: false });
			});
	}
	saveFile() {
		console.log("in save file");
		var uploadFile = new FormData();
		var file = new File([this.state.uploaded], this.state.fileName, {
			type: "text/csv"
		});
		uploadFile.append("FormFileHandle", file);
		uploadFile.append("Service", "fiserv");
		fetch(urls.igraph + "Storage/UploadPaymentFile", {
			method: "POST",
			headers: { Authorization: "Bearer " + this.props.igraphToken },
			body: uploadFile
		})
			.then(function (response) {
				if (response.ok) {
					return response;
				} else if (response.status === 401) {
					alert("Your token has expired. Please refresh the page.");
					this.setState({ loading: false });
				} else {
					var error = new Error(response.statusText);
					error.response = response;
					console.log(error);
					//alert("something went wrong uploading the file"+error);
					throw error;
				}
			})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (data === "Upload file not found!") {
					console.log(data);
				} else {
					alert("Sharepoint says: " + data);
				}
			})
			.catch(console.log);

		this.setState({ uploaded: [], loading: false, submitAvailable: false });
	}
	getFromIcomms(e) {
		e.preventDefault();
		this.setState({ loading: true });
		fetch(
			this.state.icommsURL +
				"&fileName=" +
				this.state.availableFiles[this.state.selectedFile]
					.remoteFileName,
			{
				method: "GET",
				headers: { Authorization: "Bearer " + this.props.icommsToken }
			}
		)
			.then(function (response) {
				if (response.ok) {
					return response;
				} else if (response.status === 401) {
					alert("Your token has expired. Please refresh the page.");
					this.setState({ loading: false });
				} else if (response.status === 502) {
					alert(
						"Fiserv is not currently available. Please check back later."
					);
					this.setState({ loading: false });
				} else {
					var error = new Error(response.statusText);
					error.response = response;
					alert(
						"something went wrong trying to get Fiserve From Icomms"
					);
					throw error;
				}
			})
			.then(res => {
				console.log(res);
				for (var pair of res.headers.entries()) {
					console.log(pair[0] + ": " + pair[1]);
					if (pair[0] === "filedate") {
						this.setState({
							fileDate: pair[1].replace(
								/\s[0-9]+:[0-9]+:[0-9]+\s[A-Z]*$/,
								""
							)
						});
					}
				}

				return res.blob();
			})
			.then(data => {
				console.log(data);
				this.setState({
					fileName:
						"Fiserv" +
						this.state.fileDate.replace(/\//g, "") +
						".csv"
				});
				console.log(this.state.fileName);
				this.setState({ uploaded: data });
				if (data.size === 0) {
					//this.setState({loading:false});
					alert("no file to retrieve for fiserv");
					this.setState({ loading: false });
				} else {
					var file = new File([data], this.state.fileName);
					var formUpload = new FormData();
					formUpload.append("FileHandle", file);
					formUpload.append("ServiceName", "fiserv");
					fetch(this.state.sbURL, {
						method: "POST",
						headers: {
							Authorization:
								"Bearer " + this.props.springBrookToken
						},
						body: formUpload
					})
						.then(function (response) {
							if (response.ok) {
								return response;
							} else if (response.status === 401) {
								alert(
									"Your token has expired. Please refresh the page."
								);
								this.setState({ loading: false });
							} else if (response.status === 502) {
								alert(
									"Fiserv is not currently available. Please check back later."
								);
								this.setState({ loading: false });
							} else {
								var error = new Error(response.statusText);
								error.response = response;
								alert(
									"something went wrong from SB Payment/Fiserv"
								);
								throw error;
							}
						})
						.then(res => res.json())
						.then(data => {
							console.log(data);
							if (data.length === 0) {
								//this.setState({loading:false});
								alert("download failed");
							} else {
								//

								//alert("The metavnte file containing data for "+data.length+"customers was successfully uploaded");
								if (
									window.navigator &&
									window.navigator.msSaveOrOpenBlob
								) {
									//res.download(fileName);
								} else {
									try {
										var towrite = [];
										for (var i = 0; i < data.length; i++) {
											var datestr = data[
												i
											].transactionDate.replace(
												/\//g,
												""
											);
											// if(datestr.length<8){
											//     towrite.push(data[i].customerNumber+","+data[i].customerSequence+","+data[i].amount*100+",0"+datestr+"\n");
											// }else{
											towrite.push(
												data[i].CustomerIndex +
													"," +
													data[i].customerSequence +
													"," +
													data[i].amount +
													"," +
													datestr +
													"\n"
											);

											//}
										}
										var a = new Blob(towrite, {
											type: "text/csv;charset=utf-8"
										});
										//a.write(res);
										fileSaver.saveAs(
											a,
											this.state.fileName
										);
										this.state.sharepointFile.push(towrite);
										this.saveFile();
									} catch (error) {
										console.log(error);
										//res.download(fileName);
									}
								}
							}
						});

					this.saveFile();
				}
			})
			.catch(console.log);
	}

	handleFileSelection = e => {
		this.setState(
			{ selectedFile: e.target.value, submitAvailable: true },
			() => console.log("Option selected:" + this.state.selectedFile)
		);
	};

	render() {
		var availableDates = this.state.availableFiles.map((file, index) => {
			var dateStr = new Date(file.modifyDate).toLocaleDateString();
			return (
				<option
					key={file.modifyDate}
					value={index}
					// onClick={(e)=>this.setState({selectedFile:file})}
				>
					{dateStr}
				</option>
			);
		});
		return (
			<div>
				<header>
					<h1>Fiserv</h1>
				</header>
				<div>
					{this.state.loading ? (
						<LoadingSpinner />
					) : (
						<Form>
							<Input
								type='select'
								name='select'
								id='exampleSelect'
								value={this.state.selectedFile.modifyDate}
								required
								onChange={e => this.handleFileSelection(e)}
								style={{
									width: "100%",
									"margin-bottom": "5px"
								}}
							>
								<option value={-1}> ------ </option>
								{availableDates}
							</Input>
							<Button
								type='submit'
								disabled={!this.state.submitAvailable}
								onClick={e => {
									this.getFromIcomms(e);
								}}
							>
								Submit File
							</Button>
						</Form>
					)}
				</div>
			</div>
		);
	}
}
export default Fiserv;
