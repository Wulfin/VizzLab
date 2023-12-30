google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(init);

function parseData() {
    return fetch('spotify_songs.json')
        .then(response => response.json())
        .catch(error => console.error('Error fetching JSON:', error));
}

function drawHistogram(jsonData) {
    // Create a DataTable
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Track Name');
    data.addColumn('number', 'Popularity');

    // Add data to the DataTable
    jsonData.forEach(track => {
        data.addRow([track.track_name, parseInt(track.track_popularity)]);
    });

    var options = {
        title: 'Popularity Distribution of Tracks',
        legend: { position: 'none' },
        hAxis: { title: 'Track Name' },
        vAxis: { title: 'Popularity' }
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function init() {
    parseData().then(drawHistogram);
}