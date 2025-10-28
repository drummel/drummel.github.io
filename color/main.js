/* -------  Helper Funcitons  ------- */

// Convert Hue Saturation Brightnes to Red Green Blue
function HSBtoRGB(h, s, b){
    s /= 100;
    b /= 100;
    let k = (n) => (n + h / 60) % 6;
    let f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return {
        r: Math.round(255 * f(5)),
        g: Math.round(255 * f(3)),
        b: Math.round(255 * f(1))
    }
};

// Return a random floating point number within a range
function randomInRange(min, max, round = false) {
    if (round) {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    } else {
        return Math.random() * (max - min) + min;
    }
}

// Find an element by id an set it's background color using HSB
function setElementToHSBColor(elementId, HSBColor) {
    let el = document.getElementById(elementId);
    let rgb =  HSBtoRGB(HSBColor.h, HSBColor.s, HSBColor.b);
    el.style.backgroundColor = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
}


/* -------  Constants & Data Objects  ------- */

const settingsKeys = ['hue-min','hue-max','sat-min','sat-max','bri-min','bri-max','hue-rot-min','hue-rot-max'];

// Initial Parameters
const HUE_MIN = 0;
const HUE_MAX = 360;
const HUE_ROTATION_MIN = 10;
const HUE_ROTATION_MAX = 60;

const SATURATION_MIN = 70;
const SATURATION_MAX = 90;

const BRIGHTNESS_MIN = 60;
const BRIGHTNESS_MAX = 100;

const PALETTES_TO_GENERATE = 42;

// This is where we'll store the settings for the sliders
let settings = {}

/* -------  UI Setup and Control Functions  ------- */

// Connect up the HTML interface elements to JS events and data
function initializeUI() {
    // Grab any query parameters and store in the settings file 
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);    
    settingsKeys.forEach(function(key) {
        if (urlParams.has(key)) {
            settings[key] = urlParams.get(key);
        }
    })
    
    // Set initial values from the settings or 
    document.getElementById('hue-min').value = settings['hue-min'] || HUE_MIN;
    document.getElementById('hue-max').value = settings['hue-max'] || HUE_MAX;
    document.getElementById('hue-rot-min').value = settings['hue-rot-min'] || HUE_ROTATION_MIN;
    document.getElementById('hue-rot-max').value = settings['hue-rot-max'] || HUE_ROTATION_MAX;
    document.getElementById('sat-min').value = settings['sat-min'] || SATURATION_MIN;
    document.getElementById('sat-max').value = settings['sat-max'] || SATURATION_MAX;
    document.getElementById('bri-min').value = settings['bri-min'] || BRIGHTNESS_MIN;
    document.getElementById('bri-max').value = settings['bri-max'] || BRIGHTNESS_MAX;

    // Create the settings object from the input values.
    // Then hookup the event listeners
    let inputs = document.querySelectorAll('#settings input');
    inputs.forEach(input => {
        // store the settings object value
        settings[input.id] = parseInt(input.value);
        // update the value label
        document.getElementById(input.id + "-value").innerHTML = input.value;;
        // Wire up the 'input' event from the sliders to the handler funciotn
        input.addEventListener('input', handleUIEvents);
    });

    // Setup the brush images
    let brushes = document.querySelectorAll('.brush');
    brushes.forEach(brush => {
        brush.addEventListener('click', function() {
            paintCanvas(brush.src);
        })
    });
}

// Update the URL Parameters to save the motif
function updateURLParams() {
    searchParams = new URLSearchParams(settings);
    // window.location.search = searchParams.toString();
    let pathAndParams = window.location.pathname + '?' + searchParams.toString();
    history.pushState(null, '', pathAndParams);    
}

let urlUpdateTimeout = null;

// This function is called, with the 'event' object, when the input sliders are changed
function handleUIEvents(event) {
    // Same as above but finding the element in the event object
    settings[event.target.id] = parseInt(event.target.value);
    document.getElementById(event.target.id + "-value").innerHTML = event.target.value;;
    // Re-generate the motif
    generateManyPalettes();
    if (urlUpdateTimeout != null) delete(urlUpdateTimeout);
    urlUpdateTimeout = setTimeout(updateURLParams, 100);
}

