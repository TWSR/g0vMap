class MapUtility {
    constructor(domElement) {
        this.version = "0.0.1"
        this._domEle = domElement
        this.autoCompleteTags = []
        this._map = {}
        this._nowOnMapThings = []
        this._markers = []
        this._rectangle = null
        this._polygon = null
        this._selectedMarker = null
        this._infowindow = null;
    }

    init() {
        this._map = L.map('map', {
            preferCanvas: true
        }).setView([25.058, 121.524], 16);
        this._map.pre
        var basemaps = {
            TOMTOM: L.tileLayer('http://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=ycANGel6F9q1AytaS2wAgYlrcF7ULpiY', {
                attribution: 'Map data &copy; <a href="https://www.tomtom.com">TOMTOM</a>',
                maxZoom: 18,
            }),
            OSM: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                maxZoom: 18,
            }),
            OSM_GrayScale: L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            })
        };
        L.control.layers(basemaps).addTo(this._map);
        basemaps.OSM_GrayScale.addTo(this._map);
    }

    clean() {
        this._nowOnMapThings.forEach((v, i) => {
            v.remove();
        })
    }

    drawPolyLine(data) {
        if (data.points) {
            var c = this._hsv((3 - data.smooth_index), 0, 3, 120);
            let contentStr = this._createInfowindowContentStr(data);

            // var polyLine = new L.polyline(data.points, {
            //     color: c,
            //     //opacity: 1.0,
            //     weight: 3,
            //     //lineCap: 'round'
            // }).addTo(this._map);
            // polyLine.bindPopup(contentStr);
            // this._nowOnMapThings.push(polyLine)


            var decorator = new L.polylineDecorator(data.points, {
                patterns: [{
                    offset: '100%',
                    repeat: 0,
                    symbol: L.Symbol.arrowHead({ pixelSize: 10, polygon: false, pathOptions: { stroke: true, color: c } })
                        //symbol: L.Symbol.arrowHead({ pixelSize: 5, polygon: false, pathOptions: { stroke: true, color: 'lime' } })
                }]
            }).addTo(this._map);
            decorator.bindPopup(contentStr);
            this._nowOnMapThings.push(decorator)

        }
    }

    _hsv(a, min, max, angle) // 值a, 最小值min, 最大值max, 總角度
        {
            let H = (a - min) / (max - min) * angle
            let Hp = H / 60
            let X = (255.0 * (1 - Math.abs(Hp % 2 - 1)))
            X = parseInt(X)
            let c
            if (Hp >= 0 && Hp < 1) {
                c = "rgba(" + 255 + ", " + X + ", 0, 1)"
            } else if (Hp >= 1 && Hp < 2) {
                c = "rgba(" + X + ", 255, 0, 1)"
            } else if (Hp >= 2 && Hp < 3) {
                c = "rgba(0, 255, " + X + ", 1)"
            } else if (Hp >= 3 && Hp < 4) {
                c = "rgba(0, " + X + ", 255, 1)"
            } else if (Hp >= 4 && Hp < 5) {
                c = "rgba(" + X + ", 0, 255, 1)"
            } else if (Hp >= 5 && Hp < 6) {
                c = "rgba(255, 0, " + X + ", 1)"
            }
            return c;
        }


    _createInfowindowContentStr(data) {

        let contentStr =
            `<div>
            <table class="  ">         
                <tr>
                    <th>time:</th>
                    <td>` + new Date(data.time).toISOString() + `</td>
                </tr>
                <tr>
                    <th>vehicle type:</th>
                    <td>` + ((data.vehicle_type) ? data.vehicle_type : 'car(default)') + `</td>
                </tr>
                <tr>
                    <th>index:</th>
                    <td>` + data.smooth_index.toFixed(3) + `</td>
                </tr>
                <tr>
                    <th>remark:</th>
                    <td>` + data.remark + `</td>
                </tr>`
        contentStr += `</table></div >`

        return contentStr
    }
}