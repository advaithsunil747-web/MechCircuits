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
   GEAR GENERATOR
=========================== */

const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");
let zoom = 1;

let panX = 0;
let panY = 0;

let gears = [];

let selectedGear = null;

let isGearTrainRunning = false;
let lastAnimationTime = null;
let animationFrameId = null;

let runningGear = null;

let editingGearIndex = null;

let isDragging = false;

let isDraggingGear = false;

let lastMouseX = 0;
let lastMouseY = 0;

const MESH_DISTANCE_TOLERANCE = 10;
const CLEARANCE_RATIO = 0.03;
const MODULE_TOLERANCE = 0.001;

/* ===========================
   SIDEBAR AND MODAL ELEMENTS
=========================== */


const addGearButton =
    document.getElementById("addGearButton");

const gearList =
    document.getElementById("gearList");

const gearModalOverlay =
    document.getElementById("gearModalOverlay");

const deleteGearButton =
    document.getElementById("deleteGear");

const cancelGearButton =
    document.getElementById("cancelGear");

const generateGearButton =
    document.getElementById("generateGear");

const gearSpeedInput =
    document.getElementById(
        "gearSpeedInput"
    );


const gearTorqueInput =
    document.getElementById(
        "gearTorqueInput"
    );


const runGearTrainButton =
    document.getElementById(
        "runGearTrainButton"
    );

const stopGearTrainButton =
    document.getElementById(
        "stopGearTrainButton"
    );

const gearParameterSelect =
    document.getElementById(
        "gearParameterSelect"
    );

const outputGearSelect =
    document.getElementById(
        "outputGearSelect"
    );

const outputSpeed =
    document.getElementById(
        "outputSpeed"
    );


const outputTorque =
    document.getElementById(
        "outputTorque"
    );


/* ===========================
   GEAR INPUTS
=========================== */


const gearTeethInput =
    document.getElementById("gearTeeth");


const gearModuleInput =
    document.getElementById("gearModule");


const gearPitchDiameterInput =
    document.getElementById("gearPitchDiameter");


const gearPressureAngleInput =
    document.getElementById("gearPressureAngle");


gearTeethInput.addEventListener("blur", function(){

    if(Number(this.value) < 14){

        this.value = 14;

    }

});


function getGearAtPosition(mouseX, mouseY){

    /*
    Convert screen coordinates
    into world coordinates
    */

    const worldX =
        (mouseX - panX) / zoom;


    const worldY =
        (mouseY - panY) / zoom;


    /*
    Check from topmost gear
    to bottommost gear
    */

    for(

        let i = gears.length - 1;

        i >= 0;

        i--

    ){

        const gear =
            gears[i];


        const dx =
            worldX - gear.x;


        const dy =
            worldY - gear.y;


        const distance =
            Math.sqrt(

                dx * dx
                +
                dy * dy

            );


        /*
        ===========================
        ACTUAL GEAR OUTER RADIUS
        ===========================
        */


        /*
        Pitch radius:
        (module × teeth) / 2
        */

        const pitchRadius =
            (
                gear.module *
                gear.teeth
            ) / 2;


        /*
        Standard addendum:
        1 × module
        */

        const addendum =
            gear.module;


        /*
        Outside radius
        */

        const outerRadius =
            pitchRadius +
            addendum;


        /*
        Check whether the mouse
        is inside the gear
        */

        if(

            distance <= outerRadius

        ){

            return gear;

        }

    }


    return null;

}


/* ===========================
   GEAR PARAMETER CALCULATIONS
=========================== */


function updateGearParameters(changedParameter){

    const teeth =
        Number(gearTeethInput.value);


    const module =
        Number(gearModuleInput.value);


    const pitchDiameter =
        Number(gearPitchDiameterInput.value);

    const pressureAngle = 20

    /*
    USER CHANGED NUMBER OF TEETH
    KEEP MODULE SAME
    CHANGE PITCH DIAMETER
    */

    if(
        changedParameter === "teeth"
    ){

        if(
            teeth > 0 &&
            module > 0
        ){

            gearPitchDiameterInput.value =
                (
                    teeth * module
                ).toFixed(2);

        }

    }


    /*
    USER CHANGED PITCH DIAMETER
    KEEP MODULE SAME
    CHANGE NUMBER OF TEETH
    */

    else if(
    changedParameter ===
    "pitchDiameter"
){

    if(
        pitchDiameter > 0 &&
        teeth > 0
    ){

        gearModuleInput.value =
            (
                pitchDiameter / teeth
            ).toFixed(2);

    }

}


    /*
    USER CHANGED MODULE
    KEEP NUMBER OF TEETH SAME
    CHANGE PITCH DIAMETER
    */

    else if(
        changedParameter === "module"
    ){

        if(
            teeth > 0 &&
            module > 0
        ){

            gearPitchDiameterInput.value =
                (
                    teeth * module
                ).toFixed(2);

        }

    }

}


