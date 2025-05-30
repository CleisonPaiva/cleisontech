import Map from "https://js.arcgis.com/4.29/@arcgis/core/Map.js";
import MapView from "https://js.arcgis.com/4.29/@arcgis/core/views/MapView.js";
import FeatureLayer from "https://js.arcgis.com/4.29/@arcgis/core/layers/FeatureLayer.js";
import Legend from "https://js.arcgis.com/4.29/@arcgis/core/widgets/Legend.js";

let buildsLayer;

let basemaps = [];
basemaps.push({
  name: "Topographic",
  value: "topo-vector",
});
basemaps.push({
  name: "Satellite",
  value: "satellite",
});
basemaps.push({
  name: "Hybrid",
  value: "hybrid",
});
basemaps.push({
  name: "Streets",
  value: "streets-vector",
});
basemaps.push({
  name: "Terrain",
  value: "terrain",
});
basemaps.push({
  name: "Paths and Roads",
  value: "osm",
});
basemaps.push({
  name: "Oceans",
  value: "oceans",
});

basemaps.forEach((basemap) => {
  const button = document.createElement("button");
  button.textContent = basemap.name;
  button.onclick = () => {
    map.basemap = basemap.value;
  };
  document.getElementById("basemapType").appendChild(button);
});

const map = new Map({
  basemap: "satellite",
});

const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [-40.3128, -20.3155], // Vitória, ES
  zoom: 13,
});

const legend = new Legend({
  view: view,
});
view.ui.add(legend, "bottom-right");

const typeBuildSelect = document.getElementById("typeBuildSelect");

const codedValues = [
  { name: "Education", code: 1 },
  { name: "Health", code: 2 },
  { name: "Drainage", code: 3 },
  { name: "Slopes", code: 4 },
  { name: "Mobility", code: 5 },
  { name: "Leisure", code: 6 },
  { name: "Infrastructure", code: 7 },
  { name: "Social Assistance", code: 8 },
  { name: "Housing", code: 9 },
  { name: "Stairs", code: 10 },
];

codedValues.forEach(({ code, name }) => {
  const option = document.createElement("option");
  option.value = code;
  option.textContent = name;
  typeBuildSelect.appendChild(option);
});

const uniqueValueRenderer = {
  type: "unique-value",
  field: "tipo", // campo que determina a categoria
  defaultSymbol: {
    type: "simple-marker",
    color: "gray",
    size: 8
  },
  uniqueValueInfos: [
    {
      value: 1,
      symbol: {
        type: "simple-marker",
        color: "blue",
        size: 10
      },
      label: "Education"
    },
    {
      value: 2,
      symbol: {
        type: "simple-marker",
        color: "green",
        size: 10
      },
      label: "Health"
    },
    {
      value: 3,
      symbol: {
        type: "simple-marker",
        color: "orange",
        size: 10
      },
      label: "Drainage"
    },
    {
      value: 4,
      symbol: {
        type: "simple-marker",
        color: "red",
        size: 10
      },
      label: "Slopes"
    },
    {
      value: 5,
      symbol: {
        type: "simple-marker",
        color: "yellow",
        size: 10
      },
      label: "Mobility"
    },
    {
      value: 6,
      symbol: {
        type: "simple-marker",
        color: "black",
        size: 10
      },
      label: "Leisure"
    },
    {
      value: 7,
      symbol: {
        type: "simple-marker",
        color: "purple",
        size: 10
      },
      label: "Infrastructure"
    },
    {
      value: 8,
      symbol: {
        type: "simple-marker",
        color: "pink",
        size: 10
      },
      label: "Social Assistance"
    },
    {
      value: 9,
      symbol: {
        type: "simple-marker",
        color: "brown",
        size: 10
      },
      label: "Housing"
    },
    {
      value: 10,
      symbol: {
        type: "simple-marker",
        color: "cyan",
        size: 10
      },
      label: "Stairs"
    },
    {
      value: 11,
      symbol: {
        type: "simple-marker",
        color: "gray",
        size: 10
      },
      label: "Other"
    }
  ]
};

buildsLayer = new FeatureLayer({
  url: "https://gis.vitoria.es.gov.br/arcgis/rest/services/Edit/ObraPublicaStoryMaps/MapServer/0",
  outFields: ["*"],
  renderer: uniqueValueRenderer,
  popupTemplate: {
    title: "{nome}",
    content: `
            <strong>Start:</strong> {inicio}<br>
            <strong>Expected Delivery:</strong> {final}<br>
            <strong>Contracted:</strong> {contratada}<br>
            <strong>Progress Percentage:</strong> {percentualAndamento}%<br>
            <strong>Situation:</strong> {situacaoAtual}
          `,
  },
});

typeBuildSelect.addEventListener("change", () => {
  const selected = typeBuildSelect.value;
  buildsLayer.definitionExpression = selected ? `tipo = ${selected}` : null;
});

map.add(buildsLayer);
