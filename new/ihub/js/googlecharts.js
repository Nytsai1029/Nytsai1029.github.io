google.charts.load('current', {'packages':['corechart']});
google.charts.load('current', {'packages':['bar']});
google.charts.load("current", {'packages':["calendar"]});
google.charts.load("current", {'packages':["timeline"]});
google.charts.setOnLoadCallback(drawChart);
google.charts.setOnLoadCallback(drawChart1);
google.charts.setOnLoadCallback(drawChart2);
google.charts.setOnLoadCallback(drawChart3);
google.charts.setOnLoadCallback(drawChart4);

function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
        ['sleep', 7],
        ['playing piano', 1],
        ['studying', 9],
        ['eating & playing', 3],
        ['relax', 4]
    ]);
    var options = { 'title':'Time consuming in a day / hours',
                    'width':500,
                    'height':500};
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function drawChart1() {
    var data1 = google.visualization.arrayToDataTable([
        ['Years', 'Andy', 'Anne', 'Amy'],
        ['2021', 3.81, 4.19, 2.78],
        ['2022', 3.62, 3.22, 2.65],
        ['2023', 3.91, 3.98, 3.75],
        ['2024', 4.02, 2.99, 3.92]
    ]);

    var options1 = {
        chart: {
            title: 'GPA Performance (4.3 as the highest)',
            subtitle: '3 Students in a Group: 2021-2024',
        },
        bars: 'horizontal' // Required for Material Bar Charts.
    };

    var chart = new google.charts.Bar(document.getElementById('barchart_material'));

    chart.draw(data1, google.charts.Bar.convertOptions(options1));
}

function drawChart2() {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'date', id: 'Date' });
    dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
    dataTable.addRows([
        [ new Date(2012, 3, 13), 3],
        [ new Date(2012, 3, 14), 3 ],
        [ new Date(2012, 3, 15), 5 ],
        [ new Date(2012, 3, 16), 2],
        [ new Date(2012, 3, 17),7 ],
        [ new Date(2012, 5, 22), 13 ],
        [ new Date(2012, 11, 17),9 ],
        // Many rows omitted for brevity.
        [ new Date(2013, 9, 4), 1],
        [ new Date(2013, 9, 5), 12 ],
        [ new Date(2013, 9, 12), 3 ],
        [ new Date(2013, 9, 13), 4 ],
        [ new Date(2013, 9, 19), 5 ],
        [ new Date(2013, 9, 23), 2],
        [ new Date(2013, 9, 24), 3 ],
        [ new Date(2013, 9, 30), 7 ]
    ]);

    var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

    var options = {
        title: "Numbers of Submition to A Project",
        height: 350,
    };

    chart.draw(dataTable, options);
}

function drawChart3() {
    var data = google.visualization.arrayToDataTable([
        ['Year', 'China', 'India'],
        ['2021',  1443981565, 1408044253],
        ['2022',  1451432510, 1425771530],
        ['2023',  1458921902, 1443721994],
        ['2024',  1466449939, 1461898454]
    ]);

    var options = {
        title: 'Population Of China & India',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}

function drawChart4() {

    var container = document.getElementById('example3.1');
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Position' });
    dataTable.addColumn({ type: 'string', id: 'Name' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
    dataTable.addRows([
        [ 'President', 'George Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
        [ 'President', 'John Adams', new Date(1797, 2, 4), new Date(1801, 2, 4) ],
        [ 'President', 'Thomas Jefferson', new Date(1801, 2, 4), new Date(1809, 2, 4) ],
        [ 'Vice President', 'John Adams', new Date(1789, 3, 21), new Date(1797, 2, 4)],
        [ 'Vice President', 'Thomas Jefferson', new Date(1797, 2, 4), new Date(1801, 2, 4)],
        [ 'Vice President', 'Aaron Burr', new Date(1801, 2, 4), new Date(1805, 2, 4)],
        [ 'Vice President', 'George Clinton', new Date(1805, 2, 4), new Date(1812, 3, 20)],
        [ 'Secretary of State', 'John Jay', new Date(1789, 8, 25), new Date(1790, 2, 22)],
        [ 'Secretary of State', 'Thomas Jefferson', new Date(1790, 2, 22), new Date(1793, 11, 31)],
        [ 'Secretary of State', 'Edmund Randolph', new Date(1794, 0, 2), new Date(1795, 7, 20)],
        [ 'Secretary of State', 'Timothy Pickering', new Date(1795, 7, 20), new Date(1800, 4, 12)],
        [ 'Secretary of State', 'Charles Lee', new Date(1800, 4, 13), new Date(1800, 5, 5)],
        [ 'Secretary of State', 'John Marshall', new Date(1800, 5, 13), new Date(1801, 2, 4)],
        [ 'Secretary of State', 'Levi Lincoln', new Date(1801, 2, 5), new Date(1801, 4, 1)],
        [ 'Secretary of State', 'James Madison', new Date(1801, 4, 2), new Date(1809, 2, 3)]
    ]);

    chart.draw(dataTable);
}