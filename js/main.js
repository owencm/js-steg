// First declare the matrices you wish to use. For details on how to generate these and what they do, see chapter 4 of the attached paper.
var mlbcForEncodingAndDecoding = JSON.parse('{"k":3,"n":27,"l":11,"r":13,"G1":[[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1],[0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,1,0,0,0,0],[0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,1,1,1,1,0,0,1]],"Ht":[[0,1,1,1,1,1,1,1,0,0,0,0,1],[1,1,0,1,1,0,0,0,1,0,0,0,0],[1,0,0,1,0,1,1,1,1,1,0,0,1],[1,0,1,0,1,1,1,0,1,0,0,0,0],[0,0,1,0,0,0,0,0,0,1,0,0,1],[1,1,0,0,1,0,1,0,1,1,1,1,1],[0,1,1,0,0,0,1,0,1,1,0,0,1],[0,1,1,0,0,0,0,0,0,1,0,0,1],[1,0,1,0,0,1,0,0,1,0,0,0,0],[0,0,1,0,0,0,1,0,1,1,0,0,0],[0,1,0,1,1,1,0,1,1,0,1,1,0],[1,1,0,1,1,0,0,0,1,0,0,1,0],[1,0,1,0,0,1,0,0,0,0,0,1,0],[1,0,0,1,0,0,1,0,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,0,0,0,0],[0,0,0,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0],[0,0,0,0,0,0,0,0,0,0,0,0,1]],"Jt":[[1,0,0],[0,1,0],[0,0,1],[1,1,1],[1,0,0],[0,1,0],[0,0,0],[0,1,1],[1,1,0],[0,0,0],[0,1,0],[0,0,0],[1,1,0],[1,0,1],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],"G0":[[1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,0,1,1,0,0,0],[1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,0,1,0,0,0],[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,1,1,1],[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,1,1,0,0,1],[0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,1,0,0,0,0,0],[1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0],[0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,0,0,1,1,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,1,1,0,0,0,1,0,0,1,0],[1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,0,0,1,1],[1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,0,1,0,0,0,1,0,1]]}');


// A global variable which holds onto the blob url of the selected image while we wait for the user to choose to encode or decode.
var objectURL;

// When the user completes selecting an image we generate a blob url for it to communicate with the encoder/decoder and ensure
// the message we're trying to encode isn't too long.
document.getElementById("image-select").addEventListener("change", function handleFileSelect(e){
  // Ensure the user chose a single file
  if (e.target.files.length !== 1) {
    throw new Error("User didn't select a file correctly");
  }
  var f = e.target.files[0];
  // Create a 'blob' url file for the image so we can the file to be decoded or encoded
  window.URL = window.URL || window.webkitURL;
  objectURL = window.URL.createObjectURL(f);
  // Clear the file selection
  e.target.files = [];
  // Calculate the capacity of the image for hidden messages, 
  getImageDimensions(objectURL, function(size) {
    // The encoding/decoding method assumes the image is a multiple of 16 pixels high and wide
    if (size.width % 16 != 0 || size.height % 16 != 0) {
      throw new Error("User selected a file that wasn't a multiple of 16 high and wide");
    }
    // This is how many mode 1 coefficients are used in the JPEG representation and are valid for hiding data in
    var coefficientCount = (size.width * size.height / 64);
    // This line is magic. I think it works out the max possibile number of coefficients the message header may take.
    // Let this lack of memory be a lesson to all of us on the importance of documenting code as we go along. 
    // Seriously, who writes 5*3*8 in code anyway? Me, apparently.
    var magic = coefficientCount - Math.floor(1+5*3*8*mlbcForEncodingAndDecoding.n/mlbcForEncodingAndDecoding.k);
    // This is how many characters you can store in the file
    var maxLength = Math.floor(magic/8*mlbcForEncodingAndDecoding.k/mlbcForEncodingAndDecoding.n);
    // Trim the message to max possible length
    document.getElementById("message").value = document.getElementById("message").value.slice(0, maxLength);
    // Don't let the user add any more!
    document.getElementById("message").setAttribute("maxlength", maxLength);
  });
  //
  document.getElementById("encodedImage").src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
}, false);

document.getElementById("decodeButton").addEventListener("click", function() {
  var password = document.getElementById("password").value;
  decodeImage(objectURL, createDecodingDctFunction(password, mlbcForEncodingAndDecoding), function(){});
});

document.getElementById("encodeButton").addEventListener("click", function () {
  if (document.getElementById("message").value.length > 0) {
    //updateStatus("Recompressing image. Please wait...");
    getImageDataFromURL(objectURL, 
      function(data) {
        var message = document.getElementById("message").value;
        var password = document.getElementById("password").value;
        encodeData(data, 75, createEncodingDctFunction(message, password, mlbcForEncodingAndDecoding), function (uri) {
          document.getElementById("encodedImage").src = uri;
        });
      }
    );
  } else {
    //updateStatus("Please type a message to be sent.");
  }
});


// function compareArrays() {
//   var blocks = decodedLumaArr.length;
//   errors = [];
//   totals = [];
//   for (var i = 0; i < blocks; i++){
//     for (var k = 0; k < 64; k++) {
      
//       if (errors[k] == undefined) {
//         errors[k] = 0;
//         totals[k] = 0;
//       }

//       if (decodedLumaArr[i][k] != 0) {
//         if (decodedLumaArr[i][k] != encodedLumaArr[i][k]) {
//           errors[k]++;
//         }
//         totals[k]++;
//       }

//     }
//   }
//   for (var k = 0; k < 64; k++) {
//     errorRate = errors[k]/totals[k];
//     if (isNaN(errorRate)) {
//       errorRate = 0;
//     }
//     errorRate = Math.round(errorRate*1000)/10;
//     console.log(k+": "+errors[k]+" errors in "+totals[k]+" non-zeros. "+errorRate+"%");
//   }
// }
