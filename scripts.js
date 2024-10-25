const width = 960;
const height = 600;
const padding = 60;

// Load the dataset
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then(dataset => {
    
    // Convert time format for y-axis (minutes and seconds)
    const timeFormat = d3.timeFormat("%M:%S");
    const parseTime = d3.timeParse("%M:%S");
    
    dataset.forEach(d => {
        d.Time = parseTime(d.Time);
    });

    // Set up scales for x and y axes
    const xScale = d3.scaleLinear()
        .domain([d3.min(dataset, d => d.Year) - 1, d3.max(dataset, d => d.Year) + 1])
        .range([padding, width - padding]);

    const yScale = d3.scaleTime()
        .domain([d3.min(dataset, d => d.Time), d3.max(dataset, d => d.Time)])
        .range([padding, height - padding]);

    // Create SVG canvas
    const svg = d3.select('svg');

    // Create x-axis
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d")); // Format for year

    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`)
        .call(xAxis);

    // Create y-axis
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(timeFormat); // Format for time (minutes:seconds)

    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis);

    svg.selectAll('circle')
        .data(dataset)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.Year))
        .attr('cy', d => yScale(d.Time))
        .attr('r', 6)
        .attr('fill', d => d.Doping ? 'red' : 'blue')
        .attr('data-xvalue', d => d.Year)
        .attr('data-yvalue', d => d.Time)
        .on('mouseover', (event, d) => {
            d3.select('#tooltip')
                .style('opacity', 1)
                .html(`Year: ${d.Year}<br>Time: ${timeFormat(d.Time)}<br>${d.Doping ? d.Doping : 'No doping'}`)
                .attr('data-year', d.Year)
                .style('left', `${event.pageX + 5}px`)
                .style('top', `${event.pageY - 30}px`);
        })
        .on('mouseout', () => {
            d3.select('#tooltip')
                .style('opacity', 0);
        });

    // Create a legend
    const legend = d3.select('#legend')
        .attr('id', 'legend');

    legend.append('div')
        .html('<span style="color:blue;">Blue</span> - No doping allegations');

    legend.append('div')
        .html('<span style="color:red;">Red</span> - Doping allegations');
});
