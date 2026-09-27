/* ===========================
   CONTACT POPUP
=========================== */

function toggleContact(){

    const contact = document.getElementById("contactBox");
    const feedback = document.getElementById("feedbackBox");

    feedback.style.display = "none";

    if(contact.style.display === "block"){
        contact.style.display = "none";
    }
    else{
        contact.style.display = "block";
    }
}


/* ===========================
   FEEDBACK POPUP
=========================== */

function toggleFeedback(){

    const contact = document.getElementById("contactBox");
    const feedback = document.getElementById("feedbackBox");

    contact.style.display = "none";

    if(feedback.style.display === "block"){
        feedback.style.display = "none";
    }
    else{
        feedback.style.display = "block";
    }
}


/* ===========================
   CLOSE POPUPS WHEN CLICKING OUTSIDE
=========================== */

document.addEventListener("click", function(event){

    const contact = document.getElementById("contactBox");
    const feedback = document.getElementById("feedbackBox");

    if(
        !event.target.closest(".contact-menu") &&
        !event.target.closest(".feedback-menu")
    ){
        contact.style.display = "none";
        feedback.style.display = "none";
    }

});


/* ===========================
   HAMBURGER MENU
=========================== */

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {

    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");

});

/* ===========================
   MATERIAL DATABASE
=========================== */

const materials = {

    steel: {
        name: "Steel",
        E: 200,
        yieldStrength: 300,
        density: 7850
    },

    iron: {
        name: "Iron",
        E: 210,
        yieldStrength: 100,
        density: 7874
    },

    aluminium: {
        name: "Aluminium",
        E: 69,
        yieldStrength: 30 ,
        density: 2700
    },

    copper: {
        name: "Copper",
        E: 120,
        yieldStrength: 80,
        density: 2700
    }

};

function updateMaterial() {

    const materialSelect = document.getElementById("material");
    const selectedMaterial = materials[materialSelect.value];

    const youngsModulus = document.getElementById("youngsModulus");
    const yieldStrength = document.getElementById("yieldStrength");

    // CUSTOM MATERIAL
    if (materialSelect.value === "custom") {

        youngsModulus.value = "";
        yieldStrength.value = "";

        return;
    }

    // PREDEFINED MATERIAL
    youngsModulus.value = selectedMaterial.E;
    yieldStrength.value = selectedMaterial.yieldStrength;
}


function updateSectionFields() {

    const sectionType = document.getElementById("sectionType").value;

    const inputs = document.getElementById("sectionInputs");
    const figure = document.getElementById("sectionFigure");

    // Clear previous content
    inputs.innerHTML = "";
    figure.innerHTML = "";


    // SOLID RECTANGLE
    if (sectionType === "solidRectangle") {

        figure.innerHTML = `
            <img src="images/solid-rectangle.png"
                alt="Solid Rectangle"
                class="section-image">
        `;

        inputs.innerHTML = `
            <div class="input-group">
                <label>Height (a) (mm)</label>
                <input type="number"
                    id="srHeight"
                    min="0">
            </div>

            <div class="input-group">
                <label>Width (b) (mm)</label>
                <input type="number"
                    id="srWidth"
                    min="0">
            </div>
        `;

        // Recalculate whenever either dimension changes
        document.getElementById("srHeight").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("srWidth").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );
    }


    // SOLID CIRCLE
    else if (sectionType === "solidCircle") {

        figure.innerHTML = `
            <img src="images/solid-circle.png"
                alt="Solid Circle"
                class="section-image">
        `;

        inputs.innerHTML = `
            <div class="input-group">
                <label>Diameter (a) (mm)</label>
                <input type="number"
                    id="scDiameter"
                    min="0">
            </div>
        `;

        document.getElementById("scDiameter").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );
    }

    // HOLLOW CIRCLE
    else if (sectionType === "hollowCircle") {

        figure.innerHTML = `
            <img src="images/hollow-circle.png"
                alt="Hollow Circle"
                class="section-image">
        `;

        inputs.innerHTML = `
            <div class="input-group">
                <label>Outer Diameter (a) (mm)</label>
                <input type="number"
                    id="hcOuterDiameter"
                    min="0">
            </div>

            <div class="input-group">
                <label>Inner Diameter (b) (mm)</label>
                <input type="number"
                    id="hcInnerDiameter"
                    min="0">
            </div>
        `;

        document.getElementById("hcOuterDiameter").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("hcInnerDiameter").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );
    }


    // HOLLOW RECTANGLE
    else if (sectionType === "hollowRectangle") {

        figure.innerHTML = `
            <img src="images/hollow-rectangle.png"
                alt="Hollow Rectangle"
                class="section-image">
        `;

        inputs.innerHTML = `
            <div class="input-group">
                <label>Overall Height (a) (mm)</label>
                <input type="number"
                    id="hOuterHeight"
                    min="0">
            </div>

            <div class="input-group">
                <label>Overall Width (b) (mm)</label>
                <input type="number"
                    id="hOuterWidth"
                    min="0">
            </div>

            <div class="input-group">
                <label>Inner Height (c) (mm)</label>
                <input type="number"
                    id="hInnerHeight"
                    min="0">
            </div>

            <div class="input-group">
                <label>Inner Width (d) (mm)</label>
                <input type="number"
                    id="hInnerWidth"
                    min="0">
            </div>
        `;

        document.getElementById("hOuterHeight").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("hOuterWidth").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("hInnerHeight").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("hInnerWidth").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );
    }


    // I-SECTION
   else if (sectionType === "iSection") {

        figure.innerHTML = `
            <img src="images/i-section.png"
                alt="I-Section"
                class="section-image">
        `;

        inputs.innerHTML = `
            <div class="input-group">
                <label>Bottom Flange Thickness (a) (mm)</label>
                <input type="number"
                    id="iBottomThickness"
                    min="0">
            </div>

            <div class="input-group">
                <label>Bottom Flange Width (b) (mm)</label>
                <input type="number"
                    id="iBottomWidth"
                    min="0">
            </div>

            <div class="input-group">
                <label>Clear Web Height (c) (mm)</label>
                <input type="number"
                    id="iWebHeight"
                    min="0">
            </div>

            <div class="input-group">
                <label>Web Thickness (d) (mm)</label>
                <input type="number"
                    id="iWebThickness"
                    min="0">
            </div>

            <div class="input-group">
                <label>Top Flange Thickness (e) (mm)</label>
                <input type="number"
                    id="iTopThickness"
                    min="0">
            </div>

            <div class="input-group">
                <label>Top Flange Width (f) (mm)</label>
                <input type="number"
                    id="iTopWidth"
                    min="0">
            </div>
        `;

        document.getElementById("iBottomThickness").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("iBottomWidth").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("iWebHeight").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("iWebThickness").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("iTopThickness").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("iTopWidth").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );
    }

    // T-SECTION
    else if (sectionType === "tSection") {

        figure.innerHTML = `
            <img src="images/t-section.png"
                alt="T-Section"
                class="section-image">
        `;

        inputs.innerHTML = `
            <div class="input-group">
                <label>Web Thickness (a) (mm)</label>
                <input type="number"
                    id="tWebThickness"
                    min="0">
            </div>

            <div class="input-group">
                <label>Web Height (b) (mm)</label>
                <input type="number"
                    id="tWebHeight"
                    min="0">
            </div>

            <div class="input-group">
                <label>Flange Thickness (c) (mm)</label>
                <input type="number"
                    id="tFlangeThickness"
                    min="0">
            </div>

            <div class="input-group">
                <label>Flange Width (d) (mm)</label>
                <input type="number"
                    id="tFlangeWidth"
                    min="0">
            </div>
        `;

        document.getElementById("tWebThickness").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("tWebHeight").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("tFlangeThickness").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("tFlangeWidth").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );
    }

    // C-SECTION
    else if (sectionType === "cSection") {

        figure.innerHTML = `
            <img src="images/c-section.png"
                alt="C-Section"
                class="section-image">
        `;

        inputs.innerHTML = `
            <div class="input-group">
                <label>Bottom Flange Width (a) (mm)</label>
                <input type="number"
                    id="cWidth"
                    min="0">
            </div>

            <div class="input-group">
                <label>Bottom Flange Thickness (b) (mm)</label>
                <input type="number"
                    id="cBottomThickness"
                    min="0">
            </div>

            <div class="input-group">
                <label>Overall Height (c) (mm)</label>
                <input type="number"
                    id="cHeight"
                    min="0">
            </div>

            <div class="input-group">
                <label>Web Thickness (d) (mm)</label>
                <input type="number"
                    id="cWebThickness"
                    min="0">
            </div>

            <div class="input-group">
                <label>Top Flange Thickness (e) (mm)</label>
                <input type="number"
                    id="cTopThickness"
                    min="0">
            </div>

            <div class="input-group">
                <label>Top Flange Width (f) (mm)</label>
                <input type="number"
                    id="cTopWidth"
                    min="0">
            </div>
        `;

        // Recalculate MOA whenever an input changes
        document.getElementById("cWidth").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("cBottomThickness").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("cHeight").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("cWebThickness").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("cTopThickness").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );

        document.getElementById("cTopWidth").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );
    }


    // CUSTOM
    else if (sectionType === "custom") {

        figure.innerHTML = "";

        inputs.innerHTML = `
            <div class="input-group">
                <label for="customInertia">
                    Second Moment of Area (I) (mm⁴)
                </label>

                <input type="number"
                    id="customInertia"
                    min="0"
                    step="1">
            </div>
        `;

        document.getElementById("customInertia").addEventListener(
            "input",
            calculateSecondMomentOfArea
        );
    }
}


