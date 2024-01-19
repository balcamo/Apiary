// import React, { Component, Fragment} from 'react';
// import fetch from 'isomorphic-fetch';
// import {  Form, Button, Label, Input, Container, Col, Row } from 'reactstrap';
// import LoadingSpinner from '../../LoadingSpinner';
// import * as urls from '../../../utils/urlsConfig';
// import * as fileSaver from 'file-saver';
// import $ from "jquery"
// import "jquery-ui/ui/widgets/sortable"


// class ElectricReads extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//           //uploaded:React.createRef(),
//           sbURL:urls.springbrook+'Meter/',
//           loading:false,
//           uploaded:[],
//           fileName:'',
//           IComComandCenterURL:urls.icommsURL+'Sftp/MeterReading?servicename=commandcenter',
//           keyVaultURL:urls.keystoreURL,
//           billingCyles:[],
//           selectedCycle:'0',
//           CCMeters:[],
//           CCMetersFirst:[],
//           meterIndexListFirst:[],
//           CCMetersSecond:[],
//           meterIndexListSecond:[],
//           loadingDaily:false,
//           loadingMaster:false,
//           masterMeters:[],
//           dateStr:''
//         };
//         this.toggleLoading = this.toggleLoading.bind(this);
//         this.submitElectricFile = this.submitElectricFile.bind(this);
//         this.getCycles = this.getCycles.bind(this);
//         this.handleCyleSelection = this.handleCyleSelection.bind(this);
//         this.getCCmeters=this.getCCmeters.bind(this);
//         this.writeCCmeters=this.writeCCmeters.bind(this);
//         this.getMasterMeters=this.getMasterMeters.bind(this);
//         this.writeMasterMeters=this.writeMasterMeters.bind(this);
//       }

//     toggleLoading(){
//         this.setState({loading:!this.state.loading})
//     }
    
//     componentDidMount(){
//         var today=new Date();
//         var month=today.getMonth()+1;
//         if(month<10){
//             month="0"+month
//         }
//         var day=today.getDate();
//         if(day<10){
//             day="0"+day
//         }
//         var year=today.getFullYear().toString();
//         var datestr=month+day+year;
//         this.state.dateStr=datestr;
//         this.getCycles();
//         this.props.jqueryCardFunction()
//     }
  
//     getCycles(){
//         fetch(urls.springbrook+"UBAccount/BillingCycles", {
//             method:"GET",
//             headers:{
//                 'Authorization': 'Bearer '+this.props.springBrookToken
//             }
//         }).then(function(response) {
//             if (response.ok) {
//                 return response
//             }  else if(response.status === 401){
//                 alert("Your token has expired. Please refresh the page.");
//                 this.setState({loading:false})
//             }else {
//                 var error = new Error(response.statusText);
//                 error.response = response;
               
//                //alert("something went wrong while retrieving billing cycles");
//                 throw error;
//             }
//         })
//         .then(res=>res.json())
//         .then(data=> {
//             console.log(data);
//             this.setState({billingCyles:data})
//             if(data.length===0){
                
//                 alert("No billing cycles found");
//             }
//         }).catch(console.log)
//     }

//     submitElectricFile(e){
//         e.preventDefault();
//         this.setState({loading:true})
//         fetch(urls.icommsURL+'Sftp/MeterReading?servicename=commandcenter, {
//             method:"GET",
//             headers:{
//                 "Content-Type": "application/json",
//                 'Authorization': 'Bearer '+this.props.icommsToken
//             }
//         }).then(function(response) {
//             if (response.ok) {
//                 console.log(response);
//                 return response;
//             } else {
//                 var error = new Error(response.statusText);
//                 error.response = response;
//                 this.setState({loading:false})
//                 alert("something went wrong from ICOMMS Command Center");
//                 throw error;
//             }
//         })
//         .then(res=>res.json())
//         .then(data=> {
//             console.log(data);
//             this.setState({uploaded:data})
//             if(data.length===0){
//                 //this.setState({loading:false});
//                 alert("download failed from ICCOMS");
//             }
       

//             var bodyJSON = JSON.stringify(data);
       
//             fetch(this.state.sbURL+"CommandCenter?billingCycle="+this.state.selectedCycle, {
//                 method:"POST",
//                 headers:{
//                     'Content-Type': 'application/json',
//                     'Authorization': 'Bearer '+this.props.springBrookToken
//                 },
//                 body:bodyJSON
//             }).then(function(response) {
//                 if (response.ok) {
//                     return response
//                 } else {
//                     var error = new Error(response.statusText);
//                     error.response = response;
//                     alert("Something went wrong from the post for SB Meter/CommandCenter " + response.ok);
//                     throw error;
//                 }
//             })
//             .then(res=>res.json())
//             .then(data=> {
//                 console.log(data);
//                 if(data.length===0){
//                     //this.setState({loading:false});
//                     alert("No data returned for billing cycle "+ this.state.selectedCycle);
//                 }else{
//                     //

