import React, { Component} from 'react';
import fetch from 'isomorphic-fetch';
import {  ButtonGroup, Button } from 'reactstrap';
import LoadingSpinner from '../LoadingSpinner';
import * as urls from '../../utils/urlsConfig';
//import {getToken} from '../urlsConfig';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';

class MapWorkOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
          baseURL:urls.springbrook+'WorkOrder/ByStatus?status=in progress',
          esriURL:urls.esriPage+'workOrders/',
          selectedState: 'In Progress',
          setState:false,
          workOrderNums:[],
          dropdownOpen:false,
          setDropdownOpen:false,
          isHidden:true,
          springbrookworkOrders:[],
          returnedworkOrders:[],
          loading: true,
          esriEndpoint:'',
          list:true,
          disdata:"",
          googleAPIKey:''
        };
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
        this.getDate = this.getDate.bind(this);
        this.getGoogleAPIKey = this.getGoogleAPIKey.bind(this)
        this.getCityWorks = this.getCityWorks.bind(this)
      }

    toggleLoading(){
        this.setState({loading:!this.state.loading})
    }
    toggleDropDown(){
        this.setState({dropdownOpen: !this.state.dropdownOpen});
    }
    
    componentDidMount(){
      this.getGoogleAPIKey()
      this.getFromEsri();
      this.getCityWorks();
      fetch(this.state.baseURL, {
        method:"GET",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.props.springBrookToken
        }
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
        throw error;
        }
    })
    .then(res => res.json())
    .then((data) => {
        //console.log(data);
        if(data.length===0){
            alert("There are no current work orders in progress returned from springbrook");
            this.setState({loading:false})
        }else{
            this.setState({springbrookworkOrders:[]});
            var tempdata=data;
            
            tempdata.map(val=>this.state.springbrookworkOrders.push(val));
            this.setState({ springbrookworkOrders:this.state.springbrookworkOrders});
        }
    })
    .catch(console.log);
      
	}
    getCityWorks(){
        fetch(urls.cityWorks+'WorkOrder/All', {
            method:"GET",
            headers:{
                'Content-Type': 'application/json',
                //'Authorization': 'Bearer '+this.props.appToken
            }
        }).then(function(response) {
            if (response.ok) {
            return response
            }  else if(response.status === 401){
                alert("Your token has expired. Please refresh the page.");
                this.setState({loading:false})
            }else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
            }
        })
        .then(res => res.json())
        .then((data) => {
            console.log("we got the city works work orders")
            console.log(data)
        })
        .catch(console.log);
    }
    getGoogleAPIKey(){
        fetch(urls.keystoreURL+'/google', {
            method:"GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+this.props.appToken
            }
        }).then(function(response) {
            if (response.ok) {
            return response
            }  else if(response.status === 401){
                alert("Your token has expired. Please refresh the page.");
                this.setState({loading:false})
            }else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
            }
        })
        .then(res => res.text())
        .then((data) => {
            console.log("we got the google key")
            this.setState({googleAPIKey:data});
        })
        .catch(console.log);
        
    }
    InitMap(e,refresh) {
        e.preventDefault();
        if(!refresh){
            fetch(this.state.esriURL+'delete',{
                method:"GET", 
                headers:{
                'Authorization': 'Bearer '+this.props.appToken
            },})
            .then(function(response) {
                if (response.ok) {
                return response
                }  else if(response.status === 401){
                    alert("Your token has expired. Please refresh the page.");
                    this.setState({loading:false})
                }else {
                var error = new Error(response.statusText);
                error.response = response;
                this.setState({loading:false});
                throw error;
                }
            }).then(()=>{
                console.log('in change function '+this.state.selectedState);
                this.toggleLoading();
                
                this.getSB(refresh);
            }).catch(console.log)
            
        } else {
            console.log('in change function '+this.state.selectedState);
            this.toggleLoading();
            this.getSB(refresh);
        }
    }

    getSB(refresh){
        fetch(this.state.baseURL, {
            method:"GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+this.props.springBrookToken
            }
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
            throw error;
            }
        })
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            if(data.length===0){
                alert("There are no current work orders in progress returned from springbrook");
                this.setState({loading:false})
            }else{
                this.setState({springbrookworkOrders:[]});
                var tempdata=data;
                
                tempdata.map(val=>this.state.springbrookworkOrders.push(val));
                this.setState({ springbrookworkOrders:this.state.springbrookworkOrders});
            }
            this.sendToEsri(refresh); 
        })
        .catch(console.log);
           
        return false
    }
    
    sendToEsri(refresh){
        var meters={"workOrders":[],"googleKey":this.state.googleAPIKey};
        console.log(meters);
        if(refresh){
            var url = this.state.esriURL+'refresh';
        }else{
            var url = this.state.esriURL+'init';
        }
		for(var i=0;i<this.state.springbrookworkOrders.length;i++){
			var wOrders=this.state.springbrookworkOrders[i];
            meters.workOrders=wOrders;
            console.log(wOrders);
			fetch(url, {
				method:"POST",
				body:JSON.stringify(meters),
				headers: {
					'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.props.appToken
				  },
			}).then(function(response) {
				if (response.ok) {
				return response
				}  else if(response.status === 401){
                    alert("Your token has expired. Please refresh the page.");
                    this.setState({loading:false})
                }else if(response.statusText === 500){
                   
                    return;
                }else {
				var error = new Error(response.statusText);
				error.response = response;
				//this.setState({loading:false});
				throw error;
				}
			})
			.then(res => res.text())
			.then((data) => {
				console.log(data);			   
			})
			
			.catch(console.log);
		}
		this.getFromEsri();
    }
    
    getFromEsri(){
        fetch(this.state.esriURL, {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+this.props.appToken
              },
        }).then(function(response) {
            if (response.ok) {
                return response
            }  else if(response.status === 401){
                alert("Your token has expired. Please refresh the page.");
                this.setState({loading:false})
            }else {
                var error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then(res => res.json())
        .then((data) => {
            if(data.length===0){
                this.setState({loading:false});
            }else{
                this.setState({returnedworkOrders:data});
                this.toggleLoading();
                console.log(this.state.returnedworkOrders);
            }
            })
           .catch(console.log);
    }
    getDate(cell, row){
        var creation = new Date(cell);

        return creation.toLocaleDateString();
    }
    sendToCityworks(e){
        e.preventDefault();
       
        var bodyJSON=JSON.stringify(this.state.springbrookworkOrders[0])
        fetch(urls.cityWorks+"WorkOrder/Create",{
            method:"POST",
            headers:{ 'Content-Type': 'application/json'},
            body:bodyJSON
        }).then(function(response) {
            if (response.ok) {
                return response
            }  else if(response.status === 401){
                alert("Your token has expired. Please refresh the page.");
                this.setState({loading:false})
            }else {
                var error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then(res => res.json())
        .then((data) => {
           
                
                console.log(data);
            
            })
           .catch(console.log);
        
    }
    render(){
        const columns=[
            { 
                dataField: 'WorkOrderIndex',
                text: 'W.O. Num',
                sort:true
            },{ 
                dataField: 'creationDate',
                text: 'Creation Date',
                sort:true,
                formatter:this.getDate
            },{ 
                dataField: 'deptCode',
                text: 'Department',
                sort:true
            },{ 
                dataField: 'description',
                text: 'Description',
            },{ 
                dataField: 'CrewStatus',
                text: 'Crew Status',
                sort:true
            },{ 
                dataField: 'Comments',
                text: 'Crew Comments',
            },
        ]
        
    
        return (
            <div>
                <header >
                    <h1>Work Orders</h1>
                </header>
                <p>{
                    this.state.springbrookworkOrders.length==0 ?
                        <LoadingSpinner/> :
                        <Button onClick={e=>this.sendToCityworks(e)}>Send SB WOs to Cityworks</Button>
                }
                </p>
                <ButtonGroup className="toggleButtons">
                    {/* TODO: Make it so items get added to the map on
                    refresh and not just initialized */}
                    <Button type="submit" 
                        onClick={e=>{if(window.confirm("By initializing the map you will clear any data on the map.\nDo you want to continue ?")){this.InitMap(e,false)}}}>Initialize Map</Button>
                    <Button  type="submit" onClick={e=>this.InitMap(e,true)}>Refresh Map</Button>
                    <Button><a target="_blank" href='arcgis-collector://?itemID=bdff0372af4349179e9e41b6e954881d'>
                    <i className="fa fa-map fa-lg"/> Open collector
                        </a>
                    </Button>
                </ButtonGroup>
                <br/>
                
                <div>
                {
                    this.state.loading ? <LoadingSpinner /> : 
                        <BootstrapTable 
                            keyField='WorkOrderIndex' 
                            data={ this.state.returnedworkOrders } 
                            columns={ columns } 
                            striped
                            hover
                            className="table"
                            pagination={ paginationFactory() }
                            />
                }
                </div>
                
            </div>
        )
    }
}
export default MapWorkOrders;