document.addEventListener("DOMContentLoaded", function () {

    updateSectionFields();

});

/* ===========================
   LOAD ACCORDION
   =========================== */

function toggleLoad(button) {

    const loadItem =
        button.closest(".load-item");

    loadItem.classList.toggle("active");

}


/* ===========================
   ADD NEW LOAD
   =========================== */

let loadCount = 1;

function addLoad() {

    loadCount++;

    const loadsContainer =
        document.getElementById("loadsContainer");

    const loadNumber =
        loadsContainer.querySelectorAll(".load-item").length + 1;

    const loadItem =
    document.createElement("div");

    loadItem.className = "load-item";

    loadItem.innerHTML = `

        <div class="load-header">

            <button
                type="button"
                class="load-toggle"
                onclick="toggleLoad(this)"
            >

                <span>Load ${loadNumber}</span>

                <span class="load-arrow">▼</span>

            </button>


            <button
                type="button"
                class="delete-load"
                onclick="deleteLoad(this)"
                title="Delete Load"
            >
                ×
            </button>

        </div>


        <div class="load-content">

            <div class="input-group">

                <label>
                    Load Type
                </label>

                <select
                    class="load-type"
                    onchange="updateLoadFields(this)"
                >

                    <option value="point">
                        Point Load
                    </option>

                    <option value="udl">
                        Uniformly Distributed Load
                    </option>

                    <option value="moment">
                        Applied Moment
                    </option>

                </select>

            </div>


            <div class="load-parameters">

            </div>

        </div>

    `;

    loadsContainer.appendChild(loadItem);


    /* Initialize as Point Load */

    const newLoadType =
        loadItem.querySelector(".load-type");

    updateLoadFields(newLoadType);

    updateBeamVisualization();

}

/* ===========================
   DELETE LOAD
   =========================== */

function deleteLoad(button) {
    const loadItem = button.closest(".load-item");

    if (loadItem) {
        loadItem.remove();
        renumberLoads();

        // Update beam diagram after deleting the load
        updateBeamVisualization();
    }
}

/* ===========================
   RENUMBER LOADS
   =========================== */

function renumberLoads() {

    const loads =
        document.querySelectorAll(
            "#loadsContainer .load-item"
        );

    loads.forEach((load, index) => {

        const loadNumber = index + 1;

        const loadName =
            load.querySelector(".load-toggle span:first-child");

        if (loadName) {
            loadName.textContent =
                `Load ${loadNumber}`;
        }

    });

}


/* ===========================
   LOAD PARAMETERS
   =========================== */

function updateLoadFields(select) {

    const loadItem = select.closest(".load-item");

    const parameters =
        loadItem.querySelector(".load-parameters");

    const loadType = select.value;


    /* ===========================
       POINT LOAD
       =========================== */

    if (loadType === "point") {

        parameters.innerHTML = `

            <div class="input-group">

                <label>
                    Load Magnitude (N)
                </label>

                <input
                    type="number"
                    class="load-value"
                    min="0"
                    step="1"
                >

            </div>


            <div class="input-group">

                <label>
                    Position from Left (m)
                </label>

                <input
                    type="number"
                    class="load-position"
                    min="0"
                    step="0.1"
                >

            </div>

        `;
    }


    /* ===========================
       UNIFORMLY DISTRIBUTED LOAD
       =========================== */

    else if (loadType === "udl") {

        parameters.innerHTML = `

            <div class="input-group">

                <label>
                    Load Magnitude (N/m)
                </label>

                <input
                    type="number"
                    class="load-value"
                    min="0"
                    step="1"
                >

            </div>


            <div class="input-group">

                <label>
                    Between the points :
                </label>

                <label>
                    X (m) from Left 
                </label>

                <input
                    type="number"
                    class="load-start"
                    min="0"
                    step="0.1"
                >

            </div>


            <div class="input-group">

                <label>
                    Y (m) from Left 
                </label>

                <input
                    type="number"
                    class="load-end"
                    min="0"
                    step="0.1"
                >

            </div>

        `;
    }


    /* ===========================
       APPLIED MOMENT
       =========================== */

    else if (loadType === "moment") {

        parameters.innerHTML = `

            <div class="input-group">

                <label>
                    Moment (N·m)
                </label>

                <input
                    type="number"
                    class="load-moment"
                    step="1"
                >

            </div>


            <div class="input-group">

                <label>
                    Position from Left (m)
                </label>

                <input
                    type="number"
                    class="load-position"
                    min="0"
                    step="0.1"
                >

            </div>


            <div class="input-group">

                <label>
                    Direction
                </label>

                <select class="moment-direction">

                    <option value="clockwise">
                        Clockwise ↻
                    </option>

                    <option value="counterclockwise">
                        Counterclockwise ↺
                    </option>

                </select>

            </div>

        `;
    }

}
function createSvgElement(type, attributes = {}) {

    const element = document.createElementNS(
        "http://www.w3.org/2000/svg",
        type
    );

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    return element;
}


/* ===========================
   SUPPORT REACTION CALCULATION
=========================== */

function calculateSupportReactions() {

    const beamType =
        document.getElementById("beamType")?.value;

    const beamLength =
        parseFloat(
            document.getElementById("beamLength")?.value
        );

    if (
        !isFinite(beamLength) ||
        beamLength <= 0
    ) {
        return null;
    }


    let totalVerticalLoad = 0;

    /*
     * Positive = counterclockwise
     * Negative = clockwise
     */
    let totalAppliedMoment = 0;

    /*
     * Moment of all downward loads
     * about the left support.
     */
    let totalLoadMoment = 0;


    const loads =
        document.querySelectorAll(
            "#loadsContainer .load-item"
        );


    loads.forEach(loadItem => {

        const loadType =
            loadItem
                .querySelector(".load-type")
                ?.value;


        // =====================================
        // POINT LOAD
        // =====================================

        if (loadType === "point") {

            const magnitude =
                parseFloat(
                    loadItem
                        .querySelector(".load-value")
                        ?.value
                );

            const position =
                parseFloat(
                    loadItem
                        .querySelector(".load-position")
                        ?.value
                );


            if (
                !isFinite(magnitude) ||
                magnitude <= 0 ||
                !isFinite(position) ||
                position < 0 ||
                position > beamLength
            ) {
                return;
            }


            totalVerticalLoad +=
                magnitude;


            totalLoadMoment +=
                magnitude *
                position;
        }


        // =====================================
        // UDL
        // =====================================

        else if (loadType === "udl") {

            const magnitude =
                parseFloat(
                    loadItem
                        .querySelector(".load-value")
                        ?.value
                );

            const start =
                parseFloat(
                    loadItem
                        .querySelector(".load-start")
                        ?.value
                );

            const end =
                parseFloat(
                    loadItem
                        .querySelector(".load-end")
                        ?.value
                );


            if (
                !isFinite(magnitude) ||
                magnitude <= 0 ||
                !isFinite(start) ||
                !isFinite(end) ||
                start < 0 ||
                end > beamLength ||
                start >= end
            ) {
                return;
            }


            const length =
                end - start;


            const resultant =
                magnitude *
                length;


            const centroid =
                start +
                length / 2;


            totalVerticalLoad +=
                resultant;


            totalLoadMoment +=
                resultant *
                centroid;
        }


        // =====================================
        // APPLIED MOMENT
        // =====================================

        else if (loadType === "moment") {

            const magnitude =
                parseFloat(
                    loadItem
                        .querySelector(".load-moment")
                        ?.value
                );

            const direction =
                loadItem
                    .querySelector(
                        ".moment-direction"
                    )
                    ?.value;


            if (
                !isFinite(magnitude) ||
                magnitude < 0
            ) {
                return;
            }


            /*
             * YOUR SIGN CONVENTION:
             *
             * Counterclockwise = +
             * Clockwise       = -
             */

            if (
                direction ===
                "counterclockwise"
            ) {

                totalAppliedMoment +=
                    magnitude;

            }
            else if (
                direction ===
                "clockwise"
            ) {

                totalAppliedMoment -=
                    magnitude;
            }
        }
    });


    // =========================================
    // CANTILEVER
    // =========================================

    if (
        beamType === "cantilever"
    ) {

        /*
         * Vertical reaction.
         */
        const RA =
            totalVerticalLoad;


        /*
         * Fixed-end reaction moment.
         *
         * Positive = counterclockwise
         * Negative = clockwise
         *
         * Downward loads create clockwise
         * moments about the fixed end.
         */

        const MA =
            totalLoadMoment -
            totalAppliedMoment;


        return {
            RA: RA,
            RB: null,
            MA: MA
        };
    }


    // =========================================
    // SIMPLY SUPPORTED
    // =========================================

    if (
        beamType ===
        "simply-supported"
    ) {

        /*
         * Moment equilibrium about A:
         *
         * RB*L
         * - load moments
         * + applied CCW moments
         * - applied CW moments
         * = 0
         *
         * Therefore:
         *
         * RB*L =
         * load moments
         * - applied CCW
         * + applied CW
         */

        const RB =
            (
                totalLoadMoment -
                totalAppliedMoment
            ) /
            beamLength;


        const RA =
            totalVerticalLoad -
            RB;


        return {
            RA: RA,
            RB: RB,
            MA: 0
        };
    }


    return null;
}

