let map;
let mapView;
let layer;

require([
  "esri/Map",
  "esri/views/MapView",
  "esri/request",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
], function (Map, MapView, esriRequest, FeatureLayer, Legend) {
  map = new Map({
    basemap: "osm",
  });

  mapView = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 13,
    center: [-40.31348664550782, -20.288130439092246], // Vitória, ES
  });

  const legend = new Legend({
    view: mapView,
  });
  mapView.ui.add(legend, "bottom-right");

  // Remove layer button — registrado UMA vez, fora do change
  document.getElementById("removeLayer").addEventListener("click", function () {
    if (layer) {
      map.remove(layer);
      layer = null;
      document.getElementById("typeLayerSelect").selectedIndex = 0;
    }
  });

  const typeLayerSelect = document.getElementById("typeLayerSelect");

  // Feedback de loading enquanto busca os layers
  typeLayerSelect.innerHTML = '<option disabled selected>Loading layers...</option>';

  const url = "https://gis.vitoria.es.gov.br/arcgis/rest/services/Opendata/DadosAbertos/MapServer?f=json";
  const options = { type: "json", responseType: "json" };

  esriRequest(url, options)
      .then(function (response) {
        const result = response.data;

        // Reseta o select com o placeholder correto
        typeLayerSelect.innerHTML = '<option disabled selected>Select Layer</option>';

        result.layers.forEach(function (lyr) {
          const option = document.createElement("option");
          option.value = lyr.id;
          option.textContent = lyr.name;
          typeLayerSelect.appendChild(option);
        });

        typeLayerSelect.addEventListener("change", function () {
          const selectedOption = typeLayerSelect.options[typeLayerSelect.selectedIndex];
          const layerTitle = selectedOption.text;
          const selectedLayer = typeLayerSelect.value;

          // Remove layer anterior antes de adicionar novo
          if (layer) {
            map.remove(layer);
          }

          layer = new FeatureLayer({
            url:
                "https://gis.vitoria.es.gov.br/arcgis/rest/services/Opendata/DadosAbertos/MapServer/" +
                selectedLayer,
            title: layerTitle,
            popupTemplate: {
              title: "Informações",
              content: function (feature) {
                const attributes = feature.graphic.attributes;
                const fields = feature.graphic.sourceLayer.fields;
                let content = "<table>";

                fields.forEach((field) => {
                  const value = attributes[field.name];
                  if (value !== null && value !== "" && value !== undefined) {
                    const label = field.alias || field.name;
                    content += `<tr><td><strong>${label}</strong></td><td>${value}</td></tr>`;
                  }
                });

                content += "</table>";
                return content;
              },
            },
          });

          map.add(layer);
        });
      })
      .catch(function (error) {
        console.error("Erro ao carregar layers:", error);
        typeLayerSelect.innerHTML = '<option disabled selected>Failed to load layers</option>';
      });
});