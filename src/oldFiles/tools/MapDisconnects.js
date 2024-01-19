import React, { Component, Fragment} from 'react';
import fetch from 'isomorphic-fetch';
import {  ButtonGroup, Button, Container, Table, UncontrolledTooltip  } from 'reactstrap';
import LoadingSpinner from '../LoadingSpinner';
import * as urls from '../../utils/urlsConfig';
import $ from "jquery"
import "jquery-ui/ui/widgets/sortable"
import "jquery-ui"

class MapDisconnects extends Component {
    constructor(props) {
        super(props);
        this.state = {
          baseURL:urls.springbrook+'Disconnect',
          esriURL:urls.esriPage+'disconnects/',
          selectedState: 'In Progress',
          setState:false,
          workOrderNums:[],
          dropdownOpen:false,
          setDropdownOpen:false,
          isHidden:true,
          springbrookDisconnects:[],
          returnedDisconnects:[],
          loading: false,
          esriEndpoint:'',
          list:true,
          disdata:""
        };
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
      }

    toggleLoading(){
        this.setState({loading:!this.state.loading})
    }
    toggleDropDown(){
        this.setState({dropdownOpen: !this.state.dropdownOpen});
    }
    
    componentDidMount(){
      this.getFromEsri();
      (function () {
        
        $(".btn-minmax").on("click", function () {
            var clickObject = this
            if ($(clickObject).hasClass("btn-min")) {
                setTimeout(function () {
                    // LEVEL "3" IS CURENTLY SET FOR PARENT CALCULATIONS - CHANGE IF RESIZE BUTTONS ARE PLACED IN A DIFFERENT POSITION
                    // CURRENTLY SET TO MOBILE COLUMN BREAK 'MD'
                    $(clickObject)
                        .parents()
                        .eq(3)
                        .removeClass(function (index, className) {
                            return (
                                className.match(/(^|\s)col-md-\S+/g) || []
                            ).join(" ")
                        })
                    $(clickObject).parents().eq(3).addClass("col-md-12")
                    $(clickObject).removeClass("btn-min")
                $(clickObject).addClass("btn-max")
                }, 500)
                
            } else if ($(clickObject).hasClass("btn-max")) {
                // LEVEL "3" IS CURENTLY SET FOR PARENT CALCULATIONS - CHANGE IF RESIZE BUTTONS ARE PLACED IN A DIFFERENT POSITION
                // CURRENTLY SET TO MOBILE COLUMN BREAK 'MD'
                $(clickObject)
                    .parents()
                    .eq(3)
                    .removeClass(function (index, className) {
                        return (
                            className.match(/(^|\s)col-md-\S+/g) || []
                        ).join(" ")
                    })
                $(clickObject).parents().eq(3).addClass("col-md-12")
                $(clickObject).removeClass("btn-max")
                $(clickObject).addClass("btn-min")
            }
        })

        $(".btn-expand").on("click", function () {
            // LEVEL "3" IS CURENTLY SET FOR PARENT CALCULATIONS - CHANGE IF RESIZE BUTTONS ARE PLACED IN A DIFFERENT POSITION
            var currentClass = $(this).parents().eq(3).attr("class")
            var currentClassPart = ""
            $.each(currentClass.split(/\s/), function (_, cn) {
                // CURRENTLY SET TO MOBILE COLUMN BREAK 'MD'
                if (cn.indexOf("col-md") === 0) {
                    currentClassPart = cn
                    return false
                }
            })
            var currentMatches = currentClassPart.match(/\d+$/)
            if (currentMatches) {
                var currentSize = parseInt(currentMatches[0], 10)
            }
            if (currentSize < 12) {
                var newSize = currentSize + 1
                // CURRENTLY SET TO MOBILE COLUMN BREAK 'MD'
                $(this)
                    .parents()
                    .eq(3)
                    .removeClass("col-md-" + currentSize)
                $(this)
                    .parents()
                    .eq(3)
                    .addClass("col-md-" + newSize)
            }
        })

        $(".btn-compress").on("click", function () {
            // LEVEL "3" IS CURENTLY SET FOR PARENT CALCULATIONS - CHANGE IF RESIZE BUTTONS ARE PLACED IN A DIFFERENT POSITION
            var currentClass = $(this).parents().eq(3).attr("class")
            var currentClassPart = ""
            $.each(currentClass.split(/\s/), function (_, cn) {
                // CURRENTLY SET TO MOBILE COLUMN BREAK 'MD'
                if (cn.indexOf("col-md") === 0) {
                    currentClassPart = cn
                    return false
                }
            })
            var currentMatches = currentClassPart.match(/\d+$/)
            if (currentMatches) {
                var currentSize = parseInt(currentMatches[0], 10)
            }
            if (currentSize > 12) {
                var newSize = currentSize - 1
                // CURRENTLY SET TO MOBILE COLUMN BREAK 'MD'
                $(this)
                    .parents()
                    .eq(3)
                    .removeClass("col-md-" + currentSize)
                $(this)
                    .parents()
                    .eq(3)
                    .addClass("col-md-" + newSize)
            }
        })
    })()
    }
 