function drawImportantPointDimensions(svg, beamStart, beamEnd, beamY, beamLength) {

    if (!isFinite(beamLength) || beamLength <= 0) {
        return;
    }

    const loads = document.querySelectorAll(
        "#loadsContainer .load-item"
    );

    const importantPoints = [];

    // Collect important points from loads
    loads.forEach((loadItem) => {

        const loadType =
            loadItem.querySelector(".load-type")?.value;

        if (loadType === "point") {

            const position = parseFloat(
                loadItem.querySelector(".load-position")?.value
            );

            if (
                isFinite(position) &&
                position >= 0 &&
                position <= beamLength
            ) {
                importantPoints.push({
                    position: position,
                    label: `${position} m`
                });
            }
        }

        else if (loadType === "moment") {

            const position = parseFloat(
                loadItem.querySelector(".load-position")?.value
            );

            if (
                isFinite(position) &&
                position >= 0 &&
                position <= beamLength
            ) {
                importantPoints.push({
                    position: position,
                    label: `${position} m`
                });
            }
        }

        else if (loadType === "udl") {

            const start = parseFloat(
                loadItem.querySelector(".load-start")?.value
            );

            const end = parseFloat(
                loadItem.querySelector(".load-end")?.value
            );

            if (
                isFinite(start) &&
                isFinite(end) &&
                start >= 0 &&
                end <= beamLength &&
                start < end
            ) {

                const centre = (start + end) / 2;

                importantPoints.push({
                    position: start,
                    label: `${start} m`
                });

                importantPoints.push({
                    position: centre,
                    label: `${centre} m`
                });

                importantPoints.push({
                    position: end,
                    label: `${end} m`
                });
            }
        }
    });

    // Sort from left to right
    importantPoints.sort(
        (a, b) => a.position - b.position
    );

    // Remove duplicate positions
    const uniquePoints = [];

    importantPoints.forEach((point) => {

        const alreadyExists = uniquePoints.some(
            existing =>
                Math.abs(existing.position - point.position) < 0.0001
        );

        if (!alreadyExists) {
            uniquePoints.push(point);
        }
    });

    /*
        Dimension line
    */

    const dimensionY = beamY + 100;

    const dimensionLine = createSvgElement("line", {
        x1: beamStart,
        y1: dimensionY,
        x2: beamEnd,
        y2: dimensionY,
        stroke: "#012043",
        "stroke-width": 1.5
    });

    svg.appendChild(dimensionLine);

    // Vertical end markers for the beam-length dimension
    const leftDimensionEnd = createSvgElement("line", {
        x1: beamStart,
        y1: dimensionY - 10,
        x2: beamStart,
        y2: dimensionY + 10,
        stroke: "#012043",
        "stroke-width": 1.5
    });

    const rightDimensionEnd = createSvgElement("line", {
        x1: beamEnd,
        y1: dimensionY - 10,
        x2: beamEnd,
        y2: dimensionY + 10,
        stroke: "#012043",
        "stroke-width": 1.5
    });

    svg.appendChild(leftDimensionEnd);
    svg.appendChild(rightDimensionEnd);

    /*
        Points + labels + dotted projection lines
    */

    uniquePoints.forEach((point) => {

        const x =
            beamStart +
            (point.position / beamLength) *
            (beamEnd - beamStart);


        // Small tick on dimension line
        const tick = createSvgElement("line", {
            x1: x,
            y1: dimensionY - 6,
            x2: x,
            y2: dimensionY + 6,
            stroke: "#012043",
            "stroke-width": 1.5
        });

        svg.appendChild(tick);


        // Vertical dotted projection line
        const projection = createSvgElement("line", {
            x1: x,
            y1: beamY + 20,
            x2: x,
            y2: 670,
            stroke: "#777",
            "stroke-width": 1,
            "stroke-dasharray": "4 4"
        });

        svg.appendChild(projection);


        // Distance label
        const label = createSvgElement("text", {
            x: x,
            y: dimensionY + 25,
            "text-anchor": "middle",
            "font-size": 13,
            fill: "#012043"
        });

        label.textContent = point.label;

        svg.appendChild(label);
    });
}

