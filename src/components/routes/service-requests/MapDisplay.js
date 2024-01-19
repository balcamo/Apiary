import React from "react";
import Portal from "@arcgis/core/portal/Portal"
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo"
import esriId from "@arcgis/core/identity/IdentityManager"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";



export default function MapDisplay(filters) {
    // Set up the query strings for the filtering process
    let serviceRequestFilterLayer ;
    console.log(filters);
    let statusQuery = "(";
    let typeQuery ="(";
    if(filters.statusFilter){
      for( var i = 0; i< filters.statusFilter.length;i++ ){
        if(filters.statusFilter[i] != 'Completed'){
          if (i== filters.statusFilter.length-1 ) statusQuery +="Status = '"+filters.statusFilter[i]+"')";
          else statusQuery +="Status = '"+filters.statusFilter[i]+"' OR ";
        }
      }
    }
    if(filters.typeFilter){
      for( var i = 0; i< filters.typeFilter.length;i++ ){
        
        if (i== filters.typeFilter.length-1 ) typeQuery +="Code = '"+filters.typeFilter[i]+"')";
        else typeQuery +="Code = '"+filters.typeFilter[i]+"' OR ";
      }
    }

		
/** Start set up SSO organization access to secure mapes and layers */
  const info = new OAuthInfo({
    appId: "1wKRcHktJgWsYHFq",
    popup: false, // the default
    portalUrl:"https://verawp.maps.arcgis.com/"
  });

  esriId.registerOAuthInfos([info]);

  esriId.checkSignInStatus(info.portalUrl + "/sharing")
  .then(() => {
    handleEsriSignedIn();
  }).catch(() => {
    handleEsriSignedOut();
  })

  function handleEsriSignedIn() {

    const portal = new Portal();
    portal.load().then(() => {
      const results = { name: portal.user.fullName, username: portal.user.username };
      document.getElementById("results").innerText = JSON.stringify(results, null, 2);
    });

  }
  function handleEsriSignedOut() {
    document.getElementById("results").innerText = 'Signed Out'
  }
/** End set up SSO organization access to secure mapes and layers */

/********************
         * Add feature layer
         ********************/

        // Create the PopupTemplate
        const popupTemplate = {
          // autocasts as new PopupTemplate()
          title: "Service Request {ServiceReq}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "Status",
                  label: "Status",
                  format: {
                    places: 0,
                    digitSeparator: true
                  }
                },
                {
                  fieldName: "Address",
                  label: "Address",
                  format: {
                    places: 0,
                    digitSeparator: true
                  }
                }
              ]
            }
          ]
        };
    // Create the FeatureLayer using the popupTemplate
    const serviceRequestLayer = new FeatureLayer({
      title: "Service Requests",
      url:"https://services3.arcgis.com/69kvdgihDDE3KD4Z/arcgis/rest/services/ServiceRequest/FeatureServer/",
      outFields: ["ServiceReq"], // used by queryFeatures
      popupTemplate: popupTemplate
      
    });
  
// make the map
const map = new Map({
  basemap: "arcgis-topographic",
  layers: [serviceRequestLayer]
});
//make the view and connect to the html id viewDiv
const view = new MapView({
  container: "viewDiv",
  map,
  
});

// set the view to go to the layer's set view area/context
serviceRequestLayer.when(() => {
  view.goTo(serviceRequestLayer.fullExtent);
});
// set up filter
function filterByStatus() {
  const selectedStstus = "Not Completed";
  serviceRequestFilterLayer.filter = {
    where: "Status = '" + selectedStstus + "'"
  };
}
view.whenLayerView(serviceRequestLayer).then((layerView) => {
  // set query based on filters passed
  var query;
  if(statusQuery.length>1 && typeQuery.length>1) query=statusQuery +" AND "+ typeQuery;
  else if(statusQuery.length>1 && typeQuery.length == 1) query = statusQuery;
  else if(statusQuery.length==1 && typeQuery.length > 1) query = typeQuery ;
  else query = 'OBJECTID_1 >0 '
  layerView.filter = {
    where: query
  };
})



    return( 
      <div >
        <div id="viewDiv" className="mapContainer"></div>
      </div> 
    )

}