//                     //alert("The metavnte file containing data for "+data.length+"customers was successfully uploaded");
//                     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
//                         //res.download(fileName);  
//                      }
//                     else {
//                         try{
//                             var towrite = []
//                             towrite.push("MeterNo,PrevKWh,kWh,Read Date,ReadingTime,Custom1\n")
//                             for(var i=0;i<data.length;i++){
//                                 towrite.push(data[i].MeterIndex+",,"+data[i].reading+","+data[i].readingDate+","+data[i].readingTime+","+data[i].ReadingIndex+"\n");
//                             }
//                             var a = new Blob(towrite,{type:"text/csv;charset=utf-8"});
//                             //a.write(res);
//                             fileSaver.saveAs(a,"comandCenterReads"+this.state.dateStr+".csv");
//                         }
//                         catch(error){
//                             console.log(error);
//                             //res.download(fileName);
//                         }
//                     }
                
//                 }
//                 this.setState({uploaded:[],loading:false});
//             })
//             .catch(error=>{
//                 console.log(error);
//                 alert("There was a problem please check back later");
//                 this.setState({loading:false});
//             });
            
//         })
        

//     }

//     handleCyleSelection = (e) => {
// 		this.setState({ selectedCycle: e.target.value}, () =>
// 			console.log(`Option selected:`, this.state.selectedCycle)
// 		)
// 	}
//     getCCmeters(e){
//         e.preventDefault();
//        this.setState({loadingDaily:true,CCMetersFirst:[],CCMetersSecond:[],CCMeters:[]})
//         fetch(this.state.sbURL+"CommandCenter", {
//             method:"GET",
//             headers:{
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer '+this.props.springBrookToken
//             },
//         }).then(function(response) {
//             if (response.ok) {
//                 return response
//             } else {
//                 var error = new Error(response.statusText);
//                 error.response = response;
//                 alert("Something went wrong from the get for SB Meter/CommandCenter " + response.ok);
//                 throw error;
//             }
//         })
//         .then(res=>res.json())
//         .then(data=> {
//             console.log(data);
//             // var secLength = (data.length)/2
//             for(var i=0;i<data.length;i++){
//                 this.state.CCMetersFirst.push(data[i])
//                 //this.state.meterIndexListFirst.push(data[i].MeterIndex)
//             }
           
//             }).then(()=>{
//                     console.log()
//                     this.writeCCmeters();
//                 }).catch(console.log);
            
//     }
//     writeCCmeters(){
        
//         this.setState({loadingDaily:true});
//         console.log(this.state.CCMetersFirst)
//         var today = new Date()
//                 if(this.state.CCMetersFirst.length===0){
//                     //this.setState({loading:false});
//                     alert("No data returned meters ");
//                 }else{
//                     //
    
//                     //alert("The metavnte file containing data for "+data.length+"customers was successfully uploaded");
//                     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
//                         //res.download(fileName);  
//                      }
//                     else {
//                         try{
//                             var towrite = []
//                             towrite.push("METER NUMBER,SERIAL NUMBER,SERVICE LOCATION,ACCOUNT NUMBER,CUSTOMER ID,EA LOCATION,BILLING CYCLE,SEAL NUMBER 1,SEAL NUMBER 2,"+
//                             "POLE NUMBER,MULTIPLIER,DEMAND MULTIPLIER,REVENUE CLASS,LINE SECTION, GRID LOCATION, FEEDER,CUSTOM1,CUSTOM2,METER POSITION,SERVICE ADDRESS,"+
//                             "SERVICE CITY,SERVICE STATE,SERVICE ZIP, SERVICE LATITUDE,SERVICE LONGITUDE,CUSTOMER LAST NAME\n")
//                             for(var i=0;i<this.state.CCMetersFirst.length;i++){
//                                 var customerName=this.state.CCMetersFirst[i].CustomerName
//                                 if(customerName!==null){customerName=customerName.replace(/\,/g,' ');}
//                                 towrite.push(this.state.CCMetersFirst[i].MeterIndex+","+this.state.CCMetersFirst[i].MeterIndex+","+this.state.CCMetersFirst[i].Location+","+this.state.CCMetersFirst[i].AccountIndex+","+this.state.CCMetersFirst[i].CustomerIndex+",,"+this.state.CCMetersFirst[i].BillingCycle+",,,,,,,,,,"+this.state.CCMetersFirst[i].ReadingIndex+",,,"
//                                 +this.state.CCMetersFirst[i].Address+","+this.state.CCMetersFirst[i].City+","+this.state.CCMetersFirst[i].State+","+this.state.CCMetersFirst[i].Zip+
//                                 ",47.64817,-117.234,"+customerName+"\n");
//                              }//for(var i=0;i<this.state.CCMetersSecond.length;i++){
//                             //     towrite.push(this.state.CCMetersSecond[i].MeterIndex+",,"+this.state.CCMetersSecond[i].Location+
//                             //     ","+this.state.CCMetersSecond[i].AccountIndex+","+this.state.CCMetersSecond[i].CustomerIndex+",,"+this.state.CCMetersSecond[i].BillingCycle+",,,,,,,,,,"+this.state.CCMetersSecond[i].ReadingIndex+",,,"
//                             //     +this.state.CCMetersSecond[i].Address+","+this.state.CCMetersSecond[i].City+","+this.state.CCMetersSecond[i].State+","+this.state.CCMetersSecond[i].Zip+
//                             //     ",,,"+this.state.CCMetersSecond[i].CustomerName+"\n");
//                             // }
//                             var a = new Blob(towrite,{type:"text/csv;charset=utf-8"});
//                             //a.write(res);
//                             fileSaver.saveAs(a,"CCDaily"+this.state.dateStr+".csv");
//                         }
//                         catch(error){
//                             console.log(error);
//                             //res.download(fileName);
//                         }
//                     }
                