gearTeethInput.addEventListener(
    "blur",
    function(){

        if(
            this.value !== "" &&
            Number(this.value) < 14
        ){

            this.value = "";

        }

    }
);

gearPitchDiameterInput.addEventListener(
    "input",
    function(){

        updateGearParameters(
            "pitchDiameter"
        );

    }
);


gearModuleInput.addEventListener(
    "input",
    function(){

        updateGearParameters(
            "module"
        );

    }
);

/* ===========================
   RESIZE CANVAS
=========================== */

function resizeCanvas(){

    const canvasArea =
        document.querySelector(".canvas-area");


    canvas.width =
        canvasArea.clientWidth;


    canvas.height =
        canvasArea.clientHeight;
    redrawCanvas();

}


window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();


createDefaultGear();

/* ===========================
   ADD NEW GEAR
=========================== */


addGearButton.addEventListener(
    "click",
    function(){

        /*
        null means we are creating
        a completely new gear
        */

        editingGearIndex = null;


        /*
        Clear the input fields
        */

        gearTeethInput.value = "";

        gearModuleInput.value = "";

        gearPitchDiameterInput.value = "";

        gearPressureAngleInput.value = "20";

        deleteGearButton.style.display =
        "none";

        /*
        Open modal
        */

        gearModalOverlay.classList.add(
            "active"
        );

    }
);

/* ===========================
   CANCEL BUTTON
=========================== */


cancelGearButton.addEventListener(
    "click",
    function(){

        gearModalOverlay.classList.remove(
            "active"
        );

    }
);

/* ===========================
   GENERATE / UPDATE GEAR
=========================== */


generateGearButton.addEventListener(

    "click",

    function(){

        const teethValue =
            Number(
                gearTeethInput.value
            );


        const moduleValue =
            Number(
                gearModuleInput.value
            );


        const pitchDiameterValue =
            Number(
                gearPitchDiameterInput.value
            );


        /*
        ===========================
        CHECK MODULE
        ===========================
        */

        if(
            moduleValue <= 0 ||
            isNaN(moduleValue)
        ){

            alert(
                "Please enter a valid Module."
            );

            return;

        }


        /*
        ===========================
        CALCULATE MISSING TEETH
        ===========================
        */

        if(

            gearTeethInput.value === ""

        ){

            /*
            Teeth =
            Pitch Diameter / Module
            */


            if(

                pitchDiameterValue <= 0 ||
                isNaN(pitchDiameterValue)

            ){

                alert(

                    "Please enter a valid Pitch Diameter."

                );

                return;

            }


            const calculatedTeeth =

                pitchDiameterValue /
                moduleValue;


            /*
            Check if teeth
            is a whole number
            */


            if(

                !Number.isInteger(
                    calculatedTeeth
                )

            ){

                alert(

                    "Not possible: The number of teeth must be a whole number."

                );

                return;

            }


            /*
            Check minimum teeth
            */


            if(

                calculatedTeeth < 14

            ){

                alert(

                    "Not possible: Minimum number of teeth is 14."

                );

                return;

            }


            /*
            Automatically insert
            calculated number of teeth
            */


            gearTeethInput.value =

                calculatedTeeth;


        }


        /*
        ===========================
        USER ENTERED TEETH
        ===========================
        */

        else{


            /*
            Check if teeth
            is a whole number
            */


            if(

                !Number.isInteger(
                    teethValue
                )

            ){

                alert(

                    "Not possible: Number of teeth must be a whole number."

                );

                return;

            }


            /*
            Check minimum teeth
            */


            if(

                teethValue < 14

            ){

                alert(

                    "Not possible: Minimum number of teeth is 14."

                );

                return;

            }

        }


        /*
        ===========================
        CREATE GEAR DATA
        ===========================
        */


        const gearData = {

            name:
                editingGearIndex === null
                ? "Gear " + (gears.length + 1)
                : gears[editingGearIndex].name,

            teeth:
                Number(
                    gearTeethInput.value
                ),

            module:
                Number(
                    gearModuleInput.value
                ),

            pitchDiameter:
                Number(
                    gearPitchDiameterInput.value
                ),

            pressureAngle:
                Number(
                    gearPressureAngleInput.value
                ),
            speed: 0,

            x: 0,

            y: 0,

            rotation: 0

        };


        /*
        ===========================
        CREATE NEW GEAR
        ===========================
        */


        if(

            editingGearIndex === null

        ){

            gearData.x =

                canvas.width / 2;


            gearData.y =

                canvas.height / 2;


            gears.push(

                gearData

            );

            updateGearParameterDropdown();


            selectedGear =

                gears[
                    gears.length - 1
                ];

        }


        /*
        ===========================
        UPDATE EXISTING GEAR
        ===========================
        */


        else{


            /*
            Preserve old position
            */


            gearData.x =

                gears[
                    editingGearIndex
                ].x;


            gearData.y =

                gears[
                    editingGearIndex
                ].y;


            gears[
                editingGearIndex
            ] =

                gearData;


            selectedGear =

                gearData;

        }


        /*
        ===========================
        UPDATE SIDEBAR
        ===========================
        */


        renderGearList();


        /*
        ===========================
        CLOSE MODAL
        ===========================
        */


        gearModalOverlay.classList.remove(

            "active"

        );


        /*
        ===========================
        REDRAW CANVAS
        ===========================
        */


        redrawCanvas();


    }

);