function drawSFD(
    svg,
    beamStart,
    beamEnd,
    beamLength,
    beamType,
    reactions
) {

    // =========================================
    // EXISTING SFD AXIS
    // =========================================

    const sfdZeroY = 330;
    const graphTop = 235;
    const graphBottom = 415;

    const graphStart = beamStart;
    const graphEnd = beamEnd;

    const graphHeight =
        graphBottom - graphTop;


    // =========================================
    // COLLECT LOADS
    // =========================================

    const loads =
        document.querySelectorAll(
            "#loadsContainer .load-item"
        );

    const pointLoads = [];
    const udls = [];


    loads.forEach(loadItem => {

        const loadType =
            loadItem.querySelector(
                ".load-type"
            )?.value;


        // =====================================
        // POINT LOAD
        // =====================================

        if (loadType === "point") {

            const magnitude =
                parseFloat(
                    loadItem
                        .querySelector(".load-value")
                        ?.value
                );

            const position =
                parseFloat(
                    loadItem
                        .querySelector(".load-position")
                        ?.value
                );


            if (
                isFinite(magnitude) &&
                magnitude > 0 &&
                isFinite(position) &&
                position >= 0 &&
                position <= beamLength
            ) {

                pointLoads.push({
                    position: position,
                    magnitude: magnitude
                });
            }
        }


        // =====================================
        // UDL
        // =====================================

        else if (loadType === "udl") {

            const magnitude =
                parseFloat(
                    loadItem
                        .querySelector(".load-value")
                        ?.value
                );

            const start =
                parseFloat(
                    loadItem
                        .querySelector(".load-start")
                        ?.value
                );

            const end =
                parseFloat(
                    loadItem
                        .querySelector(".load-end")
                        ?.value
                );


            if (
                isFinite(magnitude) &&
                magnitude > 0 &&
                isFinite(start) &&
                isFinite(end) &&
                start >= 0 &&
                end <= beamLength &&
                start < end
            ) {

                udls.push({
                    start: start,
                    end: end,
                    magnitude: magnitude
                });
            }
        }

        // Applied moments are ignored for SFD.
    });


    // =========================================
    // COMBINE POINT LOADS AT SAME POSITION
    // =========================================

    const combinedPointLoads = [];

    pointLoads.forEach(load => {

        const existing =
            combinedPointLoads.find(
                item =>
                    Math.abs(
                        item.position -
                        load.position
                    ) < 0.000001
            );

        if (existing) {

            existing.magnitude +=
                load.magnitude;

        } else {

            combinedPointLoads.push({
                position: load.position,
                magnitude: load.magnitude
            });
        }
    });


    // =========================================
    // IMPORTANT POSITIONS
    // =========================================

    const positions = [
        0,
        beamLength
    ];


    combinedPointLoads.forEach(load => {
        positions.push(load.position);
    });


    udls.forEach(load => {
        positions.push(load.start);
        positions.push(load.end);
    });


    const uniquePositions = [
        ...new Set(
            positions.map(
                x => Number(x.toFixed(6))
            )
        )
    ].sort(
        (a, b) => a - b
    );


    // =========================================
    // CALCULATE SHEAR AT POSITION
    // =========================================

    function shearAt(x) {

        let V = reactions.RA || 0;


        // Point loads to the LEFT of x
        combinedPointLoads.forEach(load => {

            if (load.position < x) {

                V -= load.magnitude;
            }
        });


        // UDL contribution
        udls.forEach(load => {

            if (x <= load.start) {
                return;
            }


            const loadedLength =
                Math.min(x, load.end) -
                load.start;


            if (loadedLength > 0) {

                V -=
                    load.magnitude *
                    loadedLength;
            }
        });


        return V;
    }


    // =========================================
    // FIND MAXIMUM SHEAR
    // =========================================

    const shearValues = [];

    uniquePositions.forEach(x => {

        // Just after x
        shearValues.push(
            shearAt(x + 0.000001)
        );


        // Just before x
        shearValues.push(
            shearAt(x - 0.000001)
        );
    });


    shearValues.push(0);


    const maxAbsShear =
        Math.max(
            ...shearValues.map(
                value => Math.abs(value)
            ),
            1
        );


    // =========================================
    // SHEAR → SVG Y
    // =========================================

    const scale =
        (graphHeight / 2 - 10) /
        maxAbsShear;


    function shearToY(V) {

        return (
            sfdZeroY -
            V * scale
        );
    }


    // =========================================
    // DRAW EACH SFD SEGMENT
    // =========================================

    for (
        let i = 0;
        i < uniquePositions.length - 1;
        i++
    ) {

        const x1 =
            uniquePositions[i];

        const x2 =
            uniquePositions[i + 1];


        // Shear immediately AFTER x1
        const V1 =
            shearAt(x1 + 0.000001);


        // Shear immediately BEFORE x2
        const V2 =
            shearAt(x2 - 0.000001);


        const svgX1 =
            graphStart +
            (x1 / beamLength) *
            (graphEnd - graphStart);


        const svgX2 =
            graphStart +
            (x2 / beamLength) *
            (graphEnd - graphStart);


        // =====================================
        // DRAW SFD SEGMENT
        // =====================================

        svg.appendChild(
            createSvgElement(
                "line",
                {
                    x1: svgX1,
                    y1: shearToY(V1),

                    x2: svgX2,
                    y2: shearToY(V2),

                    stroke: "#87CEFA",
                    "stroke-width": 3
                }
            )
        );


        // =====================================
        // POINT LOAD JUMP AT x2
        // =====================================

        const pointLoadAtX =
            combinedPointLoads
                .filter(
                    load =>
                        Math.abs(
                            load.position - x2
                        ) < 0.000001
                )
                .reduce(
                    (sum, load) =>
                        sum + load.magnitude,
                    0
                );


        if (
            pointLoadAtX > 0 &&
            !(
                beamType ===
                "simply-supported" &&
                Math.abs(
                    x2 - beamLength
                ) < 0.000001
            )
        ) {

            const x =
                graphStart +
                (x2 / beamLength) *
                (graphEnd - graphStart);


            const beforeShear =
                shearAt(
                    x2 - 0.000001
                );


            const afterShear =
                beforeShear -
                pointLoadAtX;


            svg.appendChild(
                createSvgElement(
                    "line",
                    {
                        x1: x,
                        y1: shearToY(
                            beforeShear
                        ),

                        x2: x,
                        y2: shearToY(
                            afterShear
                        ),

                        stroke: "#87CEFA",
                        "stroke-width": 3
                    }
                )
            );
        }
    }


    // =========================================
    // RIGHT SUPPORT REACTION
    // =========================================

    if (
        beamType ===
        "simply-supported" &&
        isFinite(reactions.RB)
    ) {

        const beforeRB =
            shearAt(
                beamLength -
                0.000001
            );


        const afterRB =
            beforeRB +
            reactions.RB;


        svg.appendChild(
            createSvgElement(
                "line",
                {
                    x1: graphEnd,
                    y1: shearToY(
                        beforeRB
                    ),

                    x2: graphEnd,
                    y2: shearToY(
                        afterRB
                    ),

                    stroke: "#87CEFA",
                    "stroke-width": 3
                }
            )
        );
    }

        // =========================================
        // SFD VALUE LABELING
        // LEFT → RIGHT
        // =========================================

        // Every bending/important point
        const sfdPoints = [];


        // -----------------------------------------
        // STARTING POINT
        // -----------------------------------------

        sfdPoints.push({
            position: 0,
            shear: shearAt(0.000001)
        });


        // -----------------------------------------
        // POINT LOAD LOCATIONS
        // -----------------------------------------

        combinedPointLoads.forEach(load => {

            const before =
                shearAt(load.position - 0.000001);

            const after =
                shearAt(load.position + 0.000001);

            // Before the jump
            sfdPoints.push({
                position: load.position,
                shear: before
            });

            // After the jump
            sfdPoints.push({
                position: load.position,
                shear: after
            });
        });


        // -----------------------------------------
        // UDL START AND END
        // -----------------------------------------

        udls.forEach(load => {

            sfdPoints.push({
                position: load.start,
                shear: shearAt(
                    load.start + 0.000001
                )
            });

            sfdPoints.push({
                position: load.end,
                shear: shearAt(
                    load.end + 0.000001
                )
            });
        });


        // -----------------------------------------
        // ENDING POINT
        // -----------------------------------------

        sfdPoints.push({
            position: beamLength,
            shear: shearAt(
                beamLength - 0.000001
            )
        });


        // -----------------------------------------
        // LEFT → RIGHT
        // -----------------------------------------

        sfdPoints.sort(
            (a, b) => a.position - b.position
        );


        // =========================================
        // VALUES ALREADY ENCOUNTERED
        // =========================================

        const encounteredSFValues = [];


        // =========================================
        // LABEL INFORMATION
        // =========================================

        const sfLabels = [];


        // Font size
        const sfFontSize = 13;


        // Approximate minimum horizontal
        // distance corresponding to font length
        const minimumLabelDistance =
            sfFontSize;


        // =========================================
        // CHECK EVERY BENDING POINT
        // =========================================

        sfdPoints.forEach(point => {

            const shearValue = point.shear;


            // -----------------------------------------
            // CHECK IF SF VALUE ALREADY OCCURRED
            // -----------------------------------------

            const alreadyOccurred =
                encounteredSFValues.some(
                    value =>
                        Math.abs(
                            value - shearValue
                        ) < 0.000001
                );


            // If the same SF occurred earlier,
            // do not display it.
            if (alreadyOccurred) {
                return;
            }


            // This is the first occurrence
            // of this SF value.
            encounteredSFValues.push(
                shearValue
            );


            // -----------------------------------------
            // SVG POSITION
            // -----------------------------------------

            const x =
                graphStart +
                (point.position / beamLength) *
                (graphEnd - graphStart);

            const y =
                shearToY(shearValue);


            // -----------------------------------------
            // DEFAULT LABEL POSITION
            // ABOVE SFD
            // -----------------------------------------

            let labelX = x + 8;
            let labelY = y - 8;

            let labelSide = "above";


            // =========================================
            // CHECK FOR CLOSE LABELS
            // =========================================

            sfLabels.forEach(existingLabel => {

                const horizontalDistance =
                    Math.abs(
                        labelX -
                        existingLabel.x
                    );


                // If labels are closer than
                // the font length
                if (
                    horizontalDistance <
                    minimumLabelDistance
                ) {

                    // Move the NEW label
                    // below the SFD.
                    labelY = y + 18;

                    labelSide = "below";
                }
            });


            // =========================================
            // SAVE LABEL POSITION
            // =========================================

            sfLabels.push({
                x: labelX,
                y: labelY,
                side: labelSide,
                shear: shearValue
            });


            // =========================================
            // DRAW POINT
            // =========================================

            svg.appendChild(
                createSvgElement(
                    "circle",
                    {
                        cx: x,
                        cy: y,
                        r: 3.5,
                        fill: "#87CEFA"
                    }
                )
            );


            // =========================================
            // DRAW SF VALUE
            // =========================================

            const label =
                createSvgElement(
                    "text",
                    {
                        x: labelX,
                        y: labelY,
                        "font-size": sfFontSize,
                        "font-weight": "bold",
                        fill: "#012043"
                    }
                );


            label.textContent =
                `${shearValue.toFixed(2)} N`;


            svg.appendChild(label);

        });
        
}

