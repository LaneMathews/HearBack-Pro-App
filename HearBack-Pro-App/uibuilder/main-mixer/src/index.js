/* jshint browser: true, esversion: 6, asi: true */
/* globals uibuilder */
// @ts-nocheck

/** Minimalist code for UIBuilder and Node-RED */

// Return formatted HTML version of JSON object
function syntaxHighlight(json) {
    json = JSON.stringify(json, undefined, 4)
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number'
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key'
            } else {
                cls = 'string'
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean'
        } else if (/null/.test(match)) {
            cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
    })
    return json
} 
// --- End of syntaxHighlight --- //

// jQuery scripting to handle bottom row button visual functionality
$(document).ready(function(){
    
    $("#channelTable").show()
    $("#submixTable").hide()
    $("#newSub").hide()
    
    if ($("#pan").prop("checked") == false) {
        for (let i = 1; i <= 16; i++) {
            let name = "#panknob" + i.toString()
            let widthName = "#widthknob" + i.toString()
            $(name).hide()
            $(widthName).hide()
        }
        $("#log2").html("VOLUME")
    }
    if ($("#aux").prop("checked") == false) {
        $("#masteraux").hide()
    }
            
    // Function to change Preset # when Preset button is clicked
    $("#preset").click(function(){
        
        // If switching from Preset 1 to Preset 2
        if ($("#presetCheck1").prop("checked") == true) {
            
            // Light up Preset 2 indicator
            $("#presetCheck2").prop("checked", true);
            
            // Uncheck the Preset checkbox (Because its not a button)
            $("#preset").prop("checked", false);
            
            // Send message to Store Preset 1
            uibuilder.send({"topic": "presetSetting", "payload": "0x25"})
            
            // Send message to recall Preset 2
            uibuilder.send({"topic": "presetSetting", "payload": "0x22"})
        }
        
        // If switching from Preset 2 to Preset 3
        else if ($("#presetCheck2").prop("checked") == true) {
            
            // Light up Preset 3 indicator
            $("#presetCheck3").prop("checked", true);
            
            // Uncheck the Preset checkbox (Because its not a button)
            $("#preset").prop("checked", false);
            
            // Send message to Store Preset 2
            uibuilder.send({"topic": "presetSetting", "payload": "0x26"})
            
            // Send message to Recall Preset 3
            uibuilder.send({"topic": "presetSetting", "payload": "0x23"})
        }
        
        // If switching from Preset 3 to Preset 4
        else if ($("#presetCheck3").prop("checked") == true) {
            
            // Light up Preset 4 indicator
            $("#presetCheck4").prop("checked", true);
            
            // Uncheck the Preset checkbox (Because its not a button)
            $("#preset").prop("checked", false);
            
            // Send message to Store Preset 3
            uibuilder.send({"topic": "presetSetting", "payload": "0x27"})
            
            // Send message to Recall Preset 4
            uibuilder.send({"topic": "presetSetting", "payload": "0x24"})
        }
        
        // If switching from Preset 4 back to Preset 1
        else if ($("#presetCheck4").prop("checked") == true) {
            
            // Light up Preset 1 indicator
            $("#presetCheck1").prop("checked", true);
            
            // Uncheck the Preset checkbox (Because its not a button)
            $("#preset").prop("checked", false);
            
            // Send message to Store Preset 4
            uibuilder.send({"topic": "presetSetting", "payload": "0x28"})
            
            // Send message to Recall Preset 1
            uibuilder.send({"topic": "presetSetting", "payload": "0x21"})
        }
    });
           
    // If Enter key is pressed while editing Mixer Name 
    // Send the Mixer Name out 
    $("#mixername").keyup(function(event) {
        
        // Defines Enter key as key to check
        if (event.which == 13) {
            uibuilder.send({"topic": "mixerName", "payload": this.value})
        }
    })        
    
    // If Channel Assignments tab is selected
    // Make Channel Assignments tab active and
    // Edit Submixes inactive
    $("#tabLink1").click(function() {
        $(this).toggleClass("active")
        $("#tabLink2").toggleClass("active")
        $("#submixTable").hide()
        $("#newSub").hide()
        $("#channelTable").show()
    })
    
    // If Edit Submixes tab is selected
    // Make Channel Assignments tab inactive and
    // Edit Submixes active
    $("#tabLink2").click(function() {
        $(this).toggleClass("active")
        $("#tabLink1").toggleClass("active")
        $("#channelTable").hide()
        $("#newSub").show()
        $("#submixTable").show()
    })

    // Function to reflect Master knob has become Aux knob
    // When Aux mode is engaged
    $("#aux").click(function(){
        
        if (this.checked == true) {
            $("#mastertext").html("AUX")
            $("#masterfader").hide()
            $("#masteraux").show()
        }
        
        if (this.checked == false) {
            $("#mastertext").html("MASTER")
            $("#masteraux").hide()
            $("#masterfader").show()
        }
        
    });
    
    // Sets outgoing message topics for each Channel Knobs
    // Volume Level to default "Level" + Knob Number
    for (let i = 1; i <= 16; i++) {
        
        let fadeNum = "#fader" + i.toString()
        let level = "level" + i.toString()
        let panNum = "#panknob" + i.toString()
        let panLevel = "panlevel" + i.toString()
        let widthNum = "#widthknob" + i.toString()
        let widthLevel = "widthlevel" + i.toString()
        
        $(fadeNum).attr("data-topic", level)
        $(panNum).attr("data-topic", panLevel)
        $(widthNum).attr("data-topic", widthLevel)
    }
    
    for (let i = 1; i <= 16; i++) {
        let assId = "#assKnob" + i.toString()
        let assCheck = "#assCheck" + i.toString()
        
        $(assId).change(function() {
            var selectedTopic = this.dataset.topic
            let selectedOption = $(this).children("option:selected").val()
            
            if ($(assCheck).prop("checked")) {
                uibuilder.send({"topic": "knobAssigns", "payload": [selectedTopic, selectedOption]})
            }
        })
        
        $(assCheck).click(function() {
            if ($(assCheck).prop("checked") == true) {
                if ($(assId).data("topic") == i.toString()) {
                    let selectedOption = $(assId).children("option:selected").val()
                    uibuilder.send({"topic": "knobAssigns", "payload": [i.toString(), selectedOption]})
                }
            }
            else {
                uibuilder.send({"topic": "knobAssigns", "payload": [i.toString(), "0xff"]})
            }
        })
    }

});