deleteGearButton.addEventListener(
    "click",
    function(){

        if(
            editingGearIndex === null
        ){

            return;

        }


        gears.splice(

            editingGearIndex,

            1

        );


/*
===========================
RENUMBER REMAINING GEARS
===========================
*/

gears.forEach(function(gear, index){

    gear.name =
        "Gear " +
        (index + 1);

});

        updateGearParameterDropdown();


        selectedGear =
            null;


        editingGearIndex =
            null;


        renderGearList();


        redrawCanvas();


        gearModalOverlay.classList.remove(
            "active"
        );

    }
);

/* ===========================
   RENDER GEAR LIST
=========================== */


function renderGearList(){


    /*
    Clear old list
    */

    gearList.innerHTML = "";


    /*
    Create an item for each gear
    */

    gears.forEach(
        function(gear, index){


            const gearItem =
                document.createElement(
                    "div"
                );


            gearItem.className =
                "gear-item";


            gearItem.textContent =
                "Gear " +
                (index + 1);


            /*
            Highlight selected gear
            */

            if(
                gear === selectedGear
            ){

                gearItem.classList.add(
                    "selected"
                );

            }


            /*
            Open editor when clicked
            */

            gearItem.addEventListener(
                "click",
                function(){

                    openGearEditor(
                        index
                    );

                }
            );


            gearList.appendChild(
                gearItem
            );

        }
    );

}


function updateGearParameterDropdown(){

    /*
    ===========================
       INPUT GEAR DROPDOWN
    ===========================
    */

    const gearSelect =
        document.getElementById(
            "gearParameterSelect"
        );


    gearSelect.innerHTML = "";


    const inputDefaultOption =
        document.createElement(
            "option"
        );


    inputDefaultOption.value =
        "";


    inputDefaultOption.textContent =
        "Select Gear";


    gearSelect.appendChild(
        inputDefaultOption
    );


    /*
    ===========================
       OUTPUT GEAR DROPDOWN
    ===========================
    */

    outputGearSelect.innerHTML = "";


    const outputDefaultOption =
        document.createElement(
            "option"
        );


    outputDefaultOption.value =
        "";


    outputDefaultOption.textContent =
        "Select Gear";


    outputGearSelect.appendChild(
        outputDefaultOption
    );


    /*
    ===========================
       ADD ALL GEARS
    ===========================
    */

    gears.forEach(

        function(gear, index){

            /*
            INPUT OPTION
            */

            const inputOption =
                document.createElement(
                    "option"
                );


            inputOption.value =
                index;


            inputOption.textContent =
                gear.name;


            gearSelect.appendChild(
                inputOption
            );


            /*
            OUTPUT OPTION
            */

            const outputOption =
                document.createElement(
                    "option"
                );


            outputOption.value =
                index;


            outputOption.textContent =
                gear.name;


            outputGearSelect.appendChild(
                outputOption
            );

        }

    );

}


