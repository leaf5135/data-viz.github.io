let table;

let url = 'https://gist.githubusercontent.com/andrewdiep1/34b3b0bca4f61a26bc710bc9b5467008/raw/8e227b241dd4d9e403014ad9047d5917c9897b0a/health-bar.csv';

function preload() {
    // Load the table data
    table = loadTable(url, 'csv', 'header');
}

function setup() {
    // Setup
    createCanvas(1000, 1000);
    numberOfRows = table.getRowCount();
    numberOfColumns = table.getColumnCount();
}

function isMouseOverTooltip(tooltipX, tooltipY, tooltipWidth, tooltipHeight) {
    return mouseX > tooltipX && mouseX < tooltipX + tooltipWidth &&
           mouseY < tooltipY && mouseY > tooltipY + tooltipHeight;
}

function showTooltip(value, number) {
    fill(50);
    rect(mouseX + 10, mouseY + 10, 130, 50);
    fill(200);
    text(value, mouseX + 75, mouseY + 25);
    text(number, mouseX + 75, mouseY + 50);
}

function draw() {
    background(20);
    fill(200);

    // x-y axis
    stroke(200);
    line(250, 700, 650, 700);
    line(250, 100, 250, 700);

    // Labels
    noStroke();
    textAlign(CENTER);
    textSize(30);
    text('Distribution of Diseases in 1968', 500, 50);
    textSize(20);
    text('Number of', 120, 400);
    text('infections', 120, 430);
    textSize(20);
    text('Infection type', 450, 780);

    // Annotations
    textSize(10);
    text('Notice that the number of Measles infections has gotten lower due to the introduction of the Measles vaccine in 1963.', 625, 400);
    text('This is an example of how vaccines can help prevent the spread of diseases.', 625, 415);
    text('Hover over the bars to see the total # of infections', 500, 155);
    stroke(200);
    line(600, 420, 600, 600);
    line(325, 150, 375, 150);
    noStroke();

    // Draw graph
    for (let i = 0; i < numberOfRows; i++) {
        // Infection type
        textSize(15);
        text(table.getString(i, "disease"), i * 100 + 300, 725);

        // Bar
        let num = table.getString(i, "number");
        rect(i * 100 + 280, 700, 40, num*(-1/250));
    }

    // Display tooltip
    for (let i = 0; i < numberOfRows; i++) {
        let num = table.getString(i, "number");
        if (isMouseOverTooltip(i * 100 + 280, 700, 40, num*(-1/250))) {
            showTooltip(table.getString(i, 0), num);
        }
    }

    // y-axis labels
    fill(200);
    let labels = 5;
    let degree = 150000;
    for (let i = 0; i <= labels; i++) {
        stroke(200);
        let y = 100 + (120 * i);
        line(240, y, 250, y);
        noStroke();
        text(degree - (i * 30000), 200, y);
    }

}