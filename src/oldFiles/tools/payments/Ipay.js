// import React, { Component } from "react";
// import fetch from "isomorphic-fetch";
// import { Button, Form, Input } from "reactstrap";
// import LoadingSpinner from "../../LoadingSpinner";
// import * as urls from "../../../utils/urlsConfig";
// import * as fileSaver from "file-saver";
// import { number } from "prop-types";

// class Ipay extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			//uploaded:React.createRef(),
// 			sbURL: urls.springbrook + "Payment/PaymentFile",
// 			icommsURL: urls.icommsURL + "Sftp/FileByName",
// 			loading: false,
// 			uploaded: [],
// 			fileName: "",
// 			sharepointFile: [],
// 			fileDate: "",
// 			availableFiles: [],
// 			selectedFile: number,
// 			submitAvailable: false
// 		};
// 		this.toggleLoading = this.toggleLoading.bind(this);
// 		this.submitIpayFile = this.submitIpayFile.bind(this);
// 		this.saveFile = this.saveFile.bind(this);
// 		this.getAvailableFiles = this.getAvailableFiles.bind(this);
// 	}

// 	toggleLoading() {
// 		this.setState({ loading: !this.state.loading });
// 	}

// 	componentDidMount() {
// 		this.getAvailableFiles();
// 	}

// 	getAvailableFiles() {
// 		this.setState({ loading: true });
// 		fetch(urls.icommsURL + "Sftp/Directory?serviceName=ipay", {
// 			method: "GET",
// 			headers: {
// 				"Content-Type": "application/json",
// 				Authorization: "Bearer " + this.props.auth.icommsAuthAccessToken
// 			}
// 		})
// 			.then(function (response) {
// 				if (response.ok) {
// 					return response;
// 				} else if (response.status === 401) {
// 					alert("Your token has expired. Please refresh the page.");
// 					this.setState({ loading: false });
// 				} else if (response.status === 502) {
// 					alert(
// 						"iPay is not currently available. Please check back later."
// 					);
// 					var error = new Error(response.statusText);
// 					throw error;
// 				} else {
// 					var error = new Error(response.statusText);
// 					throw error;
// 				}
// 			})
// 			.then(res => res.json())
// 			.then(data => {
// 				//this.state.customers = data;
// 				console.log(data);
// 				//data = data.slice(-32,)
// 				var tempFiles = [];
// 				for (var i = 0; i < data.length; i++) {
// 					if (!data[i].isDirectory) {
// 						tempFiles.push(data[i]);
// 					}
// 				}
// 				console.log(tempFiles);
// 				tempFiles.sort((a, b) => {
// 					return a.modifyDate - b.modifyDate;
// 				});
// 				for (var i = tempFiles.length; i > 0; i--) {
// 					this.state.availableFiles.push(tempFiles[i - 1]);
// 				}
// 				console.log(this.state.availableFiles);

// 				this.setState({ loading: false });
// 			})
// 			.catch(e => {
// 				console.log(e);
// 				this.setState({ loading: false });
// 			});
// 	}

// 	saveFile(e) {
// 		e.preventDefault();
// 		console.log(this.state.uploaded);
// 		var file = new File([this.state.uploaded], this.state.fileName, {
// 			type: "text/csv"
// 		});
// 		var uploadFile = new FormData();
// 		uploadFile.append("FormFileHandle", file);
// 		uploadFile.append("Service", "ipay");
// 		console.log(uploadFile);
// 		fetch(urls.igraph + "Storage/UploadPaymentFile", {
// 			method: "POST",
// 			ProceData: false,
// 			headers: {
// 				Authorization: "Bearer " + this.props.auth.igraphAuthAccessToken
// 			},
// 			body: uploadFile
// 		})
// 			.then(function (response) {
// 				if (response.ok) {
// 					return response;
// 				} else if (response.status === 401) {
// 					alert("Your token has expired. Please refresh the page.");
// 					this.setState({ loading: false });
// 				} else {
// 					var error = new Error(response.statusText);
// 					error.response = response;
// 					alert(
// 						"something went wrong while trying to save the file to sharepoint"
// 					);
// 					throw error;
// 				}
// 			})
// 			.then(res => res.json())
// 			.then(data => {
// 				console.log(data);
// 				alert("Sharepoint says: " + data);
// 			})
// 			.catch(console.log);