gearParameterSelect.addEventListener(
    "change",
    function(){

        const selectedIndex =
            Number(
                this.value
            );


        if(
            this.value === ""
        ){

            return;

        }


        const selectedGearForParameter =
            gears[selectedIndex];


        console.log(
            "Selected gear:",
            selectedGearForParameter.name
        );

    }
);

outputGearSelect.addEventListener(
    "change",
    function(){

        if(
            this.value === ""
        ){

            return;

        }


        const selectedOutputIndex =
            Number(
                this.value
            );


        const selectedOutputGear =
            gears[
                selectedOutputIndex
            ];


        console.log(
            "Selected output gear:",
            selectedOutputGear.name
        );

        updateOutputValues();
    }
);


runGearTrainButton.addEventListener(

    "click",

    function(){

        if(
            gearParameterSelect.value === ""
        ){

            alert(
                "Please select an input gear."
            );

            return;

        }


        const speed =
            Number(
                gearSpeedInput.value
            );
        const torque =
            Number(
                gearTorqueInput.value
            );


        if(
            isNaN(speed)
            ||
            speed === 0
        ){

            alert(
                "Please enter a valid speed."
            );

            return;

        }

        if(

            isNaN(torque)
            ||
            torque === 0

        ){

            alert(
                "Please enter a valid torque."
            );

            return;

        }


        const selectedIndex =
            Number(
                gearParameterSelect.value
            );


        /*
        Stop the previous input gear
        */

        if(
            runningGear !== null
        ){

            runningGear.speed = 0;

        }


        /*
        Set new running gear
        */

        runningGear =
            gears[selectedIndex];


        runningGear.inputSpeed =
            speed;


        runningGear.inputTorque =
            torque;


        runningGear.speed =
            speed;

        updateMeshedGearSpeeds();


        /*
        Start simulation
        */

        isGearTrainRunning =
            true;


        if(
            animationFrameId === null
        ){

            lastAnimationTime =
                null;


            animationFrameId =
                requestAnimationFrame(
                    animateGearTrain
                );

        }

    }

);

stopGearTrainButton.addEventListener(

    "click",

    function(){

        /*
        Stop all gears
        */

        gears.forEach(function(gear){

            gear.speed = 0;

        });


        /*
        Remove active running gear
        */

        runningGear =
            null;


        /*
        Stop animation
        */

        isGearTrainRunning =
            false;


        /*
        Cancel animation frame
        */

        if(
            animationFrameId !== null
        ){

            cancelAnimationFrame(
                animationFrameId
            );

        }


        animationFrameId =
            null;


        lastAnimationTime =
            null;


        /*
        Redraw final stopped position
        */

        redrawCanvas();

    }

);


/* ===========================
   EDIT EXISTING GEAR
=========================== */

function openGearEditor(index){

    const gear = gears[index];

    editingGearIndex = index;

    selectedGear = gear;

    gearTeethInput.value = gear.teeth;
    gearModuleInput.value = gear.module;
    gearPitchDiameterInput.value = gear.pitchDiameter;
    gearPressureAngleInput.value = 20;
    deleteGearButton.style.display ="block";
    gearModalOverlay.classList.add("active");

    renderGearList();

}

/* ===========================
   DRAW GEAR
=========================== */