// Variable to store amount of times Pan button has been clicked
var panCount = 0

// Change View (Vol > Pan > Width) Based on Times Pan Button Clicked
function panFunction() {
    
    ++panCount
    
    const pan = document.getElementById("pan")
    
    // Ensures Pan button remains lit as user switches from
    // Pan to Stereo Width Mode
    if (panCount < 3) {
        pan.checked = true
        
        // If Pan mode is engaged
        if (panCount == 1) {
            
            $("#log2").html("PAN")
            
            $(function(){
                
                // Acquire all 16 Channel Knobs
                for (let i = 1; i <= 16; i++) {
                    let name = "#fader" + i.toString()
                    
                    // Hide the Volume Knobs
                    $(name).hide()
                }
                
                // Acquire all 16 Channel Knobs    
                for (let i = 1; i <= 16; i++) {
                    
                    // Hide the Width Knobs
                    let name = "#widthknob" + i.toString()
                    $(name).hide()
                }
                
                // Acquire all 16 Channel Knobs    
                for (let i = 1; i <= 16; i++) {
                    
                    // Show the Pan Knobs
                    let name = "#panknob" + i.toString()
                    $(name).show()
                }
            })
        }
    
        // If Width mode is engaged
        if (panCount == 2) {
            
            $("#log2").html("STEREO WIDTH")
            
            $(function(){
                
                // Acquire all 16 Channel Knobs
                for (let i = 1; i <= 16; i++) {
                    let name = "#fader" + i.toString()
                    
                    // Hide the Volume Knobs
                    $(name).hide()
                }
                
                // Acquire all 16 Channel Knobs    
                for (let i = 1; i <= 16; i++) {
                    
                    // Hide the Pan Knobs
                    let name = "#panknob" + i.toString()
                    $(name).hide()
                }
                
                // Acquire all 16 Channel Knobs    
                for (let i = 1; i <= 16; i++) {
                    
                    // Show the Width Knobs
                    let name = "#widthknob" + i.toString()
                    if ($(name).data("mode") == "1"){
                        $(name).show()
                    }
                    else {
                        $(name).hide()
                    }
                }
            })
        }
    }
    
    // Returns Pan button to default view upon returning to
    // Volume Level mode
    if (panCount >= 3) {
        
        pan.checked = false
        
        $("#log2").html("VOLUME")
        
        // Show the Volume Knobs and Hide the Pan and Width Knobs
        $(function(){
            
                for (let i = 1; i <= 16; i++) {
                    let name = "#fader" + i.toString()
                    $(name).show()
                }
                
                for (let i = 1; i <= 16; i++) {
                    let name = "#panknob" + i.toString()
                    $(name).hide()
                }
                
                for (let i = 1; i <= 16; i++) {
                    let name = "#widthknob" + i.toString()
                    $(name).hide()
                }
            })
        
        // Resets Pan button click count to prepare for user
        // To access Pan mode again
        panCount = 0
    }
}

