/* urls */
var basemap = 'http://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/basemap_stadsplan_v13/MapServer';
var serviceUrl = 'http://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/basisdata/MapServer/12/query';

/* html nodes */
var infoBox = document.getElementById('info');
var typeSelect = document.getElementById('typeSelect');
var exportPNGElement = document.getElementById('export-png');
var selTbl = document.getElementById('selTbl');

/* sources */
var basemapSrc = new ol.source.XYZ({
		url: basemap + "/tile/{z}/{y}/{x}", 
		crossOrigin: 'anonymous'});

var esrijsonFormat = new ol.format.EsriJSON();

var wegenSrc = new ol.source.Vector({
	loader: function(extent, resolution, projection) {
	      var url = serviceUrl + '?f=json&' +
		  'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
		  encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
			  extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
			  ',"spatialReference":{"wkid":3857}}') +
		  '&geometryType=esriGeometryEnvelope&inSR=3857&outFields=WS_OIDN,LSTRNM&outSR=3857';
		  $.ajax({url: url, dataType: 'jsonp', success: function(response) {
			if (response.error) {
			  alert(response.error.message + '\n' +
				  response.error.details.join('\n'));
			} else {
			  // dataProjection will be read from document
			  var features = esrijsonFormat.readFeatures(response, {
				featureProjection: projection
			  });
			  if (features.length > 0) {
				wegenSrc.addFeatures(features);
				
			  }
			}
		  }});
	},
	strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
	    tileSize: 512
	}))
});
	
var wegenLayer = new ol.layer.Vector({ 
	source: wegenSrc,
	visible: false,
	style: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: [0,0,250,0.4], width: 4 })
		})	
	}) 
	
/* map */
var map = new ol.Map({
	target: 'map',
	logo: false,
	layers: [
		new ol.layer.Tile({
		  extent: [449088.76, 6633705.65, 527193.92, 6701174.53],
		  source: basemapSrc 	
		}), wegenLayer
		],
	view: new ol.View({
	  center: [489349.85, 6668213.47],
	  zoom: 11
	})
});


/* update table, trigget by selection */
function updateTbl(){
	var tableData = [];
	var feats =  select.getFeatures().getArray()
	for (var i = 0; i < feats.length; i++) {
		var feat = feats[i];
		tableData.push({'idx': i, 'id': feat.get('WS_OIDN'), 'name': feat.get('LSTRNM') })
	}
	app.setTableData(tableData);
}

// a normal select interaction to handle click
var select = new ol.interaction.Select({multi: true, 
	style: new ol.style.Style({ stroke: new ol.style.Stroke({color: [255,0,0,0.4], width: 4 }) }),
	toggleCondition: function(){ return true; } 
});
map.addInteraction(select);

// a DragBox interaction used to select features by drawing boxes
var dragBox = new ol.interaction.DragBox({ condition: ol.events.condition.always });
map.addInteraction(dragBox);

function setInteraction() {
	var value = typeSelect.value;
	if (value === 'Box') {
		dragBox.setActive( true )
	}
	else if (value === 'None' ){
		dragBox.setActive( false )
	}
}
setInteraction();

/* geocoder */
var geocoder = new Geocoder('nominatim', {
  autoComplete : true,
  lang: 'nl-BE',  
  countrycodes: 'BE',
  placeholder: 'Zoek een adres',
  limit: 5,
  keepOpen: true
});
map.addControl(geocoder);

/* events */
map.getView().on('change:resolution', function (e) {
   if (map.getView().getZoom() > 13) {
       wegenLayer.setVisible(true);
   }
   if (map.getView().getZoom() <= 13) {
       wegenLayer.setVisible(false);
   }
});

geocoder.on('addresschosen', function(evt){
   setTimeout(function(){
	   geocoder.getLayer().getSource().clear(1);
   }, 3000)
});

typeSelect.onchange = function() {
   setInteraction();
};

select.on('select', function(e) {
	updateTbl();
});

dragBox.on('boxend', function() {
	var extent = dragBox.getGeometry().getExtent();
	wegenSrc.forEachFeatureIntersectingExtent(extent, function(feature) {
	  var exists = false;
	  select.getFeatures().forEach(function(selfeat){
		if( feature === selfeat ){
			select.getFeatures().remove( feature );
			exists = true;
			return;
		}
	  });
	  if( exists == false ){ select.getFeatures().push(feature); }
	});
	updateTbl()
});

/* save picture */
exportPNGElement.addEventListener('click', function() {
  map.once('postcompose', function(event) {
	var canvas = event.context.canvas;
	exportPNGElement.href = canvas.toDataURL('image/png');
  });
  map.renderSync();
}, false);

/* intialise sideNav */
var sideNav = tinkApi.sideNavigation( $("#sideNavLeft") );;
sideNav.init({
  accordion: true,
  gotoPage: false
}); 