function drawBMD(
    svg,
    beamStart,
    beamEnd,
    beamLength,
    beamType,
    reactions
) {

    // =========================================
    // BMD GRAPH SETTINGS
    // =========================================

    const bmdZeroY = 570;

    const graphTop = 475;
    const graphBottom = 650;

    const graphStart = beamStart;
    const graphEnd = beamEnd;

    const graphHeight =
        graphBottom - graphTop;


    // =========================================
    // COLLECT LOADS
    // =========================================

    const loads =
        document.querySelectorAll(
            "#loadsContainer .load-item"
        );

    const pointLoads = [];
    const udls = [];
    const moments = [];


    loads.forEach(loadItem => {

        const loadType =
            loadItem
                .querySelector(".load-type")
                ?.value;


        // =====================================
        // POINT LOAD
        // =====================================

        if (
            loadType === "point"
        ) {

            const magnitude =
                parseFloat(
                    loadItem
                        .querySelector(".load-value")
                        ?.value
                );

            const position =
                parseFloat(
                    loadItem
                        .querySelector(".load-position")
                        ?.value
                );


            if (
                isFinite(magnitude) &&
                magnitude > 0 &&
                isFinite(position) &&
                position >= 0 &&
                position <= beamLength
            ) {

                pointLoads.push({
                    position:
                        position,

                    magnitude:
                        magnitude
                });
            }
        }


        // =====================================
        // UDL
        // =====================================

        else if (
            loadType === "udl"
        ) {

            const magnitude =
                parseFloat(
                    loadItem
                        .querySelector(".load-value")
                        ?.value
                );

            const start =
                parseFloat(
                    loadItem
                        .querySelector(".load-start")
                        ?.value
                );

            const end =
                parseFloat(
                    loadItem
                        .querySelector(".load-end")
                        ?.value
                );


            if (
                isFinite(magnitude) &&
                magnitude > 0 &&
                isFinite(start) &&
                isFinite(end) &&
                start >= 0 &&
                end <= beamLength &&
                start < end
            ) {

                udls.push({
                    start:
                        start,

                    end:
                        end,

                    magnitude:
                        magnitude
                });
            }
        }


        // =====================================
        // APPLIED MOMENT
        // =====================================

        else if (
            loadType === "moment"
        ) {

            const magnitude =
                parseFloat(
                    loadItem
                        .querySelector(".load-moment")
                        ?.value
                );

            const position =
                parseFloat(
                    loadItem
                        .querySelector(".load-position")
                        ?.value
                );

            const direction =
                loadItem
                    .querySelector(
                        ".moment-direction"
                    )
                    ?.value;


            if (
                isFinite(magnitude) &&
                magnitude >= 0 &&
                isFinite(position) &&
                position >= 0 &&
                position <= beamLength
            ) {

                moments.push({
                    position:
                        position,

                    magnitude:
                        magnitude,

                    direction:
                        direction
                });
            }
        }
    });


    // =========================================
    // COMBINE POINT LOADS AT SAME POSITION
    // =========================================

    const combinedPointLoads = [];


    pointLoads.forEach(load => {

        const existing =
            combinedPointLoads.find(
                item =>
                    Math.abs(
                        item.position -
                        load.position
                    ) < 0.000001
            );


        if (existing) {

            existing.magnitude +=
                load.magnitude;

        }
        else {

            combinedPointLoads.push({
                position:
                    load.position,

                magnitude:
                    load.magnitude
            });
        }
    });


    // =========================================
    // IMPORTANT POSITIONS
    // =========================================

    const positions = [
        0,
        beamLength
    ];


    combinedPointLoads.forEach(
        load => {

            positions.push(
                load.position
            );
        }
    );


    udls.forEach(
        load => {

            positions.push(
                load.start
            );

            positions.push(
                load.end
            );
        }
    );


    moments.forEach(
        load => {

            positions.push(
                load.position
            );
        }
    );


    const uniquePositions = [
        ...new Set(
            positions.map(
                x =>
                    Number(
                        x.toFixed(6)
                    )
            )
        )
    ].sort(
        (a, b) => a - b
    );


    // =========================================
    // SIGN OF APPLIED MOMENT
    // =========================================

    function appliedMomentSign(load) {

        if (
            load.direction === "clockwise"
        ) {
            return load.magnitude;       // POSITIVE
        }

        if (
            load.direction === "counterclockwise"
        ) {
            return -load.magnitude;      // NEGATIVE
        }

        return 0;
    }


    // =========================================
    // BENDING MOMENT AT x
    //
    // LEFT-SIDE SECTION METHOD
    //
    // M(x) =
    //
    // reaction contribution
    // - point-load contribution
    // - UDL contribution
    // + applied-moment contribution
    //
    // =========================================

    function bendingMomentAt(x) {

        let M = 0;


        // =====================================
        // LEFT SUPPORT REACTION
        // =====================================

        M +=
            (reactions.RA || 0) *
            x;


        // =====================================
        // CANTILEVER FIXED-END REACTION MOMENT
        // =====================================

        if (
            beamType ===
            "cantilever"
        ) {

            /*
             * Fixed-end reaction moment
             * has the opposite sign to
             * the total external moment.
             */

            M -=
                (reactions.MA || 0);
        }


        // =====================================
        // POINT LOADS TO LEFT
        // =====================================

        combinedPointLoads.forEach(
            load => {

                if (
                    load.position < x
                ) {

                    M -=
                        load.magnitude *
                        (
                            x -
                            load.position
                        );
                }
            }
        );


        // =====================================
        // UDL CONTRIBUTIONS
        // =====================================

        udls.forEach(
            load => {

                if (
                    x <= load.start
                ) {

                    return;
                }


                /*
                 * Portion of UDL that lies
                 * to the LEFT of the section.
                 */

                const loadedLength =
                    Math.min(
                        x,
                        load.end
                    ) -
                    load.start;


                if (
                    loadedLength <= 0
                ) {

                    return;
                }


                const resultant =
                    load.magnitude *
                    loadedLength;


                const centroid =
                    load.start +
                    loadedLength / 2;


                M -=
                    resultant *
                    (
                        x -
                        centroid
                    );
            }
        );


        // =====================================
        // APPLIED MOMENTS TO LEFT
        // =====================================

        moments.forEach(
            load => {

                if (
                    load.position < x
                ) {

                    M +=
                        appliedMomentSign(
                            load
                        );
                }
            }
        );


        return M;
    }


    // =========================================
    // FIND MAXIMUM ABSOLUTE BENDING MOMENT
    // =========================================

    const momentValues = [];


    uniquePositions.forEach(
        x => {

            momentValues.push(
                bendingMomentAt(
                    x -
                    0.000001
                )
            );

            momentValues.push(
                bendingMomentAt(
                    x +
                    0.000001
                )
            );
        }
    );


    momentValues.push(0);


    const maxAbsMoment =
        Math.max(
            ...momentValues.map(
                value =>
                    Math.abs(value)
            ),
            1
        );


    // =========================================
    // MOMENT → SVG Y
    // =========================================

    const scale =
        (
            graphHeight / 2 -
            10
        ) /
        maxAbsMoment;


    function momentToY(M) {

        return (
            bmdZeroY -
            M * scale
        );
    }


    // =========================================
    // DRAW BMD REGION BY REGION
    // =========================================

    for (
        let i = 0;
        i <
        uniquePositions.length - 1;
        i++
    ) {

        const x1 =
            uniquePositions[i];

        const x2 =
            uniquePositions[i + 1];


        const intervalLength =
            x2 - x1;


        /*
         * More points give a smooth parabola
         * when a UDL is present.
         */

        const subdivisions =
            Math.max(
                10,
                Math.ceil(
                    intervalLength * 20
                )
            );


        const points = [];


        for (
            let j = 0;
            j <= subdivisions;
            j++
        ) {

            const x =
                x1 +
                (
                    intervalLength *
                    j /
                    subdivisions
                );


            /*
             * Avoid evaluating exactly at a
             * point-load/moment discontinuity
             * from the wrong side.
             */

            let evaluationX = x;


            if (
                j === 0 &&
                i > 0
            ) {

                evaluationX +=
                    0.000001;
            }


            if (
                j === subdivisions &&
                i <
                uniquePositions.length - 2
            ) {

                evaluationX -=
                    0.000001;
            }


            const M =
                bendingMomentAt(
                    evaluationX
                );


            const svgX =
                graphStart +
                (
                    x /
                    beamLength
                ) *
                (
                    graphEnd -
                    graphStart
                );


            const svgY =
                momentToY(M);


            points.push(
                `${svgX},${svgY}`
            );
        }


        svg.appendChild(
            createSvgElement(
                "polyline",
                {
                    points:
                        points.join(" "),

                    fill:
                        "none",

                    stroke:
                        "#004fd6",

                    "stroke-width":
                        3
                }
            )
        );
    }


    // =========================================
    // APPLIED MOMENT VERTICAL JUMPS
    // =========================================

    moments.forEach(
        load => {

            const x =
                graphStart +
                (
                    load.position /
                    beamLength
                ) *
                (
                    graphEnd -
                    graphStart
                );


            const before =
                bendingMomentAt(
                    load.position -
                    0.000001
                );


            const after =
                bendingMomentAt(
                    load.position +
                    0.000001
                );


            svg.appendChild(
                createSvgElement(
                    "line",
                    {
                        x1:
                            x,

                        y1:
                            momentToY(
                                before
                            ),

                        x2:
                            x,

                        y2:
                            momentToY(
                                after
                            ),

                        stroke:
                            "#004fd6",

                        "stroke-width":
                            3
                    }
                )
            );
        }
    );


    // ===============================
    // BMD VALUE LABELS
    // ===============================

    const bmdPoints = [];

    // Starting point
    bmdPoints.push({
        position: 0,
        moment: bendingMomentAt(0.000001)
    });

    // Point loads
    combinedPointLoads.forEach(load => {

        bmdPoints.push({
            position: load.position,
            moment: bendingMomentAt(
                load.position - 0.000001
            )
        });

        bmdPoints.push({
            position: load.position,
            moment: bendingMomentAt(
                load.position + 0.000001
            )
        });
    });

    // UDL start and end
    udls.forEach(load => {

        bmdPoints.push({
            position: load.start,
            moment: bendingMomentAt(
                load.start + 0.000001
            )
        });

        bmdPoints.push({
            position: load.end,
            moment: bendingMomentAt(
                load.end - 0.000001
            )
        });
    });

    // Applied moments
    moments.forEach(load => {

        bmdPoints.push({
            position: load.position,
            moment: bendingMomentAt(
                load.position - 0.000001
            )
        });

        bmdPoints.push({
            position: load.position,
            moment: bendingMomentAt(
                load.position + 0.000001
            )
        });
    });

    // Ending point
    bmdPoints.push({
        position: beamLength,
        moment: bendingMomentAt(
            beamLength - 0.000001
        )
    });

    // Left → right
    bmdPoints.sort(
        (a, b) =>
            a.position - b.position
    );


    // =====================================
    // REMOVE DUPLICATE BMD VALUES
    // =====================================

    const encounteredBMValues = [];

    const bmLabels = [];

    const bmFontSize = 13;

    bmdPoints.forEach(point => {

        const momentValue = point.moment;

        // Don't display a value that already
        // occurred earlier
        const alreadyOccurred =
            encounteredBMValues.some(
                value =>
                    Math.abs(
                        value - momentValue
                    ) < 0.000001
            );

        if (alreadyOccurred) {
            return;
        }

        encounteredBMValues.push(momentValue);


        // =====================================
        // CONVERT BEAM POSITION TO SVG POSITION
        // =====================================

        const x =
            graphStart +
            (
                point.position /
                beamLength
            ) *
            (
                graphEnd -
                graphStart
            );

        const y =
            momentToY(momentValue);


        // =====================================
        // CREATE LABEL
        // =====================================

        const label =
            createSvgElement(
                "text",
                {
                    x: x + 8,

                    y: y - 8,

                    "font-size":
                        bmFontSize,

                    "font-weight":
                        "bold",

                    fill:
                        "#012043"
                }
            );

        label.textContent =
            `${momentValue.toFixed(2)} N·m`;

        svg.appendChild(label);


        // =====================================
        // GET ACTUAL TEXT WIDTH
        // =====================================

        let labelWidth = 0;

        try {

            labelWidth =
                label.getComputedTextLength();

        } catch (error) {

            labelWidth =
                label.textContent.length *
                bmFontSize *
                0.6;
        }


        // =====================================
        // CHECK FOR NEARBY LABELS
        // =====================================

        let overlappingLabel = null;

        for (
            const existingLabel
            of bmLabels
        ) {

            const horizontalDistance =
                Math.abs(
                    (x + 8) -
                    existingLabel.x
                );

            const requiredDistance =
                Math.max(
                    labelWidth,
                    existingLabel.width
                );

            if (
                horizontalDistance <
                requiredDistance
            ) {

                overlappingLabel =
                    existingLabel;

                break;
            }
        }


        // =====================================
        // IF LABELS ARE CLOSE
        // =====================================

        if (overlappingLabel) {

            /*
            * Compare their BMD values.
            *
            * Higher BMD value:
            *     label goes ABOVE
            *
            * Lower BMD value:
            *     label goes BELOW
            */

            if (
                momentValue >
                overlappingLabel.moment
            ) {

                // Current value is higher
                label.setAttribute(
                    "y",
                    y - 8
                );

                // Move previous lower
                overlappingLabel.element
                    .setAttribute(
                        "y",
                        overlappingLabel.y + 18
                    );

            } else {

                // Current value is lower
                label.setAttribute(
                    "y",
                    y + 18
                );

                // Move previous higher
                overlappingLabel.element
                    .setAttribute(
                        "y",
                        overlappingLabel.y - 8
                    );
            }
        }


        // =====================================
        // SAVE LABEL INFORMATION
        // =====================================

        bmLabels.push({
            x: x + 8,

            width: labelWidth,

            y: y,

            moment: momentValue,

            element: label
        });

    });
}