/*
function Func() {
  var input, filter, a;

  // take user input
  input = document.getElementById("userInput");
  
  // convert the input to upper case letter for easy comparison
  filter = input.value.toUpperCase();

  div = document.getElementById("knob1Ass");

  // get all the options as a list
  a = div.getElementsByTagName("option");

  // iterate through the entire list and output relevant results if found
  for (var i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}
*/

// Run this function when the document is loaded
window.onload = function() {
    // Start up uibuilder - see the docs for the optional parameters
    uibuilder.start()
    
    // Listen for incoming messages from Node-RED
    uibuilder.onChange('msg', function(msg){
        console.info('[indexjs:uibuilder.onChange] msg received from Node-RED server:', msg)

        // Dump the msg as text to the "msg" html element
        const eMsg = document.getElementById('msg')
        eMsg.innerHTML = syntaxHighlight(msg)
        
        // Msg Routing Function that handles
        // Volume levels adjusted externally
        // Individual Channel Names for each knob
        $(document).ready(function(){
            
            if (msg.topic == "mixerName") {
                $("#mixername").val(msg.payload)
            }
            
            if (msg.topic == "bitCheck") {
                switch (msg.payload) {
                    case "preset1" :
                        $("#presetCheck1").prop("checked", true)
                        break
                    case "preset2" :
                        $("#presetCheck2").prop("checked", true)
                        break
                    case "preset3" :
                        $("#presetCheck3").prop("checked", true)
                        break
                    case "preset4" :
                        $("#presetCheck4").prop("checked", true)
                        break
                }
            }
            
            // Loop to sort through all 16 possible levels
            for (let i = 1; i <= 16 ;i++) {
                
                // Temporary value between 1 and 16
                let holdNum = i.toString()
                
                // Variable to define the Volume Msg Topic Name
                let knobName = "knob" + holdNum
                
                // Variable to define the Pan Msg Topic Name
                let panName = "pan" + holdNum
                
                // Variable to define the Active Width Topic Name
                let widthName = "width" + holdNum
                
                // Variable to define the Inactive Width Topic Name
                let noWidthName = "nowidth" + holdNum
                
                // Variable to define the Channel Knob ID
                let faderName = "#fader" + holdNum
                
                // Variable to define Pan Knob ID
                let panKnobName = "#panknob" + holdNum
                
                // Variable to define Width Knob ID
                let widthKnobName = "#widthknob" + holdNum
                
                // Variable to define the Name Msg Topic
                let nameTopic = "name" + holdNum
                
                // Variable to define the Channel Name ID
                let channelName = faderName + "name"
                
                let assCheck = "#assCheck" + holdNum
                
                // Retrieves the Volume value associated with the
                // Channel Knob #
                if (msg.topic == knobName) {
                    
                    // Sets the Volume level for the respective
                    // Channel Knob to match the incoming value
                    $(faderName).val(msg.payload)
                }
                
                // Retrieves the Pan value associated with the
                // Channel Knob #                
                if (msg.topic == panName) {
                    
                    // Sets the Pan level for the respective
                    // Channel Knob to match the incoming value
                    $(panKnobName).val(msg.payload)
                }
                
                if (msg.topic == widthName) {
                    $(widthKnobName).attr("data-mode", "1")
                    $(widthKnobName).val(msg.payload)
                }
                
                if (msg.topic == noWidthName) {
                    $(widthKnobName).attr("data-mode", "0")
                }
                
                // Retrieves the value associated with the
                // Channel Name #
                if (msg.topic == nameTopic) {
                    
                    // If channel is not unassigned
                    if (typeof msg.payload !== 'undefined') {
                        
                    // Sets the Channel name for the respective
                    // Channel Knob to match the incoming value
                    $(channelName).html(msg.payload)
                    $(assCheck).prop("checked", true)
                    }
                    
                    else {
                    $(channelName).html("")
                    $(assCheck).prop("checked", false)
                    }
                }
                
                if (msg.topic == "masterlevel") {
                    $("#masterfader").val(msg.payload)
                }
                
                if (msg.topic == "auxlevel") {
                    $("#masteraux").val(msg.payload)
                }
            }
            
            if (msg.topic == "nameList") {
                
                for (let i = 0; i < 32; i++) {
                    
                    let optionId = "[id=option" + (i + 1).toString() + "]"
                    let name = msg.payload[i]
                    
                    $(optionId).html(name)
                }
            }
            
        });
    })
}