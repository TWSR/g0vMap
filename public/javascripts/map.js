$(function() {

    let mapUtility = new MapUtility($("#map").get(0))
    mapUtility.init()
    let Alldataset, Container, ShowingData

    //fetch('/testData/20180122-180232客運.json')
    fetch('/api/road')
        .then((response) => response.json())
        .then((dataset) => {
            // const stdZ = (function(){
            //     const sum = dataset.reduce((total, data) => total + data.z, 0)
            //     const avg = sum/dataset.length
            //     const squareSum = dataset.reduce((total, data) => (total + Math.pow(data.z-avg, 2)), 0)                
            //     return Math.sqrt(squareSum / (dataset.length-1))
            // }()) 
            Alldataset = dataset
            Container = new Set(dataset)
                // dataset.forEach(data => {
                //         mapUtility.drawPolyLine(data)
                //     })
            $("#filter").click();


            // draw circle way
            // let points = []
            // dataset.forEach((data) => {
            // const weightedLoc = {
            //     location: new google.maps.LatLng(data.lat, data.lng),
            //     weight: data.z*1000
            // }
            // points.push(weightedLoc)
            // mapUtility.drawCircle(data)                
            // })

            // draw heatmap way
            // mapUtility.drawHeatMap(points)
        })
        .catch(err => {
            console.log('can not fetch roadinfo data.')
            console.log(err)
        })

    // Filter box's user dropdown
    // fetch('/api/user')
    //     .then((response) => response.json())
    //     .then((users) => {
    //         users.forEach(item => {
    //             if (item.user) {
    //                 $("#user").append($('<option>', {
    //                     value: item.user,
    //                     text: item.user
    //                 }))
    //             }
    //         })
    //     })
    //     .catch(err => {
    //         console.log('can not fetch user.')
    //         console.log(err)
    //     })

    // filter click event
    $("#filter").click(() => {

        const filter = $("#slider").val() ? $("#slider").val() : null
        const user = $("#user").val() ? $("#user").val() : null
        const vehicleType = $("#vehicle_type").val() ? $("#vehicle_type").val() : null
        const timeS = $("#datetimepickerS").data().date ? new Date($("#datetimepickerS").data().date) : null
        const timeE = $("#datetimepickerE").data().date ? new Date($("#datetimepickerE").data().date) : null

        // do filter
        ShowingData = [...Container].filter((data) => {
            if (filter && data.smooth_index < filter) { return false }
            if (vehicleType && data.vehicle_type != vehicleType) { return false }
            if (user && data.user != user) { return false }
            if (timeS && timeE) {
                const dt = new Date(data.time);
                const dataTime = new Date(dt.getTime() + dt.getTimezoneOffset() * 60000);
                if (dataTime < timeS || dataTime > timeE) { return false }
            }
            return true
        })

        console.log('showing data count: ' + ShowingData.length)

        mapUtility.clean()

        ShowingData.forEach(data => {
            mapUtility.drawPolyLine(data)
        })

        var download = [];
        ShowingData.forEach(data => {
            var d = {};
            d.smooth_index = data.smooth_index;
            d.time = data.time;
            d.vehicle_type = data.vehicle_type;
            d.lat = data.lat;
            d.lng = data.lng;
            download.push(d);
        })
        var datalink = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(download));
        $('#downlink').attr('href', 'data:' + datalink);
        $('#downlink').attr('download', 'data.json');
    })

    $("#slider").change(function() {
        $("#smooth-index").html($(this).val())
    })

    // datetime picker--start
    $("#datetimepickerS").datetimepicker()

    $("#datetimepickerE").datetimepicker({
        useCurrent: false
    })

    $("#datetimepickerS").on("change.datetimepicker", function(e) {
        $('#datetimepickerE').datetimepicker('minDate', e.date);
    });

    $("#datetimepickerE").on("change.datetimepicker", function(e) {
        $('#datetimepickerS').datetimepicker('maxDate', e.date);
    });
    // datetime picker--end
})