// Note: Must do this after the declaration of handleUIEvents is complete to initializeUI can use it
initializeUI();

/* -------  Generator Functions  ------- */

// This is the main generate pallet funciton
function generatePalette() {

    /// These are objects to store HSB colors for the 5 colors in the palatte
    let colorHSB0 = {},
        colorHSB1 = {},
        colorHSB2 = {},
        colorHSB3 = {},
        colorHSB4 = {};

    // Generate random HSB values for the "core" color
    colorHSB0.h = randomInRange(settings['hue-min'], settings['hue-max']);
    colorHSB0.s = randomInRange(settings['sat-min'], settings['sat-max']);
    colorHSB0.b = randomInRange(settings['bri-min'], settings['bri-max']);

    // Set the element backgroudn color
    setElementToHSBColor('color0', colorHSB0); 
    
    // Take the same hue value and rotate out by the same value
    let hueRotaion = randomInRange(settings['hue-rot-min'], settings['hue-rot-max']);
    
    // Color 1 hue is +1x rotation
    colorHSB1 = {... colorHSB0};
    colorHSB1.h = (colorHSB1.h + hueRotaion) % HUE_MAX;
    setElementToHSBColor('color1', colorHSB1); 

    // Color 2 hue is -1x rotation
    colorHSB2 = {... colorHSB0};
    colorHSB2.h = (colorHSB2.h + HUE_MAX - hueRotaion) % HUE_MAX;
    setElementToHSBColor('color2', colorHSB2); 

    // Color 3 hue is +2x rotation
    colorHSB3 = {... colorHSB0};
    colorHSB3.h = (colorHSB3.h + 2 * hueRotaion) % HUE_MAX;
    setElementToHSBColor('color3', colorHSB3); 

    // Color 4 hue is -2x rotation
    colorHSB4 = {... colorHSB0};
    colorHSB4.h = (colorHSB4.h + HUE_MAX - 2 * hueRotaion) % HUE_MAX;
    setElementToHSBColor('color4', colorHSB4); 

    // Send back an arry of "cloned" objects
    // (see: https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/)
    return [{... colorHSB0}, {... colorHSB1}, {... colorHSB2}, {... colorHSB3}, {... colorHSB4}];
}


// This function loops through generating a bunch of color pallets drawing them
function generateManyPalettes() {
    // This is where we'll inject many colors
    let container = document.getElementById('many-colors');

    // Clear out the container first to get rid of HTML from past runs
    container.innerHTML = '';

    // Loop through creating many palettes
    for(i = 0; i < PALETTES_TO_GENERATE; i++) {
        // Gen a new palette
        let palette = generatePalette();
        
        // I wanted to maintain "core" in the middle, "inner" and outer rendering
        // ... sooo... I reordered the array before drawing
        let reorderedPalette = [
            palette[3], palette[1], palette[0], palette[2], palette[4]
        ];

        // Loop through the 5 colors in the reordered palette
        reorderedPalette.forEach(el => {
            let rgb = HSBtoRGB(el.h, el.s, el.b);
            // create html for this color, set the background color inline
            container.innerHTML += "<div style='background-color: rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")'></div>";
        });

        // This is some modulus/remainder trickery to add a line break every 3 palettes
        // ... or add the 2 empty spacer blocks
        // (see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder)
        if (i % 3 == 2) {
            container.innerHTML += "<br/>"
        } else {
            container.innerHTML += " <div class='spacer'></div><div class='spacer'></div> "
        }
    }
}

// Finally ... generate all the colors!
generateManyPalettes();