function updateBeamVisualization() {

    const beamType = document.getElementById("beamType").value;
    const beamDisplay = document.getElementById("beamDisplay");

    // Clear previous diagram
    beamDisplay.innerHTML = "";

    // Beam length
    const beamLengthInput = document.getElementById("beamLength");
    const beamLength = parseFloat(beamLengthInput?.value);

    const hasValidBeamLength =
        isFinite(beamLength) && beamLength > 0;

    // ==============================
    // SVG DIMENSIONS
    // ==============================

    const svgWidth = 900;
    const svgHeight = 760;

    // Actual drawable beam position
    const beamStart = 100;
    const beamEnd = 800;

    const beamY = 100;
    const beamHeight = 20;

    const beamPixelLength = beamEnd - beamStart;

    // ==============================
    // CREATE SVG
    // ==============================

    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.setAttribute(
        "viewBox",
        `0 0 ${svgWidth} ${svgHeight}`
    );

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "760");
    svg.setAttribute("class", "beam-svg");

    // ==================================================
    // CANTILEVER
    // ==================================================

    if (beamType === "cantilever") {

        // Beam
        const beam = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );

        beam.setAttribute("x", beamStart);
        beam.setAttribute(
            "y",
            beamY - beamHeight / 2
        );

        beam.setAttribute(
            "width",
            beamPixelLength
        );

        beam.setAttribute("height", beamHeight);

        beam.setAttribute("fill", "white");
        beam.setAttribute("stroke", "black");
        beam.setAttribute("stroke-width", "3");

        svg.appendChild(beam);

        // Fixed wall
        const wall = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        wall.setAttribute("x1", beamStart);
        wall.setAttribute("y1", 45);
        wall.setAttribute("x2", beamStart);
        wall.setAttribute("y2", 155);

        wall.setAttribute("stroke", "black");
        wall.setAttribute("stroke-width", "5");

        svg.appendChild(wall);


        // Fixed support hatching
        for (let y = 50; y <= 150; y += 20) {

            const hatch = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );

            hatch.setAttribute("x1", beamStart);
            hatch.setAttribute("y1", y);

            hatch.setAttribute(
                "x2",
                beamStart - 25
            );

            hatch.setAttribute(
                "y2",
                y + 25
            );

            hatch.setAttribute("stroke", "black");
            hatch.setAttribute("stroke-width", "2");

            svg.appendChild(hatch);
        }
    }


    // ==================================================
    // SIMPLY SUPPORTED
    // ==================================================

    else if (beamType === "simply-supported") {

        // Beam
        const beam = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );

        beam.setAttribute("x", beamStart);

        beam.setAttribute(
            "y",
            beamY - beamHeight / 2
        );

        beam.setAttribute(
            "width",
            beamPixelLength
        );

        beam.setAttribute("height", beamHeight);

        beam.setAttribute("fill", "white");
        beam.setAttribute("stroke", "black");
        beam.setAttribute("stroke-width", "3");

        svg.appendChild(beam);


        // LEFT PIN SUPPORT
        const pin = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "polygon"
        );

        pin.setAttribute(
            "points",
            `${beamStart},${beamY + 10}
             ${beamStart - 25},${beamY + 45}
             ${beamStart + 25},${beamY + 45}`
        );

        pin.setAttribute("fill", "black");

        svg.appendChild(pin);


        // RIGHT ROLLER SUPPORT
        const roller = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "polygon"
        );

        roller.setAttribute(
            "points",
            `${beamEnd},${beamY + 10}
             ${beamEnd - 25},${beamY + 45}
             ${beamEnd + 25},${beamY + 45}`
        );

        roller.setAttribute("fill", "black");

        svg.appendChild(roller);


        // ROLLER WHEELS
        const wheel1 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        wheel1.setAttribute(
            "cx",
            beamEnd - 12
        );

        wheel1.setAttribute(
            "cy",
            beamY + 52
        );

        wheel1.setAttribute("r", "7");

        wheel1.setAttribute("fill", "white");
        wheel1.setAttribute("stroke", "black");
        wheel1.setAttribute("stroke-width", "3");

        svg.appendChild(wheel1);


        const wheel2 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        wheel2.setAttribute(
            "cx",
            beamEnd + 12
        );

        wheel2.setAttribute(
            "cy",
            beamY + 52
        );

        wheel2.setAttribute("r", "7");

        wheel2.setAttribute("fill", "white");
        wheel2.setAttribute("stroke", "black");
        wheel2.setAttribute("stroke-width", "3");

        svg.appendChild(wheel2);
    }


    // ==================================================
    // POINT LOADS
    // ==================================================

    const loads = document.querySelectorAll("#loadsContainer .load-item");

    if (hasValidBeamLength) {

        loads.forEach((loadItem, index) => {

        const loadType = loadItem.querySelector(".load-type")?.value;

        // =========================================================
        // POINT LOAD
        // =========================================================
        if (loadType === "point") {

            const magnitude = parseFloat(
                loadItem.querySelector(".load-value")?.value
            );

            const position = parseFloat(
                loadItem.querySelector(".load-position")?.value
            );

            if (
                !isFinite(magnitude) ||
                magnitude <= 0 ||
                !isFinite(position) ||
                position < 0 ||
                position > beamLength
            ) {
                return;
            }

            // Convert real beam position to SVG position
            const loadX =
                beamStart +
                (position / beamLength) * beamPixelLength;

            // Point-load arrow
            const arrowTop = 35;
            const arrowBottom =
                beamY - beamHeight / 2;

            // Vertical line
            svg.appendChild(
                createSvgElement("line", {
                    x1: loadX,
                    y1: arrowTop,
                    x2: loadX,
                    y2: arrowBottom,
                    stroke: "#000",
                    "stroke-width": 2
                })
            );

            // Arrow head
            svg.appendChild(
                createSvgElement("polygon", {
                    points: `
                        ${loadX - 6},${arrowBottom - 10}
                        ${loadX + 6},${arrowBottom - 10}
                        ${loadX},${arrowBottom}
                    `,
                    fill: "#000"
                })
            );

            // Load value
            const loadText = createSvgElement("text", {
                x: loadX,
                y: arrowTop - 8,
                "text-anchor": "middle",
                "font-size": 14,
                "font-weight": "bold",
                fill: "#000"
            });

            loadText.textContent = `${magnitude} N`;

            svg.appendChild(loadText);
        }


        // =========================================================
        // UNIFORMLY DISTRIBUTED LOAD
        // =========================================================
        else if (loadType === "udl") {

            const magnitude = parseFloat(
                loadItem.querySelector(".load-value")?.value
            );

            const positionA = parseFloat(
                loadItem.querySelector(".load-start")?.value
            );

            const positionB = parseFloat(
                loadItem.querySelector(".load-end")?.value
            );

            if (
                !isFinite(magnitude) ||
                magnitude <= 0 ||
                !isFinite(positionA) ||
                !isFinite(positionB)
            ) {
                return;
            }

            // Make sure A is the smaller position
            const startPosition = Math.min(positionA, positionB);
            const endPosition = Math.max(positionA, positionB);

            if (
                startPosition < 0 ||
                endPosition > beamLength ||
                startPosition >= endPosition
            ) {
                return;
            }

            // Convert real positions to SVG positions
            const udlStartX =
                beamStart +
                (startPosition / beamLength) * beamPixelLength;

            const udlEndX =
                beamStart +
                (endPosition / beamLength) * beamPixelLength;

            // -----------------------------------------------------
            // UDL ARROWS
            // -----------------------------------------------------

            // Half the height of the point-load arrow
            const udlArrowTop = 67;

            const udlArrowBottom =
                beamY - beamHeight / 2;

            // Distance between arrows
            const arrowSpacing = 25;

            // Number of arrows based on UDL length
            const udlLengthPixels = udlEndX - udlStartX;

            const arrowCount = Math.max(
                2,
                Math.floor(udlLengthPixels / arrowSpacing) + 1
            );

            const actualSpacing =
                udlLengthPixels / (arrowCount - 1);

            // Draw horizontal line at upper ends
            svg.appendChild(
                createSvgElement("line", {
                    x1: udlStartX,
                    y1: udlArrowTop,
                    x2: udlEndX,
                    y2: udlArrowTop,
                    stroke: "#000",
                    "stroke-width": 2
                })
            );

            // Draw the continuous arrows
            for (let i = 0; i < arrowCount; i++) {

                const arrowX =
                    udlStartX + i * actualSpacing;

                // Vertical arrow
                svg.appendChild(
                    createSvgElement("line", {
                        x1: arrowX,
                        y1: udlArrowTop,
                        x2: arrowX,
                        y2: udlArrowBottom,
                        stroke: "#000",
                        "stroke-width": 2
                    })
                );

                // Arrow head
                svg.appendChild(
                    createSvgElement("polygon", {
                        points: `
                            ${arrowX - 5},${udlArrowBottom - 8}
                            ${arrowX + 5},${udlArrowBottom - 8}
                            ${arrowX},${udlArrowBottom}
                        `,
                        fill: "#000"
                    })
                );
            }

            // -----------------------------------------------------
            // UDL VALUE
            // -----------------------------------------------------

            const udlText = createSvgElement("text", {
                x: (udlStartX + udlEndX) / 2,
                y: udlArrowTop - 10,
                "text-anchor": "middle",
                "font-size": 14,
                "font-weight": "bold",
                fill: "#000"
            });

            udlText.textContent = `${magnitude} N/m`;

            svg.appendChild(udlText);
        }

        else if (loadType === "moment") {

            const moment = parseFloat(
                loadItem.querySelector(".load-moment")?.value
            );

            const position = parseFloat(
                loadItem.querySelector(".load-position")?.value
            );

            const direction =
                loadItem.querySelector(".moment-direction")?.value;

            if (
                !isFinite(moment) ||
                !isFinite(position) ||
                position < 0 ||
                position > beamLength
            ) {
                return;
            }

            // Convert beam position to SVG position
            const momentX =
                beamStart +
                (position / beamLength) * beamPixelLength;

            // =====================================================
            // MOMENT ARROW SETTINGS
            // =====================================================

            const radius = 28;

            // Place the centre slightly above the beam
            const centerY = beamY - 5;

            // Unique marker for this load
            const markerId = `momentArrow_${index}`;

            // =====================================================
            // CREATE ARROWHEAD
            // =====================================================

            const defs =
                svg.querySelector("defs") ||
                createSvgElement("defs");

            if (!svg.querySelector("defs")) {
                svg.appendChild(defs);
            }

            const marker = createSvgElement("marker", {
                id: markerId,
                markerWidth: "8",
                markerHeight: "8",
                refX: "6",
                refY: "3",
                orient: "auto",
                markerUnits: "strokeWidth"
            });

            const arrowHead = createSvgElement("path", {
                d: "M0,0 L0,6 L6,3 Z",
                fill: "black"
            });

            marker.appendChild(arrowHead);
            defs.appendChild(marker);

            // =====================================================
            // DRAW MOMENT ARC
            // =====================================================

            let pathData;

            if (direction === "clockwise") {

                // Clockwise curved arrow
                pathData = `
                    M ${momentX - radius} ${centerY}
                    A ${radius} ${radius} 0 1 0
                    ${momentX + radius} ${centerY}
                `;

            } else {

                // Counterclockwise curved arrow
                pathData = `
                    M ${momentX + radius} ${centerY}
                    A ${radius} ${radius} 0 1 0
                    ${momentX - radius} ${centerY}
                `;
            }

            const momentArc = createSvgElement("path", {
                d: pathData,
                fill: "none",
                stroke: "black",
                "stroke-width": "3",
                "marker-end": `url(#${markerId})`
            });

            svg.appendChild(momentArc);

            // =====================================================
            // MOMENT VALUE
            // =====================================================

            const momentText = createSvgElement("text", {
                x: momentX,
                y: beamY + 38,
                "text-anchor": "middle",
                "font-size": "14",
                "font-weight": "bold",
                fill: "black"
            });

            momentText.textContent = `${moment} N·m`;

            svg.appendChild(momentText);
            }
            });

            // Important points and projection lines
            drawImportantPointDimensions(
                svg,
                beamStart,
                beamEnd,
                beamY,
                beamLength
            );
        }

    /* =========================================
    SUPPORT REACTIONS
    ========================================= */

    const reactions = calculateSupportReactions();

    if (reactions) {

        drawSFD(
            svg,
            beamStart,
            beamEnd,
            beamLength,
            beamType,
            reactions
        );
        drawBMD(
            svg,
            beamStart,
            beamEnd,
            beamLength,
            beamType,
            reactions
        );

        // =========================
        // RA
        // =========================

        if (isFinite(reactions.RA)) {

            const raText = createSvgElement("text", {
                x: beamStart,
                y: beamY + 85,
                "text-anchor": "middle",
                "font-size": 15,
                "font-weight": "bold",
                fill: "#012043"
            });

            raText.textContent =
                `RA = ${reactions.RA.toFixed(2)} N`;

            svg.appendChild(raText);
        }


        // =========================
        // RB
        // =========================

        if (
            beamType === "simply-supported" &&
            isFinite(reactions.RB)
        ) {

            const rbText = createSvgElement("text", {
                x: beamEnd,
                y: beamY + 85,
                "text-anchor": "middle",
                "font-size": 15,
                "font-weight": "bold",
                fill: "#012043"
            });

            rbText.textContent =
                `RB = ${reactions.RB.toFixed(2)} N`;

            svg.appendChild(rbText);
        }
    }


   /* =========================================
   SFD AND BMD AXES
   ========================================= */

    const sfdZeroY = 330;
    const bmdZeroY = 570;

    const graphTop = 235;
    const graphBottom = 415;

    const graphStart = beamStart;
    const graphEnd = beamEnd;


    /* =========================================
    SHEAR FORCE DIAGRAM AXES
    ========================================= */

    // Horizontal axis
    svg.appendChild(
        createSvgElement("line", {
            x1: graphStart,
            y1: sfdZeroY,
            x2: graphEnd,
            y2: sfdZeroY,
            stroke: "#012043",
            "stroke-width": 2
        })
    );

    // Vertical axis
    svg.appendChild(
        createSvgElement("line", {
            x1: graphStart,
            y1: graphTop,
            x2: graphStart,
            y2: graphBottom,
            stroke: "#012043",
            "stroke-width": 2
        })
    );


    // SFD y-axis label
    const sfdLabel = createSvgElement("text", {
        x: 35,
        y: sfdZeroY,
        "font-size": 17,
        "font-weight": "bold",
        fill: "#012043",
        "text-anchor": "middle",
        transform: `rotate(-90 35 ${sfdZeroY})`
    });

    sfdLabel.textContent = "Shear Force (N)";
    svg.appendChild(sfdLabel);


    /* =========================================
    BENDING MOMENT DIAGRAM AXES
    ========================================= */

    // Horizontal axis
    svg.appendChild(
        createSvgElement("line", {
            x1: graphStart,
            y1: bmdZeroY,
            x2: graphEnd,
            y2: bmdZeroY,
            stroke: "#012043",
            "stroke-width": 2
        })
    );

    // Vertical axis
    svg.appendChild(
        createSvgElement("line", {
            x1: graphStart,
            y1: bmdZeroY - 100,
            x2: graphStart,
            y2: bmdZeroY + 100,
            stroke: "#012043",
            "stroke-width": 2
        })
    );


    // BMD y-axis label
    const bmdLabel = createSvgElement("text", {
        x: 35,
        y: bmdZeroY,
        "font-size": 17,
        "font-weight": "bold",
        fill: "#012043",
        "text-anchor": "middle",
        transform: `rotate(-90 35 ${bmdZeroY})`
    });

    bmdLabel.textContent = "Bending Moment (N.m)";
    svg.appendChild(bmdLabel);

    // ==============================================
    // ADD SVG
    // ==============================================

    beamDisplay.appendChild(svg);
}


