import React, { Component} from 'react';
import fetch from 'isomorphic-fetch';
import {  Form, Button, Label, Input } from 'reactstrap';
import LoadingSpinner from '../../LoadingSpinner';
import * as urls from '../../../utils/urlsConfig';
import * as fileSaver from 'file-saver';
import $ from "jquery"

class Metavante extends Component {
    constructor(props) {
        super(props);
        this.state = {
          //uploaded:React.createRef(),
          sbURL:urls.springbrook+'Payment/PaymentFile',
          loading:false,
          uploaded:[],
          fileName:'',
          sharepointFile:[],
          dateStr:'',
          submitAvailable:false
        };
        this.toggleLoading = this.toggleLoading.bind(this);
        this.submitMetavanteFile = this.submitMetavanteFile.bind(this);
        
      }

    toggleLoading(){
        this.setState({loading:!this.state.loading})
    }
    
    componentDidMount(){
    //     var today=new Date();
    //    this.setState({dateStr:today.toDateString().replace(/\s+/g,'').replace(/\,/g,'')});
    }
    submitMetavanteFile(e){
        e.preventDefault();
        this.setState({loading:true});
        var today=new Date()
        var fileName = "metavante"+this.state.dateStr+".csv";

        if(this.state.uploaded.length === 0){
            alert("no file selected. please upload a file to upload");
            this.setState({loading:false})
        }else{
            console.log('Selected file - ')
            console.log(this.state.uploaded[0]);
            console.log("the filename is "+this.state.fileName)
            var uploadFile=new FormData();
            var fileHandle =new FormData();
            
            fileHandle.append("FileHandle", this.state.uploaded[0],this.state.fileName)
            fileHandle.append("serviceName","metavante")
            fetch(this.state.sbURL, {
                method:"POST",
                headers:{'Authorization': 'Bearer '+this.props.springBrookToken},
                body:fileHandle
            }).then(function(response) {
                if (response.ok) {
                    return response
                } else if(response.status === 401){
                    alert("Your token has expired. Please refresh the page.");
                    this.setState({loading:false})
                } else {
                    var error = new Error(response.statusText);
                    error.response = response;
                    //this.setState({loading:false});
                    alert("something went wrong with the metevante upload");
                    throw error;
                }
            })
            .then(res=>res.json())
            .then(data=> {
                console.log(data);
                console.log(fileName);
                if(data.length===0){
                    //this.setState({loading:false});
                    alert("download failed");
                }else{
                    //

                    //alert("The metavnte file containing data for "+data.length+"customers was successfully uploaded");
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        //res.download(fileName);  
                     }
                    else {
                        try{
                            var towrite = []
                            for(var i=0;i<data.length;i++){
                                var datestr=data[i].transactionDate.replace(/\//g,'');
                                //if(datestr.length<8){
                                  //  towrite.push(data[i].CustomerIndex+","+data[i].customerSequence+","+data[i].amount*100+",0"+datestr+"\n");
                                //}else{
                                    towrite.push(data[i].CustomerIndex+","+data[i].customerSequence+","+data[i].amount+","+datestr+"\n");

                                //}
                            }
                            var a = new Blob(towrite,{type:"text/csv;charset=utf-8"});
                            //a.write(res);
                            this.state.sharepointFile.push(towrite)
                            fileSaver.saveAs(a,this.state.fileName);
                        }
                        catch(error){
                            console.log(error);
                            //res.download(fileName);
                        }
                    }
                
                }
            })
            .catch(console.log);
            
            var uploadFile=new FormData()
            var file = new File([this.state.sharepointFile[0]],this.state.fileName,{type: "text/csv",})
            uploadFile.append("FormFileHandle",this.state.uploaded[0],this.state.fileName)
            uploadFile.append("Service","metavante")
            fetch(urls.igraph+'Storage/UploadPaymentFile', {
                method:"POST",
                headers:{'Authorization': 'Bearer '+this.props.auth.igraphAuthAccessToken},
                body:uploadFile
            }).then(function(response) {
                if (response.ok) {
                    return response
                }  else if(response.status === 401){
                    alert("Your token has expired. Please refresh the page.");
                    this.setState({loading:false})
                }else {
                    var error = new Error(response.statusText);
                    error.response = response;
                    //this.setState({loading:false});
                    alert("something went wrong with the metevante upload to sharepoint");
                    throw error;
                }
            })
            .then(res=>res.json())
            .then(data=> {
                console.log(data);
                alert("Sharepoint says "+data)
            })
            .catch(console.log);
        }
        this.setState({uploaded:[]});
        this.setState({loading:false,submitAvailable:false});

    }
    setFiles(file){
        this.setState({uploaded:file});
        
        var date = new Date(file[0].lastModifiedDate);
        var months=["01","02","03","04","05","06","07","08","09","10","11","12"]
        var year=date.getFullYear();
        var month=months[date.getMonth()] //getMonth is zero based;
        var day=date.getDate();
        var str = month+""+day+""+year
        
        this.setState({datestr:str,fileName:"metavante"+str+".csv",submitAvailable:true})
    }
    render(){
        
        return (
            <div>
               
                <header >
                    <h1>Metavante</h1>
                </header>
                <div>{
                    this.state.loading? <LoadingSpinner/> :
                    <Form >
                        <Label for="exampleFile">Upload the Metavante file</Label>
                        <Input
                        type="file"
                        className="fileUpload"
                        onChange={e=>{this.setFiles(e.target.files)}}
                        />  
                        <Button type="submit" disabled={!this.state.submitAvailable}
                        onClick={e=>{if(window.confirm("is this the file you want? "+this.state.uploaded[0].name)){this.submitMetavanteFile(e)}}}>Submit</Button>
                   
                    </Form>}
                </div>
            </div>
        )
    }
}
export default Metavante;