// Paint over the whole screen
function paintCanvas(brushSrc = 'circle.png') {
    let brush = new Image();
    brush.src = brushSrc;

    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let halfBrushW = null;
    let halfBrushH = null;

    brush.addEventListener('load', function() {

        halfBrushW = brush.width/2;
        halfBrushH = brush.height/2;

        let coord = { x:0, y:0 };
        let palette = null;

        while (coord.y < canvas.height) {
            coord.x = -1 * brush.width;
            if (palette == null || Math.random() < .3) {
                // Get a new palate
                palette = generatePalette();
            }
            while (coord.x < canvas.width + halfBrushW) {
                if (palette == null || Math.random() < .1) {
                    // Get a new palate
                    palette = generatePalette();
                }
                let randomIndex = Math.floor(randomInRange(0,4, true));
                let colorHSB = palette[randomIndex];
                let colorRGB = HSBtoRGB(colorHSB.h, colorHSB.s, colorHSB.b);
                let newBrush = recolorBlackImage(brush, colorRGB.r, colorRGB.g, colorRGB.b); 
                let c = {... coord}
                let spread = canvas.height / c.y * .3;
                newBrush.addEventListener('load', function() {
                    let scale = randomInRange(0.1, 2.0) / spread;
                    c.w = newBrush.width * scale;
                    c.h = newBrush.height * scale;
                    context.drawImage(newBrush, c.x, c.y, c.w, c.h);
                });

                // set new coord for the next round
                coord.x = coord.x + halfBrushW * randomInRange(-0.2, 1) + spread;
                coord.y = coord.y + halfBrushH * randomInRange(-0.5, 0.5);
            }
            coord.y += halfBrushH;
        }
        let bgColor = HSBtoRGB(palette[0].h, palette[0].s * 0.2, Math.min(100, palette[0].b * 2));
        console.log("rgb(" + bgColor.r + "," + bgColor.g + "," + bgColor.b + ")");
        canvas.style.backgroundColor = "rgb(" + bgColor.r + "," + bgColor.g + "," + bgColor.b + ")";
    });
}

function recolorBlackImage(img, newRed, newGreen, newBlue) {
    // Create a temporary canvas
    var tempCanvas = document.createElement('canvas');
    // document.body.append(c);
    var ctx = tempCanvas.getContext("2d");
    var w = img.width;
    var h = img.height;
    tempCanvas.width = w;
    tempCanvas.height = h;

    // Add a contour with the new color
    drawContour(tempCanvas, img, newRed, newGreen, newBlue);

    // draw the image on the temporary canvas
    ctx.drawImage(img, 0, 0, w, h);
    // pull the entire image into an array of pixel data
    var imageData = ctx.getImageData(0, 0, w, h);

    // examine every pixel, change any black pixels to the new-rgb
    for (var i = 0; i < imageData.data.length; i += 4) {
        // is this pixel black (or very dark)?
        if (imageData.data[i] < 50 && imageData.data[i + 1] < 50 && imageData.data[i + 2] < 50) {
            // change to your new rgb
            imageData.data[i] = newRed;
            imageData.data[i + 1] = newGreen;
            imageData.data[i + 2] = newBlue;
        }
    }
    // put the altered data back on the canvas  
    ctx.putImageData(imageData, 0, 0);

    // put the re-colored image back on the image
    // var img1 = document.getElementById("image1");
    alteredImg = new Image()
    alteredImg.src = tempCanvas.toDataURL('image/png');
    return alteredImg;
}

function drawContour(localCanvas, img, newRed, newGreen, newBlue) {
    var ctx = localCanvas.getContext('2d');

    var dArr = [-1,-1, 0,-1, 1,-1, -1,0, 1,0, -1,1, 0,1, 1,1], // offset array
        s = 6,  // thickness scale
        i = 0,  // iterator
        x = 5,  // final position
        y = 5;
    
    // draw images at offsets from the array scaled by s
    for(; i < dArr.length; i += 2)
      ctx.drawImage(img, x + dArr[i]*s, y + dArr[i+1]*s);
    
    // fill with the generated color
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = "rgb(" + newRed + "," + newGreen + "," + newBlue + ")";
    ctx.fillRect(0,0,localCanvas.width, localCanvas.height);

}