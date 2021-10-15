/* -------  Helper Funcitons  ------- */

// Convert 
function HSBtoRGB(h, s, b){
    s /= 100;
    b /= 100;
    let k = (n) => (n + h / 60) % 6;
    let f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    // return [Math.round(255 * f(5)), Math.round(255 * f(3)), Math.round(255 * f(1))];
    return {
        r: Math.round(255 * f(5)),
        g: Math.round(255 * f(3)),
        b: Math.round(255 * f(1))
    }
};

// Return a random floating point number within a range
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Find an element by id an set it's background color using HSB
function setElementToHSBColor(elementId, HSBColor) {
    let el = document.getElementById(elementId);
    let rgb =  HSBtoRGB(HSBColor.h, HSBColor.s, HSBColor.b);
    el.style.backgroundColor = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
}


/* -------  Constants & Data Objects  ------- */

// Initial Parameters
const HUE_MIN = 0;
const HUE_MAX = 360;
const HUE_ROTATION_MIN = 30;
const HUE_ROTATION_MAX = 60;

const SATURATION_MIN = 20;
const SATURATION_MAX = 90;

const BRIGHTNESS_MIN = 60;
const BRIGHTNESS_MAX = 70;

const PALETTES_TO_GENERATE = 42;

let settings = {}

/* -------  Main Functions  ------- */

// Connect up the interface
function initializeUI() {
    // Set initial values
    document.getElementById('hue-min').value = HUE_MIN;
    document.getElementById('hue-max').value = HUE_MAX;
    document.getElementById('hue-rot-min').value = HUE_ROTATION_MIN;
    document.getElementById('hue-rot-max').value = HUE_ROTATION_MAX;
    document.getElementById('sat-min').value = SATURATION_MIN;
    document.getElementById('sat-max').value = SATURATION_MAX;
    document.getElementById('bri-min').value = BRIGHTNESS_MIN;
    document.getElementById('bri-max').value = BRIGHTNESS_MAX;

    // Hookup the event listeners
    let inputs = document.querySelectorAll('#settings input');
    inputs.forEach(input => {
        // store the settings object value
        settings[input.id] = parseInt(input.value);
        // update the value label
        document.getElementById(input.id + "-value").innerHTML = input.value;;
        input.addEventListener('input', handleUIEvents);
    });
}

function handleUIEvents(event) {
    // Same as above but finding the element in the event object
    settings[event.target.id] = parseInt(event.target.value);
    document.getElementById(event.target.id + "-value").innerHTML = event.target.value;;
    // Re-generate the pallet
    // generatePalette();
    generateManyPalettes()
}

// Must do after the declaration of handleUIEvents
initializeUI();

// Generate a pallet
function generatePalette() {
    let colorHSB0 = {},
        colorHSB1 = {},
        colorHSB2 = {},
        colorHSB3 = {},
        colorHSB4 = {};

    // Generate random values for the first color of each
    colorHSB0.h = randomInRange(settings['hue-min'], settings['hue-max']);
    colorHSB0.s = randomInRange(settings['sat-min'], settings['sat-max']);
    colorHSB0.b = randomInRange(settings['bri-min'], settings['bri-max']);
    setElementToHSBColor('color0', colorHSB0); 
    
    // Take the same hue value and rotate out by the same value
    let hueRotaion = randomInRange(settings['hue-rot-min'], settings['hue-rot-max']);
    
    // Color 1 hue is + 1 x rotation
    colorHSB1 = {... colorHSB0};
    colorHSB1.h = (colorHSB1.h + hueRotaion) % HUE_MAX;
    setElementToHSBColor('color1', colorHSB1); 

    // Color 2 hue is - 1 x rotation
    colorHSB2 = {... colorHSB0};
    colorHSB2.h = (colorHSB2.h + HUE_MAX - hueRotaion) % HUE_MAX;
    setElementToHSBColor('color2', colorHSB2); 

    // Color 3 hue is + 2 x rotation
    colorHSB3 = {... colorHSB0};
    colorHSB3.h = (colorHSB3.h + 2*hueRotaion) % HUE_MAX;
    setElementToHSBColor('color3', colorHSB3); 

    // Color 4 hue is - 2 x rotation
    colorHSB4 = {... colorHSB0};
    colorHSB4.h = (colorHSB4.h + HUE_MAX - 2 * hueRotaion) % HUE_MAX;
    setElementToHSBColor('color4', colorHSB4); 

    return [{... colorHSB0}, {... colorHSB1}, {... colorHSB2}, {... colorHSB3}, {... colorHSB4}];
}


function generateManyPalettes() {
    // This is were we'll inject many colors
    let container = document.getElementById('many-colors');
    // Clear out the container
    container.innerHTML = '';

    // Loop through creating many palettes
    for(i = 0; i < PALETTES_TO_GENERATE; i++) {
        let palette = generatePalette();
        let orderedPalette = [
            palette[3], palette[1], palette[0], palette[2], palette[4]
        ];
        orderedPalette.forEach(el => {
            let rgb = HSBtoRGB(el.h, el.s, el.b);
            container.innerHTML += "<div style='background-color: rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")'></div>";
        });
        if (i % 3 == 2) {
            container.innerHTML += "<br/>"
        } else {
            container.innerHTML += " <div class='spacer'></div><div class='spacer'></div> "
        }
    }
}

generateManyPalettes();