function drawGear(

    x,
    y,
    module,
    teeth,
    rotation = 0,
    name = ""

){

    ctx.save();


    /*
    ===========================
       WORLD TRANSFORMATION
    ===========================
    */

    /*
    First move the world origin
    according to pan and zoom
    */

    ctx.translate(panX, panY);

    ctx.scale(zoom, zoom);

    ctx.translate(x, y);

    ctx.rotate(rotation);


    /*
    ===========================
       GEAR DIMENSIONS
    ===========================
    */

    const pitchRadius =

        (
            module *
            teeth
        ) / 2;


    const addendum =

        module;


    const dedendum =

        module *
        1.25;


    const outerRadius =

        pitchRadius +
        addendum;


    const rootRadius =

        pitchRadius -
        dedendum;


    /*
    ===========================
       TOOTH ANGLES
    ===========================
    */

    const toothAngle =

        (
            Math.PI *
            2
        ) / teeth;


    const toothSideAngle = toothAngle * 0.20;
    const toothTopAngle = toothAngle * 0.35;


    /*
    ===========================
       DRAW GEAR
    ===========================
    */

    ctx.beginPath();


    for(

        let i = 0;

        i < teeth;

        i++

    ){

        const angle =

            i *
            toothAngle;


        /*
        ROOT BEFORE TOOTH
        */

        ctx.lineTo(

            Math.cos(angle)
            *
            rootRadius,

            Math.sin(angle)
            *
            rootRadius

        );


        /*
        TOOTH RISE
        */

        ctx.lineTo(

            Math.cos(

                angle +
                toothSideAngle

            )
            *
            outerRadius,

            Math.sin(

                angle +
                toothSideAngle

            )
            *
            outerRadius

        );


        /*
        TOOTH TOP
        */

        ctx.lineTo(

            Math.cos(

                angle +
                toothSideAngle +
                toothTopAngle

            )
            *
            outerRadius,

            Math.sin(

                angle +
                toothSideAngle +
                toothTopAngle

            )
            *
            outerRadius

        );


        /*
        TOOTH DESCENT
        */

        ctx.lineTo(

            Math.cos(

                angle +
                toothSideAngle +
                toothTopAngle +
                toothSideAngle

            )
            *
            rootRadius,

            Math.sin(

                angle +
                toothSideAngle +
                toothTopAngle +
                toothSideAngle

            )
            *
            rootRadius

        );


        /*
        GAP
        */

        ctx.lineTo(

            Math.cos(

                angle +
                toothAngle

            )
            *
            rootRadius,

            Math.sin(

                angle +
                toothAngle

            )
            *
            rootRadius

        );

    }


    ctx.closePath();


    /*
    ===========================
       GEAR BODY
    ===========================
    */

    ctx.fillStyle =

        "#b7b7b7";


    ctx.fill();


    /*
    ===========================
       BORDER
    ===========================
    */

    ctx.strokeStyle =

        "#012043";


    /*
    Because the whole world
    is scaled by zoom, compensate
    line width
    */

    ctx.lineWidth =

        2 / zoom;


    ctx.stroke();


    /*
    ===========================
       CENTER HOLE
    ===========================
    */

    ctx.beginPath();


    ctx.arc(

        0,

        0,

        module * 2,

        0,

        Math.PI * 2

    );


    ctx.fillStyle =

        "white";


    ctx.fill();


ctx.stroke();


/*
===========================
   GEAR NAME
===========================
*/

const nameRadius =
    outerRadius - module * 10;


ctx.save();


/*
Keep text horizontal
even when the gear rotates
*/

ctx.rotate(
    -rotation
);


ctx.fillStyle =
    "#012043";


ctx.font =
    `${18 / zoom}px Arial`;


ctx.textAlign =
    "center";


ctx.textBaseline =
    "middle";


ctx.fillText(

    name,

    0,

    -nameRadius

);


ctx.restore();


/*
Restore the original
world transformation
*/

ctx.restore();

}



/* ===========================
   REDRAW CANVAS
=========================== */


function redrawCanvas(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    gears.forEach(function(gear){

        drawGear(

            gear.x,
            gear.y,
            gear.module,
            gear.teeth,
            gear.rotation,
            gear.name

        );

    });

}

/* ===========================
   CREATE DEFAULT GEAR
=========================== */

function createDefaultGear(){

    const defaultGear = {

        name: "Gear 1",

        teeth: 40,

        module: 5,

        pitchDiameter: 200,

        pressureAngle: 20,

        rotation: 0,

        speed: 0,

        x: canvas.width / 2,

        y: canvas.height / 2

    };


    gears.push(defaultGear);


    selectedGear = defaultGear;

    updateGearParameterDropdown();


    renderGearList();


    redrawCanvas();

}

/* ===========================
   AUTOMATIC GEAR MESHING
=========================== */

