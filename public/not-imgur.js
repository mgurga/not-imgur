console.log(window.location.href.split('#'));

var fullwindow = false;
var imageuploaded = false;
var uploadID = 'asdasdasdasdasd';
var globalFile;

function toggleFullwin() {
     if (fullwindow) {
          fullwindow = false;
     } else {
          fullwindow = true;
     }

     document.getElementById('toggleButton').innerHTML = "fullwindow:" + fullwindow;
}

function getRandomID() {
     var letters = 'abcdefghijklmnopqrstuvwxyz1234567890';
     var out = '';

     for (var i = 0; i < 6; i++) {
          out += letters.charAt(Math.floor(Math.random() * Math.floor(37)));
     }

     firebase.database().ref('/imgData/' + out + '/name').once('value').then(function(snapshot) {
          //console.log('id already exists: ' + snapshot.val());
          if(snapshot.val() == null) {
               return out;
          } else {
               return getRandomID();
          }
     });

     return out;
}

function uploadImg() {
     document.getElementById('confirmation').innerHTML = "uploading image";

     if (globalFile == undefined) {
          document.getElementById('confirmation').innerHTML = "an image is required to upload";

     } else {

          var database = firebase.database();

          database.ref('imgData/' + uploadID).set({
               'name': document.getElementById('nameInput').value
          });

          var storageRef = firebase.storage().ref('img/' + uploadID);
          var task = storageRef.put(globalFile).then(function(snapshot) {
               document.location.reload();

          });
     }
}

if (window.location.href.split('#').length == 1) {
     console.log("uploader");

     var uploader = document.getElementById('uploader');
     var fileButton = document.getElementById('fileButton');

     fileButton.addEventListener('change', function(e) {

          document.getElementById('confirmation').innerHTML = "saving image";

          var database = firebase.database();
          // var fbfs = firebase.firestore();
          // fbfs.settings({ timestampsInSnapshots: true });
          // var dataRef = fbfs.doc('imgData/data');
          globalFile = e.target.files[0];
          var randomID = getRandomID();
          uploadID = randomID;

          var fr = new FileReader();
          fr.readAsDataURL(globalFile);
          fr.onload = function() {
               document.getElementById('dlimg').src = fr.result;
          }

          console.log(randomID);

          window.location.href = '/#' + randomID;
     });

} else if (window.location.href.split('#').length == 2) {
     console.log("downloader");


     var fileThing = document.getElementById('fileButton');
     fileThing.parentNode.removeChild(fileThing);

     var fullThing = document.getElementById('nameh');
     fullThing.parentNode.removeChild(fullThing);

     var nameThing = document.getElementById('nameInput');
     nameThing.parentNode.removeChild(nameThing);

     var imageID = window.location.href.split('#')[1];
     var storageRef = firebase.storage().ref();

     document.getElementById('confirmation').innerHTML = "getting image";

     firebase.database().ref('/imgData/' + imageID + '/name').once('value').then(function(snapshot) {
          console.log(snapshot.val());
          document.getElementById('imgName').innerHTML = snapshot.val();
     });

     storageRef.child('img/' + imageID).getDownloadURL().then(function(url) {
          document.getElementById('dlimg').src = url;
          console.log(url);
          document.getElementById('confirmation').innerHTML = "share image using url";
     }).catch(function(complete) {
          document.getElementById('confirmation').innerHTML = "error getting image";
     });

} else {
     console.log('fullwindow downloader');

     document.body.innerHTML = "";
     document.head.innerHTML = "";

     var img = document.createElement("img");

     var imageID = window.location.href.split('#')[1];
     var storageRef = firebase.storage().ref();

     storageRef.child('img/' + imageID).getDownloadURL().then(function(url) {
          //document.getElementById('dlimg').src = url;
          console.log(url);
          img.src = url;
          document.body.append(img);

     }).catch(function(complete) {
          //document.getElementById('confirmation').innerHTML = "error getting image";
     });

}
