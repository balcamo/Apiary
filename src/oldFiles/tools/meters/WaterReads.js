import React, { Component, Fragment } from 'react';
import fetch from 'isomorphic-fetch';
import { Button,Container,Label,Row,Col } from 'reactstrap';
import LoadingSpinner from '../../LoadingSpinner';
import * as urls from '../../../utils/urlsConfig';
import * as fileSaver from 'file-saver';
import $ from "jquery"
import "jquery-ui/ui/widgets/sortable"
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';

class WaterReads extends Component {
    constructor(props) {
        super(props);
        this.state = {
          sbURL:urls.springbrook+'Meter/ReadingImport',
          loading:false,
          
          fileName:'',
          fileHandle: new FormData(),
          reads:[],
          dateStr:''

        };
        this.getDate = this.getDate.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
        this.submitEsriReads = this.submitEsriReads.bind(this);
        this.getWaterReads = this.getWaterReads.bind(this);
      }

    toggleLoading(){
        var today=new Date();
        
    }
    
    componentDidMount(){
        var today=new Date();
        var month=today.getMonth()+1;
        if(month<10){
            month="0"+month
        }
        var day=today.getDate();
        if(day<10){
            day="0"+day
        }
        var year=today.getFullYear().toString();
        var datestr=month+day+year;
        this.state.dateStr=datestr;
        console.log(this.state.dateStr);
        this.getWaterReads();
        this.props.jqueryCardFunction()
    }
   
    getWaterReads() { 
        this.setState({reads:[]})
        fetch(urls.meterReads+"getWaterReads", {
            method:"GET",
            headers: {
                'Authorization': 'Bearer '+this.props.auth.apiaryAuthAccessToken,
                'Content-Type':'application/json'
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
              console.log("the error is : " + error);
              throw error;
            }
          })
            .then(res => res.json())
           .then((data) => {
               console.log("the return from esri ")
               console.log(data)
            //    var towrite=[];
            //    towrite.push("Entry Id,Date Created,Created By,Name,Email,Phone Number,Account Number,Service Address,Address Line 2,City,State / Province / Region,Postal / Zip Code,Country,Meter Number,Read Date,Reading \n");					

            //    console.log(data);
            //     for(var i=0;i<data.length;i++){
            //         towrite.push(data[i]+"\n");
            //     }
            //     var a = new Blob(towrite,{type:"text/csv;charset=utf-8"});
            //     //fileSaver.saveAs(a,"FromWufoo.txt");

            //     this.state.fileHandle.append("FileHandle", a);
               this.setState({ reads: data })
            })
            .catch(console.log);            
    }


    
    
    getDate(cell, row){
        var creation = new Date(cell);

        return creation.toLocaleDateString();
    }

    render(){
        const columns=[
            { 
                dataField: 'MeterIndex',
                text: 'Meter Num',
                sort:true
            },{ 
                dataField: 'Reading',
                text: 'Reading',
            },{ 
                dataField: 'ReadingDate',
                text: 'Reading Date',
                sort:true,
                
            }
        ]
        
        return (
            <Fragment>
                <div className='col-md-12'>
                    <div className={'card card-tools '+this.props.profile.views.tools.waterExpand}>
                        <div className='card-header btn btn-tool btn-minmax btn-max'  
                                    data-card-widget='collapse'
                                    data-toggle='tooltip'
                                    data-placement='top'
                                    title='Collapse Item'>
                        <h3 className='card-title'>
                            <i className='fas fa-text-width'></i>
                            Water Meter Reads
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
                                {this.props.profile.views.tools.waterExpand===''?
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
                                onClick={e=>this.props.toggleWater()}
                            >
                                <i className='fas fa-times'></i>
                            </button>
                        </div>
                    </div>
                    {/* /.card-header */}

                    <div className='card-body'>
                        <Container>
                            <Row>
                                <Col>
                                    {this.props.appToken ? (
                                            <div>

                                            <header >
                                                <h1>Water Reads</h1>
                                            </header>
                                            <div>
                                               
                                                    {
                                                        this.state.loading? <LoadingSpinner/> :
                                                        <div>
                                                            <Label for="submitReads">Send Esri water reads to Springbrook</Label><br/>
                                                            <Button id="submitReads" onClick={e=>{this.setState({loading:true});this.submitEsriReads(e)}}>Download</Button>
                                                            
                                                        </div>
                                                        
                                                    }
                                                    {this.state.reads?
                                                        <BootstrapTable 
                                                            keyField='MeterIndex' 
                                                            data={ this.state.reads } 
                                                            columns={ columns } 
                                                            striped
                                                            hover
                                                            className="table"
                                                            pagination={ paginationFactory() }
                                                            />:
                                                        <LoadingSpinner/>
                                                    }
                                           
                                            </div>
                                        </div>
                                        
                                    ) : (
                                        <LoadingSpinner />
                                    )}
                                </Col>
                            </Row>
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
export default WaterReads;