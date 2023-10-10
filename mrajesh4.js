// Define constants for your data files and initialize variables
const dataPath = 'data/global_development.csv';
const regionsPath = 'data/countries_regions.csv';
let data; // Store your data here
let regions; // Store regions data here
let selectedCountries = ["Canada","Ethiopia","Argentina","Bolivia","Bahamas","Bahrain","Spain"]; // Store selected countries
let selectedYear = 1980; // Initial year
let selectedXAttribute; // Store selected X-axis attribute
let selectedSizeAttribute; // Store selected Size attribute
let isPlaying = false; // Flag for playback
let animationInterval; // Define a variable to track the animation state

// Define your D3 margins and dimensions
const svg = d3.select('#beeswarm-chart')
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = +svg.style('width').replace('px','');               //changing the width and height into integer
const height = +svg.style('height').replace('px','');
const Innerwidth = width - margin.left - margin.right;
const Innerheight = height - margin.top - margin.bottom;

// Create your SVG and append it to the chart container
const main_svg = d3.select('#beeswarm-chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Load data and regions data using d3.csv()
Promise.all([
    d3.csv(dataPath),
    d3.csv(regionsPath)
]).then((loadedData) => {
    data = loadedData[0]; // First element is global development data
    regions = loadedData[1]; // Second element is regions data

    

    data.forEach((d) => {
        for (const key in d) {
            if (key !== "Country") { 
                d[key] = parseFloat(d[key]); 
            }
        }
    });
    const attributesToKeep = [
        "Country",
        "Year",
        "Data.Health.Birth Rate",
        "Data.Health.Death Rate",
        "Data.Health.Fertility Rate",
        "Data.Health.Life Expectancy at Birth, Female",
        "Data.Health.Life Expectancy at Birth, Male",
        "Data.Health.Life Expectancy at Birth, Total",
        "Data.Health.Population Growth",
        "Data.Health.Total Population",
        "Data.Infrastructure.Mobile Cellular Subscriptions",
        "Data.Infrastructure.Telephone Lines"
    ];
    data = data.map((d) => {
        const filteredData = {};
        attributesToKeep.forEach((attr) => {
            filteredData[attr] = d[attr];
        });
        return filteredData;
    });

    data = data.filter((d) => selectedCountries.includes(d.Country));
    regions = regions.filter((d) => selectedCountries.includes(d.name));
    console.debug(data);
    console.debug(regions);
    setupChart();

    
});




// Function to start or pause the animation
function togglePlay() {
    const playButton = document.getElementById('play-button');

    if (isPlaying) {
        clearInterval(animationInterval);
        isPlaying = false;
        playButton.textContent = 'Play'; // Change button text to "Play"
    } else {
        isPlaying = true;
        playButton.textContent = 'Pause'; // Change button text to "Pause"
        // Start the animation
        animationInterval = setInterval(() => {
            // Increase the selectedYear and update the chart
            selectedYear++;
            if (selectedYear > 2013) {
                // Stop the animation when reaching the last year
                clearInterval(animationInterval);
                isPlaying = false;
                playButton.textContent = 'Play'; // Change back to "Play"
            } else {
                // Update the chart for the new selectedYear
                
            }
        }, 1000); // Change the interval as needed (e.g., 1000ms = 1 second)
    }
}



function selectAll() {
    const checkboxes = document.querySelectorAll('#regions-container input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
    });
}

function deselectAll() {
    const checkboxes = document.querySelectorAll('#regions-container input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
}



function setupChart() {
    const selectedXAttribute = document.getElementById('x-axis-select').value;
    const selectedAttributeData = data.map(d => parseFloat(d[selectedXAttribute]));
    const xDomain = d3.extent(selectedAttributeData);
    const xScale = d3.scaleLinear()
        .domain([xDomain])
        .range([0, Innerwidth]);

    const colorScale = d3.scaleOrdinal()
        .domain(selectedCountries) 
        .range(d3.schemeCategory10);

    let tickFormat;
        if (typeof xDomain[0] === 'number') {
            tickFormat = d3.format('.2f');
        } 
    console.log(tickFormat);
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(tickFormat);

    main_svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

    const circles = main_svg.selectAll('.circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('cx', (d) => xScale(parseFloat(d[selectedXAttribute])))
        .attr('cy', /* Set initial Y position (e.g., constant for all) */)
        .attr('r', /* Set initial circle size based on Size attribute */)
        .style('fill', /* Use the color scale for regions */)
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .on('mouseover', /* Implement the function to show tooltip */)
        .on('mouseout', /* Implement the function to hide tooltip */);


    
}

// Function to draw and update the beeswarm chart
function updateChart() {
    // Implement this function to update the chart based on user interactions
    // Update circles' positions and sizes, handle animations, etc.
}

// Function to handle X-axis attribute change
function onXAxisChange() {
    // Implement this function to update the chart when the X-axis attribute changes
    // Update scales, axis labels, and circles' positions
}

// Function to handle Size attribute change
function onSizeChange() {
    // Implement this function to update the chart when the Size attribute changes
    // Update circle sizes and positions
}

// Initialize the chart with default settings
function initializeChart() {
    // Implement this function to set up the initial chart state
    // Create scales, draw axes, and draw circles for the default settings
    // You can call setupChart() here
}

// Add event listeners for user interactions
document.getElementById('x-axis-select').addEventListener('change', onXAxisChange);
document.getElementById('size-select').addEventListener('change', onSizeChange);
document.getElementById('play-button').addEventListener('click', togglePlay);
document.getElementById('select-all').addEventListener('click', selectAll);
document.getElementById('deselect-all').addEventListener('click', deselectAll);