function tryMeshGear(movingGear){

    /*
    Check every other gear
    */

    for(let i = 0; i < gears.length; i++){

        const otherGear = gears[i];


        /*
        Do not compare the gear
        with itself
        */

        if(otherGear === movingGear){

            continue;

        }


        /*
        Gears must have
        the same module
        */

        if(
            Math.abs(
                movingGear.module -
                otherGear.module
            )
            >
            MODULE_TOLERANCE
        ){

            continue;

        }


        /*
        ===========================
        PITCH RADII
        ===========================
        */

        const movingPitchRadius =
            (
                movingGear.module *
                movingGear.teeth
            ) / 2;


        const otherPitchRadius =
            (
                otherGear.module *
                otherGear.teeth
            ) / 2;


        /*
        ===========================
        CURRENT DISTANCE
        ===========================
        */

        const dx =
            movingGear.x -
            otherGear.x;


        const dy =
            movingGear.y -
            otherGear.y;


        const currentDistance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        /*
        Correct center distance
        for two external gears
        */
        const smallerPitchDiameter =
            Math.min(
                movingGear.module *
                movingGear.teeth,

                otherGear.module *
                otherGear.teeth
            );


        const clearance =
            smallerPitchDiameter *
            CLEARANCE_RATIO;


        const requiredDistance =
            movingPitchRadius +
            otherPitchRadius +
            clearance;

        /*
        Only mesh when the gears
        are already close enough
        */

        if(

            Math.abs(
                currentDistance -
                requiredDistance
            )
            >
            MESH_DISTANCE_TOLERANCE

        ){

            continue;

        }


        /*
        ===========================
        FIND DIRECTION
        ===========================
        */

        let angle =
            Math.atan2(
                movingGear.y - otherGear.y,
                movingGear.x - otherGear.x
            );


        /*
        ===========================
        SNAP CENTER DISTANCE
        ===========================
        */

        movingGear.x =
            otherGear.x +
            Math.cos(angle) *
            requiredDistance;


        movingGear.y =
            otherGear.y +
            Math.sin(angle) *
            requiredDistance;


        /*
        ===========================
        TOOTH-GAP ALIGNMENT
        ===========================
        */

        alignGearTeeth(
            movingGear,
            otherGear,
            angle
        );


        return;

    }

}

/* ===========================
   ALIGN TOOTH WITH GAP
=========================== */

function alignGearTeeth(
    movingGear,
    fixedGear,
    centerAngle
){

    /*
    ===========================
    MOVING GEAR TOOTH PITCH
    ===========================
    */

    const movingToothAngle =
        (Math.PI * 2) /
        movingGear.teeth;


    /*
    ===========================
    FIXED GEAR TOOTH PITCH
    ===========================
    */

    const fixedToothAngle =
        (Math.PI * 2) /
        fixedGear.teeth;


    /*
    ===========================
    CONTACT ANGLE
    ===========================
    */

    /*
    Direction from fixed gear
    toward moving gear
    */

    const movingContactAngle =
        centerAngle + Math.PI;


    /*
    ===========================
    FIXED GEAR TOOTH/GAP
    ===========================
    */

    /*
    The fixed gear's tooth starts at
    its rotation angle.

    We want the moving gear tooth
    to sit approximately halfway
    between two fixed gear teeth.
    */

    const fixedGapCenter =

        fixedGear.rotation
        +
        fixedToothAngle / 2;


    /*
    ===========================
    DESIRED MOVING GEAR ROTATION
    ===========================
    */

    const desiredRotation =

        movingContactAngle
        -
        fixedGapCenter;


    /*
    ===========================
    SNAP TO NEAREST TOOTH
    ===========================
    */

    const toothIndex =

        Math.round(

            desiredRotation /
            movingToothAngle

        );


    movingGear.rotation =

        toothIndex *
        movingToothAngle
        +
        movingContactAngle
        -
        fixedGapCenter;

}


/* ===========================
   CANVAS PANNING
=========================== */

/* ===========================
   MOUSE DOWN
=========================== */