//                 }
//                 this.setState({loadingDaily:false});
            
            
        
//     }
//     getMasterMeters(e){
//         e.preventDefault();
//        this.setState({loadingMaster:true,masterMeters:[]})
//         fetch(this.state.sbURL+"MasterMeter", {
//             method:"GET",
//             headers:{
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer '+this.props.springBrookToken
//             },
//         }).then(function(response) {
//             if (response.ok) {
//                 return response
//             }  else if(response.status === 401){
//                 alert("Your token has expired. Please refresh the page.");
//                 this.setState({loading:false})
//             }else {
//                 var error = new Error(response.statusText);
//                 error.response = response;
//                 alert("Something went wrong from the get for SB Meter/CommandCenter " + response.ok);
//                 throw error;
//             }
//         })
//         .then(res=>res.json())
//         .then(data=> {
//             console.log(data);
//             // var secLength = (data.length)/2
//             for(var i=0;i<data.length;i++){
//                 this.state.masterMeters.push(data[i])
//                 //this.state.meterIndexListFirst.push(data[i].MeterIndex)
//             }

//             }).then(()=>{
//                     console.log()
//                     this.writeMasterMeters();
//                 }).catch(console.log);
            
//     }
//     writeMasterMeters(){
        
//         this.setState({loadingMaster:true});
//         console.log(this.state.masterMeters)
//         var today = new Date()
//                 if(this.state.masterMeters.length===0){
//                     //this.setState({loading:false});
//                     alert("No data returned meters ");
//                 }else{
//                     //
    
//                     //alert("The metavnte file containing data for "+data.length+"customers was successfully uploaded");
//                     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
//                         //res.download(fileName);  
//                      }
//                     else {
//                         try{
//                             var towrite = []
//                             for(var i=0;i<this.state.masterMeters.length;i++){
//                                 var regId;
//                                 if(this.state.masterMeters[i].RegisterId == null) {
//                                    regId=""   
//                                 }else{
//                                     regId=this.state.masterMeters[i].RegisterId
//                                 }
//                                 var accountNum=this.state.masterMeters[i].AccountIndex.replace(/(-)/gm,"");
//                                 towrite.push(this.state.masterMeters[i].MeterIndex+","+this.state.masterMeters[i].Address+",,,,"+accountNum+","
//                                 +this.state.masterMeters[i].CustomerName+","+this.state.masterMeters[i].Location+",,,"+regId+","+this.state.masterMeters[i].ReadingIndex+"\n");
//                              }
//                             var a = new Blob(towrite,{type:"text/csv;charset=utf-8"});
//                             //a.write(res);
//                             fileSaver.saveAs(a,"MasterMeter"+this.state.dateStr+".csv");
//                         }
//                         catch(error){
//                             console.log(error);
//                             //res.download(fileName);
//                         }
//                     }
                
//                 }
//                 this.setState({loadingMaster:false});
            
            
        
