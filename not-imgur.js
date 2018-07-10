console.log(window.location.href.split('#'));

if (window.location.href.split('#').length == 1) {
     console.log("uploader");

     var uploader = document.getElementById('uploader');
     var fileButton = document.getElementById('fileButton');

     fileButton.addEventListener('change', function(e) {

          // var database = firebase.database();
          // var fbfs = firebase.firestore();
          // fbfs.settings({ timestampsInSnapshots: true });
          // var dataRef = fbfs.doc('imgData/data');
          var file = e.target.files[0];
          var randomID = getRandomID();
          var storageRef = firebase.storage().ref('img/' + randomID);
          var task = storageRef.put(file).then(function(snapshot) {
               document.location.reload();
          });

          // database.ref('imgData/' + randomID).set({
          //      'name' : 'my cool name',
          //      'description' : 'my cooler description'
          // });

          console.log(randomID);
          // dataRef.set({
          //      'name' : 'cool name',
          //      'desc' : 'my super cool description'
          // });

          window.location.href = '/#' + randomID;


     });

     function getRandomID() {
          var letters = 'abcdefghijklmnopqrstuvwxyz1234567890';
          var out = '';

          for (var i = 0; i < 6; i++) {
               out += letters.charAt(Math.floor(Math.random() * Math.floor(37)));
          }

          return out;
     }

} else {
     console.log("downloader");
     var fileThing = document.getElementById('fileButton');
     fileThing.parentNode.removeChild(fileThing);

     var imageID = window.location.href.split('#')[1];
     var storageRef = firebase.storage().ref();

     document.getElementById('confirmation').innerHTML = "getting image";

     storageRef.child('img/' + imageID).getDownloadURL().then(function(url) {
          document.getElementById('dlimg').src = url;
          console.log(url);
          document.getElementById('confirmation').innerHTML = "share image using url";
     }).catch(function(complete) {
          document.getElementById('confirmation').innerHTML = "error getting image";
     });



}
