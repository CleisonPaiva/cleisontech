require(["esri/config", "esri/views/SceneView"], function(esriConfig, SceneView) {
            esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurMrIUxu4Ip2HSeoi2rKHLyOAdY3ja5z63C-Dw1Dx2-MBdu1BHSJghGdj7MepUlsgu8Na2IlvzGkQuh5qEmbRQDGtDabEo1a-fCzyXwse7A7bLO_HOE7PhXVT5SXBqfkqK1Yr6KSqDmyyOrcoD_Hl4_2bmasqdHkYWHcyTif4pvhGhQP-Vup_DX50phd8w8TLe7LtQy7FF3FgOxpG-GrkSic.AT1_83Q1q6hR";

            const arcgisScene = document.querySelector("arcgis-scene");

            arcgisScene.addEventListener("arcgisViewReadyChange", () => {
                const window.view = arcgisScene.view;

                view.camera = {
                    position: [
                        -40.313,
                       -20.288,
                        300],
                    heading: 77.40,
                    tilt: 77.25
                  };

                view.environment.lighting = {
                    type: "sun",
                    date: new Date("January 1, 2022 15:00:00 UTC"),
                };
                view.environment.lighting.directShadowsEnabled = true;
            });
         });