canvas.addEventListener(

    "mousedown",

    function(event){

        const rect =
            canvas.getBoundingClientRect();


        const mouseX =
            event.clientX
            -
            rect.left;


        const mouseY =
            event.clientY
            -
            rect.top;


        const clickedGear =
            getGearAtPosition(

                mouseX,

                mouseY

            );


        lastMouseX =
            mouseX;


        lastMouseY =
            mouseY;


        if(clickedGear){

            /*
            A gear was clicked
            */

            isDraggingGear =
                true;


            isDragging =
                false;


            selectedGear =
                clickedGear;


        }

        else{

            /*
            Empty canvas was clicked
            */

            isDragging =
                true;


            isDraggingGear =
                false;


            selectedGear =
                null;

        }


        canvas.style.cursor =
            "grabbing";

    }

);


/* ===========================
   MOUSE MOVE
=========================== */

canvas.addEventListener(

    "mousemove",

    function(event){

        const rect =
            canvas.getBoundingClientRect();


        const mouseX =
            event.clientX
            -
            rect.left;


        const mouseY =
            event.clientY
            -
            rect.top;


        const movementX =
            mouseX
            -
            lastMouseX;


        const movementY =
            mouseY
            -
            lastMouseY;


        /*
        MOVE INDIVIDUAL GEAR
        */

        if(

            isDraggingGear
            &&
            selectedGear

        ){

            selectedGear.x +=
                movementX / zoom;


            selectedGear.y +=
                movementY / zoom;


            /*
            Try to automatically mesh
            with another compatible gear
            */

            tryMeshGear(
                selectedGear
            );


            redrawCanvas();

        }


        /*
        PAN ENTIRE CANVAS
        */

        else if(

            isDragging

        ){

            panX +=
                movementX;


            panY +=
                movementY;


            redrawCanvas();

        }


        lastMouseX =
            mouseX;


        lastMouseY =
            mouseY;

    }

);


/* ===========================
   MOUSE UP
=========================== */

canvas.addEventListener(

    "mouseup",

    function(){

        isDragging =false;

        isDraggingGear =false;

        selectedGear =null;


        canvas.style.cursor =
            "grab";

    }

);


/* ===========================
   MOUSE LEAVE
=========================== */

canvas.addEventListener(

    "mouseleave",

    function(){

        isDragging =
            false;


        isDraggingGear =
            false;


        selectedGear =
            null;

        canvas.style.cursor =
            "grab";

    }

);

canvas.addEventListener(

    "wheel",

    function(event){

        event.preventDefault();


        const rect =
            canvas.getBoundingClientRect();


        const mouseX =
            event.clientX
            -
            rect.left;


        const mouseY =
            event.clientY
            -
            rect.top;


        /*
        World position under
        the mouse before zooming
        */

        const worldX =
            (
                mouseX - panX
            )
            /
            zoom;


        const worldY =
            (
                mouseY - panY
            )
            /
            zoom;


        /*
        Change zoom
        */

        const zoomFactor =
            event.deltaY < 0
            ? 1.1
            : 0.9;


        const newZoom =
            Math.max(

                0.2,

                Math.min(

                    zoom * zoomFactor,

                    50

                )

            );


        /*
        Keep the point under
        the mouse stationary
        */

        panX =
            mouseX
            -
            worldX * newZoom;


        panY =
            mouseY
            -
            worldY * newZoom;


        zoom =
            newZoom;


        redrawCanvas();

    }

);

function updateMeshedGearSpeeds(){

    /*
    First stop every gear
    */

    gears.forEach(function(gear){

        gear.speed = 0;

    });


    /*
    No driving gear
    */

    if(runningGear === null){

        return;

    }


    /*
    The running gear is the input gear
    */

    runningGear.speed =
        runningGear.inputSpeed;


    /*
    Store already processed gears
    */

    const processedGears =
        new Set();


    processedGears.add(
        runningGear
    );


    /*
    Start calculating from
    the running gear
    */

    propagateGearSpeed(
        runningGear,
        processedGears
    );

}

