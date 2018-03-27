import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  image: any;
  sensor: any;
  gps: any; 
  position: any;
  
  constructor(public navCtrl: NavController,
    private camera: Camera,
    private geolocation: Geolocation,
    private deviceMotion: DeviceMotion,
    public plt: Platform) {
  
      this.plt.ready().then((readySource) => {
  
        console.log('Platform ready from', readySource);
        console.log(this.geolocation);
        
        this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: true }).then((resp) => {
          // resp.coords.latitude
          // resp.coords.longitude
          console.log(resp);
          this.position = resp;        
         }).catch((error) => {
           console.log('Error getting location', error);
         });
         
         let watch = this.geolocation.watchPosition();
         watch.subscribe((data) => {
           console.log(data);
           this.position = data;
          // data can be a set of coordinates, or an error (if an error occurred).
          // data.coords.latitude
          // data.coords.longitude
         });
      });
    }

  getSensor(){
            this.gps = "long: " + this.position.coords.longitude + " lat: " + this.position.coords.latitude;
            // Get the device current acceleration
            this.deviceMotion.getCurrentAcceleration().then(
              (acceleration: DeviceMotionAccelerationData) => {
                console.log(acceleration);
                this.sensor = "x: "+acceleration.x + " y: "+acceleration.y+ " z: "+acceleration.z;              
              },
              (error: any) => console.log(error)
            );
    
            // Watch device acceleration
            var subscription = this.deviceMotion.watchAcceleration().subscribe((acceleration: DeviceMotionAccelerationData) => {
              console.log(acceleration);
            });
    
            // Stop watch
            subscription.unsubscribe();
  }
  takePicture(){
    console.log('Take Picture');
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.image = base64Image;
      this.getSensor();
     }, (err) => {
      // Handle error
     });
    
  }
}