    InitMap(e,refresh) {
        e.preventDefault();

        console.log('in change function '+this.state.selectedState);
        this.toggleLoading();
        this.getSB(refresh);
        
    }
    getSB(refresh){
        fetch(this.state.baseURL, {
            method:"GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+this.props.sbToken  
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
            this.setState({loading:false});
            throw error;
            }
        })
        .then(res => res.json())
        .then((data) => {

            console.log(data);
            if(data.length===0){
                alert("There are no current disconnects for the criteria.");
            }else{
                this.setState({springbrookDisconnects:[]});
                var tempdata=data;
                
                tempdata.map(val=>this.state.springbrookDisconnects.push(val));
                this.setState({ springbrookDisconnects:this.state.springbrookDisconnects})
            
                
            }
            this.clearEsri(refresh); 
        })
           .catch(console.log);
           
        return false
    }
    clearEsri(refresh){
        if(refresh){
            this.sendToEsri(refresh);
        }else{
            fetch(this.state.esriURL+'init', {
                //mode:"no-cors",
                method:"GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.props.appToken  
                  },
            }).then(function(response) {
                if (response.ok) {
                return response
                } else if(response.status === 401){
                    alert("Your token has expired. Please refresh the page.");
                    this.setState({loading:false})
                } else {
                var error = new Error(response.statusText);
                error.response = response;
                this.setState({loading:false});
                throw error;
                }
            })
            .then(res => res.text())
            .then((data) => {
                console.log(data);
                this.sendToEsri()
            })
            .catch(console.log);
              
        }

    }
    sendToEsri(){
        console.log(meters);        
        for(var i=0;i<this.state.springbrookDisconnects.length;i++){
        var meters={"meters":[this.state.springbrookDisconnects[i]]};
        fetch(this.state.esriURL+'refresh', {
            //mode:"no-cors",
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
            }else {
            var error = new Error(response.statusText);
            error.response = response;
            this.setState({loading:false});
            throw error;
            }
        })
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            if(data.length===0){
                alert("There are no current disconnects for the criteria.");
            }else{
                console.log(JSON.stringify(data));
            }
           
            }).then(()=>{
                var j = i+1
                if(i===this.state.springbrookDisconnects.length){
                    this.getFromEsri()
                }
                console.log("sent item "+i+" out of "+this.state.springbrookDisconnects.length)
            })
           .catch(console.log);
          }
    }
    getFromEsri(){
        var meters=this.state.springbrookDisconnects;
        console.log(meters);
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
                this.setState({loading:false});
                throw error;
            }
        })
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            if(data.length===0){
                this.setState({loading:false});
            }else{
                this.setState({returnedDisconnects:[]});
                //console.log(data);
                this.setState({loading:false, returnedDisconnects:data})

                console.log(this.state.returnedDisconnects);
            }
            })
            
           .catch(console.log);
           this.setState({loading:false});

    }
    render(){
        var disconnects;
        if(this.state.returnedDisconnects.length === 0){
            disconnects = (
                <p>There is no data being returned from Esri. Try initializing the map.</p>
                );
        }  else {
            disconnects = (
                this.state.returnedDisconnects.map((item)=>
                    <tr key={item.MeterIndex}>
                        <td>{item.cust_name}</td>
                        <td>{item.ADDRESS}</td>
                        <td>{item.MeterIndex}</td>
                        <td>{item.total_amount_due}</td>
                        <td>{item.UbAccountIndex}</td>
                    </tr>
                )
            )
        }   
        return (
            <Fragment>
                <div className='col-md-12'>
                    <div className={'card card-tools '+this.props.profile.views.tools.disconnectsExpand}>
                        <div className='card-header btn btn-tool btn-minmax btn-max'  
                                    data-card-widget='collapse'
                                    data-toggle='tooltip'
                                    data-placement='top'
                                    title='Collapse Item'>
                            <h3 className='card-title'>
                                <i className='fas fa-text-width'></i>
                                Disconnects
                            </h3>
                            <div className='card-tools'>
                                {/* RESIZE BUTTONS NEED TO BE IN card-tools AREA OR LEVEL NEEDS TO BE ADJUSTED IN THE JAVASCRIPT  */}
                                {/* <button
                                    type='button'
                                    className='btn btn-tool btn-compress'
                                    data-toggle='tooltip'
                                    data-placement='top'
                                    title='Reduce Size'
                                >
                                    <i className='fas fa-search-minus'></i>
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-tool btn-expand'
                                    data-toggle='tooltip'
                                    data-placement='top'
                                    title='Increase Size'
                                >
                                    <i className='fas fa-search-plus'></i>
                                </button> */}
                                <button
                                    type='button'
                                    className='btn btn-tool btn-minmax btn-max'
                                    data-card-widget='collapse'
                                    data-toggle='tooltip'
                                    data-placement='top'
                                    title='Collapse Item'
                                >
                                     {this.props.profile.views.tools.disconnectsExpand===''?
                                        <i className='fas fa-minus'></i>:
                                        <i className='fas fa-plus'></i>
                                        
                                    }
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-tool'
                                    data-card-widget='remove'
                                    data-toggle='tooltip'
                                    data-placement='top'
                                    title='Remove Item'
                                    onClick={e=>this.props.toggleDisconnects()}
                                >
                                    <i className='fas fa-times'></i>
                                </button>
                            </div>
                        </div>
                        {/* /.card-header */}

                        <div className='card-body'>
                            <Container>
                                {this.props.appToken ? (
                                        <div>
    
                                        <header >
                                            <h1>Disconnects</h1>
                                        </header>
                                        <ButtonGroup>
                                            <Button type="submit" 
                                                onClick={e=>{if(window.confirm("By initializing the map you will clear any data on the map.\nDo you want to continue ?")){this.InitMap(e,false)}}}>Initialize Map</Button>
                                            <Button type="submit" onClick={e=>this.InitMap(e,true)}>Refresh Map</Button>
                                            <Button><a target="_blank" href='arcgis-collector://?itemID=3b603af45ac34d0091ea9c011fe230d7'>
                                                Open collector
                                                </a>
                                            </Button>
                                        </ButtonGroup>
                                        <div>
                                        {
                                            this.state.loading ?
                                            <LoadingSpinner /> : 
                                            <Fragment>
                                           
                                                <Table bordered dark hover>
                                                    <thead>
                                                        <tr>
                                                            <td>Name</td>
                                                            <td>Address</td>
                                                            <td>Meter #</td>
                                                            <td>Balance</td>
                                                            <td>UB Account</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {disconnects}
                                                    </tbody>
                                                </Table></Fragment>
                                        }
                                        </div>
                                        
                                    </div>
                                        
                                ) : (
                                    <LoadingSpinner />
                                )}
                            </Container>
                        </div>

                        {/* /.card-body */}
                    </div>
                    {/* /.card */}
                </div>
            </Fragment>

           
        )
    }
}
export default MapDisconnects;