//     }
//     render(){
//         var cycleOptions=this.state.billingCyles.map((cycle) => (
//             <option className="searchList"
//                 key={cycle.ubCycleId}
//                 value={cycle.BillingCycleIndex}
//                 onClick={(e) => {this.setState({selectedCycle:cycle});console.log(cycle)}}
//             >
//                 {cycle.description}{" (Days in period "}{cycle.daysInPeriod}{")"}
//             </option>
//         ))
//         return (
//             <Fragment>
//                 <div className='col-md-12'>
//                     <div className={'card card-tools '+this.props.profile.views.tools.electricExpand}>
//                         <div className='card-header btn btn-tool btn-minmax btn-max'  
//                                     data-card-widget='collapse'
//                                     data-toggle='tooltip'
//                                     data-placement='top'
//                                     title='Collapse Item'>
//                             <h3 className='card-title'>
//                                 <i className='fas fa-text-width'></i>
//                                 Electric Meter Reads
//                             </h3>
//                             <div className='card-tools'>
//                                 {/* RESIZE BUTTONS NEED TO BE IN card-tools AREA OR LEVEL NEEDS TO BE ADJUSTED IN THE JAVASCRIPT  */}
//                                 {/* <button
//                                     type='button'
//                                     className='btn btn-tool btn-compress'
//                                     data-toggle='tooltip'
//                                     data-placement='top'
//                                     title='Reduce Size'
//                                 >
//                                     <i className='fas fa-search-minus'></i>
//                                 </button>
//                                 <button
//                                     type='button'
//                                     className='btn btn-tool btn-expand'
//                                     data-toggle='tooltip'
//                                     data-placement='top'
//                                     title='Increase Size'
//                                 >
//                                     <i className='fas fa-search-plus'></i>
//                                 </button> */}
//                                 <button
//                                     type='button'
//                                     className='btn btn-tool btn-minmax btn-max'
//                                     data-card-widget='collapse'
//                                     data-toggle='tooltip'
//                                     data-placement='top'
//                                     title='Collapse Item'
//                                 >
//                                     {this.props.profile.views.tools.electricExpand===''?
//                                         <i className='fas fa-minus'></i>:
//                                         <i className='fas fa-plus'></i>
                                        
//                                     }
//                                 </button>
//                                 <button
//                                     type='button'
//                                     className='btn btn-tool'
//                                     data-card-widget='remove'
//                                     data-toggle='tooltip'
//                                     data-placement='top'
//                                     title='Remove Item'
//                                     onClick={e=>this.props.toggleElectric()}
//                                 >
//                                     <i className='fas fa-times'></i>
//                                 </button>
//                             </div>
//                         </div>
//                         {/* /.card-header */}

//                         <div className='card-body'>
//                             <Container>
//                                 <Row>
//                                     <Col>
//                                         {this.props.appToken ? (
//                                             <div>
//                                                 <header >
//                                                     <h3>Electric Reads</h3>
//                                                 </header>
//                                                 <div>{
//                                                     this.state.loading? <LoadingSpinner/> :
//                                                     <Form >
//                                                         <Label for="exampleSelect">Billing Cycle</Label>
//                                                         <Input  type="select" 
//                                                                 name="select" 
//                                                                 id="exampleSelect" 
//                                                                 value={this.state.selectedCycle} 
//                                                                 required 
//                                                                 onChange={e=>this.handleCyleSelection(e)}
//                                                                 style={{"width":"43%","margin-bottom":"5px"}}>
//                                                             <option value='0'> ------ </option>
//                                                             {cycleOptions}
//                                                         </Input> 
//                                                         <Button type="submit" 
//                                                         onClick={e=>{if(this.state.selectedCycle>0) {this.submitElectricFile(e); this.setState({loading:true})}else{ e.preventDefault();alert("billing cycle not selected")}}}>Submit</Button>
                                                
//                                                     </Form>}
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <LoadingSpinner />
//                                         )}
//                                     </Col>
                               
//                                     <Col>
//                                         {this.props.appToken ? (
//                                             <div>
//                                                 <header >
//                                                     <h3>ComandCenter Daily Upload</h3>
//                                                 </header>
//                                                 <div>{
//                                                     this.state.loadingDaily? <LoadingSpinner/> :
//                                                     <Form >
                                                        
                                                       
//                                                         <Button onClick={e=>{this.getCCmeters(e); this.setState({loadingDaily:true})}}>Submit</Button>
                                                
//                                                     </Form>}
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <LoadingSpinner />
//                                         )}
//                                     </Col>
//                                     <Col>
//                                         {this.props.appToken ?
//                                             <div>
//                                                 <header><h3>Master Meter Upload</h3></header>
//                                                 <div>
//                                                     {this.state.loadingMaster ? <LoadingSpinner /> :
//                                                         <Form >
//                                                             <Button onClick={e=>{this.getMasterMeters(e); this.setState({loadingMaster:true})}}>Submit</Button>
//                                                         </Form>
                                                    
//                                                     }
//                                                 </div>
//                                             </div>
//                                             : <LoadingSpinner/>}
//                                     </Col>
                                    
//                                 </Row>
//                             </Container>
//                         </div>

//                         {/* /.card-body */}
//                     </div>
//                     {/* /.card */}
//                 </div>
//             </Fragment>




          
//         )
//     }
// }
// export default ElectricReads;