document.addEventListener("DOMContentLoaded", function () {

    const firstLoad = document.querySelector(".load-type");

    if (firstLoad) {
        updateLoadFields(firstLoad);
    }

    updateBeamVisualization();

});

document.addEventListener("input", function (event) {
    if (
        event.target.matches(
            "#beamLength, .load-value, .load-position, .load-start, .load-end, .load-moment"
        )
    ) {
        updateBeamVisualization();
    }
});

document.addEventListener("change", function (event) {
    if (
        event.target.matches(
            "#beamType, .load-type, .moment-direction"
        )
    ) {
        updateBeamVisualization();
    }
});

document.addEventListener("wheel", function (event) {

    if (
        event.target.matches('input[type="number"]') &&
        document.activeElement === event.target
    ) {
        event.target.blur();
    }

}, { passive: true });


    /* ===========================
       MOMENT OF AREA CALCULATION
       =========================== */

function calculateSecondMomentOfArea() {

    const sectionType = document.getElementById("sectionType").value;
    const result = document.getElementById("secondMomentResult");

    let I = null;

    // Solid Rectangle
    if (sectionType === "solidRectangle") {

        const a = parseFloat(document.getElementById("srHeight")?.value);
        const b = parseFloat(document.getElementById("srWidth")?.value);

        if (a > 0 && b > 0) {
            I = (b * Math.pow(a, 3)) / 12;
        }
    }

    // Solid Circle
    else if (sectionType === "solidCircle") {

        const a = parseFloat(
            document.getElementById("scDiameter")?.value
        );

        if (a > 0) {
            I = (Math.PI * Math.pow(a, 4)) / 64;
        }
    }

    // Hollow Rectangle
    else if (sectionType === "hollowRectangle") {

        const a = parseFloat(
            document.getElementById("hOuterHeight")?.value
        );

        const b = parseFloat(
            document.getElementById("hOuterWidth")?.value
        );

        const c = parseFloat(
            document.getElementById("hInnerHeight")?.value
        );

        const d = parseFloat(
            document.getElementById("hInnerWidth")?.value
        );

        if (
            a > 0 &&
            b > 0 &&
            c > 0 &&
            d > 0 &&
            c < a &&
            d < b
        ) {

            // Second moment of area about horizontal centroidal axis
            I = (b * Math.pow(a, 3) - d * Math.pow(c, 3)) / 12;
        }
    }

    // Hollow Circle
    else if (sectionType === "hollowCircle") {

        const a = parseFloat(
            document.getElementById("hcOuterDiameter")?.value
        );

        const b = parseFloat(
            document.getElementById("hcInnerDiameter")?.value
        );

        if (a > 0 && b > 0 && b < a) {

            // Second moment of area about horizontal centroidal axis
            I = (Math.PI / 64) *
                (Math.pow(a, 4) - Math.pow(b, 4));
        }
    }

    // I-Section
    else if (sectionType === "iSection") {

        const a = parseFloat(
            document.getElementById("iBottomThickness")?.value
        );

        const b = parseFloat(
            document.getElementById("iBottomWidth")?.value
        );

        const c = parseFloat(
            document.getElementById("iWebHeight")?.value
        );

        const d = parseFloat(
            document.getElementById("iWebThickness")?.value
        );

        const e = parseFloat(
            document.getElementById("iTopThickness")?.value
        );

        const f = parseFloat(
            document.getElementById("iTopWidth")?.value
        );

        if (
            a > 0 &&
            b > 0 &&
            c > 0 &&
            d > 0 &&
            e > 0 &&
            f > 0 &&
            d <= b &&
            d <= f
        ) {

            // =====================================
            // RECTANGLE 1 - BOTTOM FLANGE
            // =====================================

            const A1 = b * a;

            // Centroid of bottom flange from bottom
            const y1 = a / 2;

            // MOA of bottom flange about its own centroid
            const I1 = (b * Math.pow(a, 3)) / 12;


            // =====================================
            // RECTANGLE 2 - WEB
            // =====================================

            const A2 = d * c;

            // Centroid of web from bottom
            const y2 = a + c / 2;

            // MOA of web about its own centroid
            const I2 = (d * Math.pow(c, 3)) / 12;


            // =====================================
            // RECTANGLE 3 - TOP FLANGE
            // =====================================

            const A3 = f * e;

            // Centroid of top flange from bottom
            const y3 = a + c + e / 2;

            // MOA of top flange about its own centroid
            const I3 = (f * Math.pow(e, 3)) / 12;


            // =====================================
            // CENTROID OF WHOLE I-SECTION
            // =====================================

            const yBar =
                (A1 * y1 + A2 * y2 + A3 * y3) /
                (A1 + A2 + A3);


            // =====================================
            // PARALLEL AXIS THEOREM
            // =====================================

            const I1_total =
                I1 + A1 * Math.pow(y1 - yBar, 2);

            const I2_total =
                I2 + A2 * Math.pow(y2 - yBar, 2);

            const I3_total =
                I3 + A3 * Math.pow(y3 - yBar, 2);


            // =====================================
            // TOTAL SECOND MOMENT OF AREA
            // =====================================

            I = I1_total + I2_total + I3_total;
        }
    }

    // T-Section
    else if (sectionType === "tSection") {

        const a = parseFloat(
            document.getElementById("tWebThickness")?.value
        );

        const b = parseFloat(
            document.getElementById("tWebHeight")?.value
        );

        const c = parseFloat(
            document.getElementById("tFlangeThickness")?.value
        );

        const d = parseFloat(
            document.getElementById("tFlangeWidth")?.value
        );

        if (
            a > 0 &&
            b > 0 &&
            c > 0 &&
            d > 0 &&
            a <= d
        ) {

            // =====================================
            // RECTANGLE 1 - WEB
            // =====================================

            const A1 = a * b;

            // Centroid of web measured from bottom
            const y1 = b / 2;

            // MOA of web about its own centroid
            const I1 = (a * Math.pow(b, 3)) / 12;


            // =====================================
            // RECTANGLE 2 - FLANGE
            // =====================================

            const A2 = d * c;

            // Centroid of flange measured from bottom
            const y2 = b + c / 2;

            // MOA of flange about its own centroid
            const I2 = (d * Math.pow(c, 3)) / 12;


            // =====================================
            // CENTROID OF WHOLE T-SECTION
            // =====================================

            const yBar =
                (A1 * y1 + A2 * y2) /
                (A1 + A2);


            // =====================================
            // PARALLEL AXIS THEOREM
            // =====================================

            const I1_total =
                I1 + A1 * Math.pow(y1 - yBar, 2);

            const I2_total =
                I2 + A2 * Math.pow(y2 - yBar, 2);


            // =====================================
            // TOTAL SECOND MOMENT OF AREA
            // =====================================

            I = I1_total + I2_total;
        }
    }

    // C-Section
    else if (sectionType === "cSection") {

        const a = parseFloat(
            document.getElementById("cWidth")?.value
        );

        const b = parseFloat(
            document.getElementById("cBottomThickness")?.value
        );

        const c = parseFloat(
            document.getElementById("cHeight")?.value
        );

        const d = parseFloat(
            document.getElementById("cWebThickness")?.value
        );

        const e = parseFloat(
            document.getElementById("cTopThickness")?.value
        );

        const f = parseFloat(
            document.getElementById("cTopWidth")?.value
        );

        if (
            a > 0 &&
            b > 0 &&
            c > 0 &&
            d > 0 &&
            e > 0 &&
            f > 0 &&
            d <= a &&
            d <= f &&
            c > b + e
        ) {

            // =====================================
            // RECTANGLE 1 - BOTTOM FLANGE
            // =====================================

            const A1 = a * b;

            // Centroid measured from bottom
            const y1 = b / 2;

            // MOA about its own centroidal horizontal axis
            const I1 = (a * Math.pow(b, 3)) / 12;


            // =====================================
            // RECTANGLE 2 - WEB
            // =====================================

            const webHeight = c - e - b;

            const A2 = d * webHeight;

            // Centroid measured from bottom
            const y2 = b + webHeight / 2;

            // MOA about its own centroidal horizontal axis
            const I2 = (d * Math.pow(webHeight, 3)) / 12;


            // =====================================
            // RECTANGLE 3 - TOP FLANGE
            // =====================================

            const A3 = f * e;

            // Centroid measured from bottom
            const y3 = c - e / 2;

            // MOA about its own centroidal horizontal axis
            const I3 = (f * Math.pow(e, 3)) / 12;


            // =====================================
            // CENTROID OF WHOLE C-SECTION
            // =====================================

            const yBar =
                (A1 * y1 + A2 * y2 + A3 * y3) /
                (A1 + A2 + A3);


            // =====================================
            // PARALLEL AXIS THEOREM
            // =====================================

            const I1_total =
                I1 + A1 * Math.pow(y1 - yBar, 2);

            const I2_total =
                I2 + A2 * Math.pow(y2 - yBar, 2);

            const I3_total =
                I3 + A3 * Math.pow(y3 - yBar, 2);


            // =====================================
            // TOTAL SECOND MOMENT OF AREA
            // =====================================

            I = I1_total + I2_total + I3_total;
        }
    }

    // Custom Section
    else if (sectionType === "custom") {

        const customI = parseFloat(
            document.getElementById("customInertia")?.value
        );

        if (customI > 0) {
            I = customI;
        }
    }

    // Display result
    if (I !== null && isFinite(I) && I > 0) {

        result.textContent =
            I.toLocaleString("en-US", {
                maximumFractionDigits: 2
            }) + " mm⁴";

    } else {

        result.textContent = "--";
    }
}