function propagateGearSpeed(
    drivingGear,
    processedGears
){

    /*
    Check every other gear
    */

    gears.forEach(function(drivenGear){

        /*
        Do not compare gear with itself
        */

        if(
            drivenGear === drivingGear
        ){

            return;

        }


        /*
        Do not process the same gear twice
        */

        if(
            processedGears.has(
                drivenGear
            )
        ){

            return;

        }


        /*
        Check whether the gears
        are actually meshed
        */

        const isMeshed =
            areGearsMeshed(
                drivingGear,
                drivenGear
            );


        if(
            !isMeshed
        ){

            return;

        }


        /*
        ===========================
        GEAR RATIO
        ===========================
        */

        drivenGear.speed =

            -drivingGear.speed
            *
            drivingGear.teeth
            /
            drivenGear.teeth;


        /*
        Mark this gear as processed
        */

        processedGears.add(
            drivenGear
        );


        /*
        Continue through the gear train
        */

        propagateGearSpeed(
            drivenGear,
            processedGears
        );

    });

}

function areGearsMeshed(
    gearA,
    gearB
){

    /*
    ===========================
    SAME MODULE
    ===========================
    */

    if(

        Math.abs(

            gearA.module -
            gearB.module

        )
        >
        MODULE_TOLERANCE

    ){

        return false;

    }


    /*
    ===========================
    PITCH RADII
    ===========================
    */

    const radiusA =

        (
            gearA.module *
            gearA.teeth
        )
        /
        2;


    const radiusB =

        (
            gearB.module *
            gearB.teeth
        )
        /
        2;


    /*
    ===========================
    DISTANCE BETWEEN CENTERS
    ===========================
    */

    const dx =
        gearA.x -
        gearB.x;


    const dy =
        gearA.y -
        gearB.y;


    const distance =

        Math.sqrt(

            dx * dx +
            dy * dy

        );


    /*
    ===========================
    REQUIRED MESH DISTANCE
    ===========================
    */

    const smallerPitchDiameter =
        Math.min(

            gearA.module *
            gearA.teeth,

            gearB.module *
            gearB.teeth

        );


    const clearance =
        smallerPitchDiameter *
        CLEARANCE_RATIO;


    const requiredDistance =

        radiusA +
        radiusB +
        clearance;


    /*
    ALLOW SMALL POSITION TOLERANCE
    */

    return Math.abs(

        distance -
        requiredDistance

    )
    <=
    MESH_DISTANCE_TOLERANCE;

}


function animateGearTrain(timestamp){

    /*
    ===========================
    FIRST FRAME
    ===========================
    */

    if(
        lastAnimationTime === null
    ){

        lastAnimationTime =
            timestamp;

    }


    /*
    ===========================
    TIME DIFFERENCE
    ===========================
    */

    const deltaTime =
        (
            timestamp -
            lastAnimationTime
        )
        /
        1000;


    lastAnimationTime =
        timestamp;


    /*
    ===========================
    ROTATE ALL GEARS
    THAT HAVE A SPEED
    ===========================
    */

    gears.forEach(

        function(gear){

            if(
                gear.speed
            ){

                const angularVelocity =
                    gear.speed *
                    Math.PI *
                    2
                    /
                    60;


                gear.rotation +=
                    angularVelocity *
                    deltaTime;

            }

            updateOutputValues();
        }

    );

    


    /*
    ===========================
    REDRAW
    ===========================
    */

    redrawCanvas();


    /*
    CONTINUE ANIMATION
    */

    if(
        isGearTrainRunning
    ){

        animationFrameId =
            requestAnimationFrame(
                animateGearTrain
            );

    }

    else{

        animationFrameId =
            null;

    }

}

function updateOutputValues(){

    /*
    No output gear selected
    */

    if(

        outputGearSelect.value === ""

    ){

        outputSpeed.value = "";

        outputTorque.value = "";

        return;

    }


    /*
    No running gear
    */

    if(

        runningGear === null

    ){

        outputSpeed.value = "";

        outputTorque.value = "";

        return;

    }


    const selectedOutputIndex =
        Number(
            outputGearSelect.value
        );


    const selectedOutputGear =
        gears[
            selectedOutputIndex
        ];


    /*
    ===========================
       OUTPUT SPEED
    ===========================
    */

    const speed =
        selectedOutputGear.speed;


    /*
    ===========================
       OUTPUT TORQUE
    ===========================
    */

    const torque =

        runningGear.inputTorque
        *
        runningGear.teeth
        /
        selectedOutputGear.teeth;


    /*
    ===========================
       DISPLAY RESULTS
    ===========================
    */

    outputSpeed.value =
        speed.toFixed(2)
        +
        " rpm";


    outputTorque.value =
        torque.toFixed(2)
        +
        " N.m";

}