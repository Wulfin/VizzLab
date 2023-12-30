google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(init);

function parseData() {
    return fetch('spotify_songs.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
            throw error;  // Re-throw to handle it in the calling function
        });
}

function drawHistogram(jsonData) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Track Name');
    data.addColumn('number', 'Popularity');

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

function drawGenreDistribution(jsonData) {
    let genreCounts = {};
    jsonData.forEach(track => {
        let genre = track.playlist_genre;  // Updated to use playlist_genre
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Genre');
    data.addColumn('number', 'Count');
    Object.keys(genreCounts).forEach(genre => {
        data.addRow([genre, genreCounts[genre]]);
    });

    var options = {
        title: 'Genre Distribution',
        pieHole: 0.4,
    };

    var chart = new google.visualization.PieChart(document.getElementById('genre_div'));
    chart.draw(data, options);
}

function drawPopularityOverTime(jsonData) {
    let popularityOverTime = {};
    jsonData.forEach(track => {
        let year = new Date(track.track_album_release_date).getFullYear();  // Updated to use track_album_release_date
        if (popularityOverTime[year]) {
            popularityOverTime[year].total += parseInt(track.track_popularity);
            popularityOverTime[year].count++;
        } else {
            popularityOverTime[year] = { total: parseInt(track.track_popularity), count: 1 };
        }
    });

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Year');
    data.addColumn('number', 'Average Popularity');
    Object.keys(popularityOverTime).forEach(year => {
        let avgPopularity = popularityOverTime[year].total / popularityOverTime[year].count;
        data.addRow([parseInt(year), avgPopularity]);
    });

    var options = {
        title: 'Popularity Over Time',
        hAxis: { title: 'Year' },
        vAxis: { title: 'Average Popularity' },
        legend: 'none'
    };

    var chart = new google.visualization.LineChart(document.getElementById('popularity_time_div'));
    chart.draw(data, options);
}

function drawDurationVsPopularity(jsonData) {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Duration (ms)');
    data.addColumn('number', 'Popularity');

    jsonData.forEach(track => {
        data.addRow([parseInt(track.duration_ms), parseInt(track.track_popularity)]);  // Correct fields already
    });

    var options = {
        title: 'Duration vs. Popularity',
        hAxis: { title: 'Duration (ms)' },
        vAxis: { title: 'Popularity' },
        legend: 'none'
    };

    var chart = new google.visualization.ScatterChart(document.getElementById('duration_popularity_div'));
    chart.draw(data, options);
}

function drawTopArtists(jsonData) {
    let artistPopularity = {};
    jsonData.forEach(track => {
        let artist = track.track_artist;  // Updated to use track_artist
        if (artistPopularity[artist]) {
            artistPopularity[artist].total += parseInt(track.track_popularity);
            artistPopularity[artist].count++;
        } else {
            artistPopularity[artist] = { total: parseInt(track.track_popularity), count: 1 };
        }
    });

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Artist');
    data.addColumn('number', 'Average Popularity');
    Object.keys(artistPopularity).forEach(artist => {
        let avgPopularity = artistPopularity[artist].total / artistPopularity[artist].count;
        data.addRow([artist, avgPopularity]);
    });

    var options = {
        title: 'Top Artists by Average Track Popularity',
        hAxis: { title: 'Average Popularity' },
        vAxis: { title: 'Artist' },
        legend: 'none'
    };

    var chart = new google.visualization.BarChart(document.getElementById('top_artists_div'));
    chart.draw(data, options);
}

function init() {
    parseData().then(jsonData => {
        console.log("Data loaded successfully:", jsonData);
        if (!jsonData || !jsonData.length) {
            console.error("Data is empty or not in expected format");
            return;  // Stop if no data
        }
        drawHistogram(jsonData);
        drawGenreDistribution(jsonData);
        drawPopularityOverTime(jsonData);
        drawDurationVsPopularity(jsonData);
        drawTopArtists(jsonData);
    }).catch(error => {
        console.error("Failed to load and parse data:", error);
    });
}