// 		this.setState({ uploaded: [], loading: false, submitAvailable: false });
// 	}
// 	submitIpayFile(e) {
// 		e.preventDefault();
// 		this.setState({ loading: true });
// 		//this.saveFile()
// 		fetch(
// 			this.state.icommsURL +
// 				"?serviceName=ipay&fileName=" +
// 				this.state.availableFiles[this.state.selectedFile]
// 					.remoteFileName,
// 			{
// 				method: "GET",
// 				headers: { Authorization: "Bearer " + this.props.icommsToken }
// 			}
// 		)
// 			.then(function (response) {
// 				if (response.ok) {
// 					return response;
// 				} else if (response.status === 401) {
// 					alert("Your token has expired. Please refresh the page.");
// 					this.setState({ loading: false });
// 				} else {
// 					var error = new Error(response.statusText);
// 					error.response = response;
// 					alert(
// 						"something went wrong trying to get Ipay From Icomms"
// 					);
// 					throw error;
// 				}
// 			})
// 			.then(res => {
// 				console.log(res);
// 				for (var pair of res.headers.entries()) {
// 					console.log(pair[0] + ": " + pair[1]);
// 					if (pair[0] === "filedate") {
// 						this.setState({
// 							fileDate: pair[1].replace(
// 								/\s[0-9]+:[0-9]+:[0-9]+\s[A-Z]*$/,
// 								""
// 							)
// 						});
// 					}
// 				}

// 				return res.blob();
// 			})
// 			.then(data => {
// 				console.log(data);
// 				this.setState({
// 					fileName:
// 						"Ipay" + this.state.fileDate.replace(/\//g, "") + ".csv"
// 				});
// 				this.setState({ uploaded: data });
// 				console.log(this.state.fileName);

// 				console.log(data);
// 				if (data.length === 0) {
// 					alert("failed to retrieve selected file for Ipay");
// 				} else {
// 					//this.setState({fileName:data.fileName})
// 					var file = new File(
// 						[this.state.uploaded],
// 						this.state.fileName
// 					);
// 					console.log(file);
// 					var formUpload = new FormData();
// 					formUpload.append("FileHandle", file);
// 					formUpload.append("ServiceName", "ipay");
// 					console.log(formUpload);
// 					fetch(this.state.sbURL, {
// 						method: "POST",
// 						headers: {
// 							Authorization:
// 								"Bearer " + this.props.springBrookToken
// 						},
// 						body: formUpload
// 					})
// 						.then(function (response) {
// 							if (response.ok) {
// 								return response;
// 							} else if (response.status === 401) {
// 								alert(
// 									"Your token has expired. Please refresh the page."
// 								);
// 								this.setState({ loading: false });
// 							} else {
// 								var error = new Error(response.statusText);
// 								error.response = response;
// 								alert(
// 									"something went wrong from SB Payment/Ipay"
// 								);
// 								throw error;
// 							}
// 						})
// 						.then(res => res.json())
// 						.then(data => {
// 							console.log(data);

// 							if (data.length === 0) {
// 								//this.setState({loading:false});
// 								alert("download failed");
// 							} else {
// 								//

// 								//alert("The metavnte file containing data for "+data.length+"customers was successfully uploaded");
// 								if (
// 									window.navigator &&
// 									window.navigator.msSaveOrOpenBlob
// 								) {
// 									//res.download(fileName);
// 								} else {
// 									try {
// 										var towrite = [];
// 										for (var i = 0; i < data.length; i++) {
// 											var datestr = data[
// 												i
// 											].transactionDate.replace(
// 												/\//g,
// 												""
// 											);
// 											// if(datestr.length<8){
// 											//     towrite.push(data[i].customerNumber+","+data[i].customerSequence+","+data[i].amount*100+",0"+datestr+"\n");
// 											// }else{
// 											towrite.push(
// 												data[i].CustomerIndex +
// 													"," +
// 													data[i].customerSequence +
// 													"," +
// 													data[i].amount +
// 													"," +
// 													datestr +
// 													"\n"
// 											);

// 											//}
// 										}
// 										var a = new Blob(towrite, {
// 											type: "text/csv;charset=utf-8"
// 										});
// 										//a.write(res);
// 										//var text = a.text();
// 										var file = new File(
// 											[towrite],
// 											this.state.fileName,
// 											{ type: "text/csv" }
// 										);
// 										this.state.sharepointFile.push(towrite);
// 										fileSaver.saveAs(
// 											a,
// 											this.state.fileName
// 										);
// 									} catch (error) {
// 										console.log(error);
// 										//res.download(fileName);
// 									}
// 								}
// 							}
// 						})
// 						.catch(console.log);

// 					this.saveFile(e);
// 				}
// 			})
// 			.catch(console.log);
// 	}

// 	handleFileSelection = e => {
// 		this.setState(
// 			{ selectedFile: e.target.value, submitAvailable: true },
// 			() => console.log("Option selected:" + this.state.selectedFile)
// 		);
// 	};

// 	render() {
// 		var availableDates = this.state.availableFiles.map((file, index) => {
// 			var dateStr = new Date(file.modifyDate).toLocaleDateString();
// 			return (
// 				<option
// 					key={file.modifyDate}
// 					value={index}
// 					// onClick={(e)=>this.setState({selectedFile:file})}
// 				>
// 					{dateStr}
// 				</option>
// 			);
// 		});

// 		return (
			
// 		);
// 	}
// }
// export default Ipay;
