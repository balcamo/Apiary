import React, { Component, Fragment } from 'react';
import fetch from 'isomorphic-fetch';
import jsreport from 'jsreport-browser-client-dist';
import { Button, Form, FormGroup, Input, Label, Table } from 'reactstrap';
import LoadingSpinner from '../LoadingSpinner';
import * as urls from '../../utils/urlsConfig';

/**
 * uses JSReport to print work orders
 */

class WorkOrderPrint extends Component {
    constructor(props) {
        super(props);
        this.state = {
          baseURL:urls.springbrook+'WorkOrder',
          selectedState: 'In Progress',
          orderFrom:"",
          orderTo:"",
          dropdownOpen:false,
          returnedWorkOrders:[],
          loading: false,
          newWO:[],
          disabled:true,
          dataStr:'',
          statusOptions:[]
        };
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.GetWorkOrders = this.GetWorkOrders.bind(this);
        this.PrintWorkOrders = this.PrintWorkOrders.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);

      }
    toggleLoading(){
        this.setState({loading:!this.state.loading})
    }
    toggleDropDown(){
        this.setState({dropdownOpen: !this.state.dropdownOpen});
    }
   
    componentDidMount(){
        var today=new Date();
        this.setState({dateStr:today.toDateString().replace(/\s+/g,'').replace(/\,/g,'')});
        fetch(urls.springbrook+'/Workorder/Status',{
            method:'GET',
            headers:{
                'Authorization': 'Bearer '+this.props.token
            }
        }).then(function(response) {
            if (response.ok) {
            return response
            } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
            }
        })
        .then(res => res.json())
        .then(data=>{
            console.log("status options are")
            console.log(data)
            this.setState({statusOptions:data})
        }).catch(console.log);
    }
   
    /**
     * 
     * @param {the event of pushing a button to prevent the reload} e 
     * this function will take the state variables selectedState, orderFrom, 
     * and orderTo and make a call to the springbrook interface to retrieve 
     * the workorders in the desired range with the given status
     */
    GetWorkOrders(e) {
        e.preventDefault();
        if(this.state.selectedState === 'Any'){
            this.setState({orderTo:this.state.orderFrom});
            console.log(this.state.orderFrom + "to" +this.state.orderTo)
            this.getWOFromSpringbrook()
        }
        else if(this.state.orderFrom ==="" || this.state.orderTo===""){
            
            alert("Range for work order numbers was invalid.\nPlease try again with different values.");
            
        } else {
            this.getWOFromSpringbrook()
        }
    }
    /**
     * the fetch of WO fro springbrook
     */
    getWOFromSpringbrook(){
        this.toggleLoading();
        var temp=JSON.stringify([this.state.orderFrom.toString(),this.state.orderTo.toString(),this.state.selectedState]);
        console.log('in change function '+this.state.selectedState);
        this.setState({returnedWorkOrders:[],newWO:[]})
        fetch(this.state.baseURL, {
            method:"POST",
            body:temp,
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+this.props.token  
            }
        }).then(function(response) {
            if (response.ok) {
                console.log(response)
                return response
            } else if(response.status === 401){
                alert("Your token has expired. Please refresh the page.");
                this.setState({loading:false})
            }else{
                var error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then(res => res.json())
        .then((data) => {
            console.log("look at this")
            console.log(data);

            if(data.length===0){
                this.setState({returnedWorkOrders:[],orderFrom:'',
                    orderTo:'',selectedState:'In Progress',loading:false})
                alert("There are no work orders in that range for the given status.\nPlease try again with different values.");

            }else{
                this.setState({returnedWorkOrders:[]});
                var tempdata=data;
                
                tempdata.map(val=>this.state.returnedWorkOrders.push(val));
                this.setState({loading:false, returnedWorkOrders:this.state.returnedWorkOrders})

                console.log(this.state.returnedWorkOrders);
            }
            })
            .catch(console.log);
    
   
    }


    /**
     * 
     * @param {the event of pushing the print button so we can prevent the reload of the page} e 
     * This function will pass the list of WO to jsreport for printing. It is very important
     * to change the template name when doing a build for dev or test
     * Dev : "/WorkOrdersDev/workOrders"
     * Test: "/WorkOrders/workOrders"
     */
    PrintWorkOrders(e) {
        e.preventDefault();
        
        jsreport.serverUrl = urls.jsreort;
        // TEMPLATE NAME NEED TO BE STRING LITERAL
        // MAKE SURE IT MATCHES THE BUILD
        let reportRequest = { template: { name: "/WorkOrdersDev/workOrders" },
                              data: {workOrders:this.state.newWO},
                              express:{inputRequestLimit: "500mb"}
                            };
        jsreport.headers['Authorization'] = 'Basic dmVyYTp2ZXJhd2F0ZXJhbmRwb3dlcg==';
        jsreport.renderAsync(reportRequest).then(function(res){
            console.log(res);
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                res.download("workorder.pdf");  
             }
             else {
                try{
                    var a = window.open(res.toObjectURL());
                    a.document.write(res);
                    a.document.close();
                }
                catch(e){
                    res.download("workorder.pdf");
                }
            }
        });
        //this.setState({newWO:[],disabled:true})
        return false;
    }
    /**
     * 
     * @param {the work order that needs to be pushed 
     *              added to a list to be printed} wo 
     * @param {a string for which meters need to be 
     *              associated with the workorder to be printed} SelectedMeters 
     * each test case will push the result to the state var newWO which is what will be
     * printed. The last if will allow the print button to be enabled once each WO has been 
     * assigned meters for printing
     */
    makeWOList(wo,SelectedMeters){
        var data;
        let tempWO = Object.assign({},wo);
        if(this.state.newWO.length>0){
           
                var actualArray=[]
               for(var i=0;i<this.state.newWO.length;i++){
                   if(this.state.newWO[i].WorkOrderIndex!=wo.WorkOrderIndex){
                       actualArray.push(this.state.newWO[i])
                   }
               }
               this.state.newWO=actualArray
               this.setState({disabled:true});
    
            
        }


        if(SelectedMeters === "all"){
            this.state.newWO.push(tempWO);
        }else if(SelectedMeters === "none"){
            tempWO.meters=[]

            this.state.newWO.push(tempWO);
        }
        else if(SelectedMeters ==="-1"){
            var actualArray=[]
           for(var i=0;i<this.state.newWO.length;i++){
               if(this.state.newWO[i].WorkOrderIndex!=wo.WorkOrderIndex){
                   actualArray.push(this.state.newWO[i])
               }
           }
           this.state.newWO=actualArray
           this.setState({disabled:true});

        }
        else{
            var actualArray=[]
            for(var i=0;i<this.state.newWO.length;i++){
                if(this.state.newWO[i].WorkOrderIndex!=wo.WorkOrderIndex){
                    actualArray.push(this.state.newWO[i])
                }
            }
            this.state.newWO=actualArray;
            data = wo.meters.filter(meter => meter.MeterIndex === SelectedMeters);
            console.log(data);
            tempWO.meters=[]
            tempWO.meters.push(data[0]);
            this.state.newWO.push(tempWO);

        }
        
        
        if(this.state.newWO.length === this.state.returnedWorkOrders.length){
            this.setState({disabled:false});
        }
        console.log(this.state.newWO);
    }

    handelNumChange(numToCheck,startNum){
        var num=parseInt(numToCheck)
        if(startNum){
            if(this.state.selectedState ==="Any"){
                this.setState({orderTo:num})
            }
            this.setState({orderFrom:num})
        } else {
            this.setState({orderTo:num})
        }

    }
    handelSelectedStatus(e){
        this.setState({selectedState:e.target.value})
        if(e.target.value === "Any"){
            this.setState({orderTo:this.state.orderFrom})
        }
    }
    render(){
     
    // this var populates the table on the page dynamicly   
    const workForms=(
            this.state.returnedWorkOrders.map((item)=>
                <tr key={item.WorkOrderIndex}>
                    <td>{item.WorkOrderIndex}</td>
                    <td>{item.Creator}</td>
                    <td>
                    <FormGroup>
                        <Input type="select" name="select" onChange={(e)=> this.makeWOList(item, e.target.value)}>
                            <option value="-1" >----</option>
                            <option value="none">None</option>
                            <option value="all">All</option>
                            {item.meters.map((meter)=>
                                <option value={meter.MeterIndex} key={meter.MeterIndex} >{meter.MeterIndex}</option>)}
                        
                        </Input>
                    </FormGroup>
                    </td>
                    <td>{item.Description}</td>
                </tr>
            )
    )
        
        return (
            <div>
                {this.props.search.meters!==undefined && this.props.search.accounts!==undefined && this.props.search.lots!==undefined ?
                <Fragment>
                <header >
                    <h1>Work Orders</h1>
                </header>
                <Form autoComplete="off">
                    <FormGroup>
                        <Input name="select" type="select" className="form-select" value={this.state.selectedState} onChange={(e)=> this.handelSelectedStatus(e)} >
                            <option value='Any'>Any</option>
                            {this.state.statusOptions.map((opt)=>
                                <option value={opt} key={opt} >{opt}</option>)}
                        
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="FromOrder">Start</Label>
                        <Input id="FromOrder" type="number" value={this.state.orderFrom} onChange={(e)=> this.handelNumChange(e.target.value,true)}/>
                    </FormGroup>
                    {this.state.selectedState !== 'Any' ?
                    <FormGroup>
                        <Label for="ToOrder" >End</Label>
                        <Input id="ToOrder" type="number" value={this.state.orderTo} onChange={(e)=> this.handelNumChange(e.target.value,false)}/>
                    </FormGroup>:<div></div>}
                    <Button type="submit" onClick={e=>{if(this.state.selectedState === 'Any'){
                            this.setState({orderTo:this.state.orderFrom});
                            console.log(this.state.orderFrom + "to" +this.state.orderTo)
                            }this.GetWorkOrders(e)}}>Get Work Orders</Button>
                    <Button type="submit" disabled={this.state.disabled} onClick={e=>this.PrintWorkOrders(e)}>Print</Button>

                </Form>
                <div>
                    <h4>Work Orders</h4>  
                        {this.state.loading ? <LoadingSpinner /> : 
                            <Table bordered dark hover>
                                <thead>
                                    <tr>
                                        <td>W.O. Number</td>
                                        <td>Creator</td>
                                        <td>Meter</td>
                                        <td>Description</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workForms}
                                </tbody>
                            </Table>
                        }  
                </div>
                </Fragment>
                :<LoadingSpinner />}
            </div>
        )
    }
}
export default WorkOrderPrint;