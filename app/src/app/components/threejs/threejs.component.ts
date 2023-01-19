import { Component,  ViewChild, ElementRef } from '@angular/core';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
@Component({
  selector: 'app-threejs',
  templateUrl: './threejs.component.html',
  styleUrls: ['./threejs.component.scss']
})
export class ThreejsComponent {
  @ViewChild("myCanvas") myCanvas:any;
  renderer:THREE.WebGLRenderer;
  camera:THREE.PerspectiveCamera;
  controls: any;
  scene:THREE.Scene
  constructor() {

  }

  ngOnInit(): void {
  }



  ngAfterViewInit(){
    this.setupView()
    this.addAxios(25)

    this.refreshRender()
    this.myCanvas.nativeElement.appendChild(this.renderer.domElement)
}


setupView(){
  const width = this.myCanvas.nativeElement.clientWidth | 500
  const height = this.myCanvas.nativeElement.clientHeight| 500;

  console.log(width,height,)
  this.scene = new THREE.Scene()
  this.camera = new THREE.PerspectiveCamera( 50,  width/height , 0.4, 1000 );

  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.setSize( width, height,false );
  this.renderer.setClearColor( new THREE.Color( "rgb(50, 50, 50)"), 1 );
  this.renderer.shadowMap.enabled = true;
  this.renderer.shadowMap.type = THREE.BasicShadowMap;


  const plane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10 ), 
  new THREE.MeshBasicMaterial( {color: new THREE.Color( "rgb(180, 180, 180)"), side: THREE.DoubleSide} ));
  plane.rotateX(-Math.PI * 0.5);


  
this.scene.add(

  this.getSphere(1,1,1),
  this.getCube(1,1,-1),
  this.getCube(-1,1,1),
  this.getSphere(-1,1,-1),
  plane,
  )
 this.camera.position.set(5,5,10)

 this.controls = new OrbitControls( this.camera, this.renderer.domElement );
 this.controls.target.set( 0, 0, 0 );
 this.controls.minDistance = 5;
 this.controls.maxDistance = 25;
 this.controls.addEventListener('change', () => {this.refreshRender()})
 this.controls.update();

}

addAxios(size:number){
  this.scene.add( new THREE.AxesHelper( size ) );
}


getCube(x:number,y:number,z:number):THREE.Mesh{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshPhongMaterial( { color: new THREE.Color("rgb(0, 0, 0)") } );
  const cube = new THREE.Mesh( geometry, material )
  cube.position.set(x,y,z);

  return cube
}

getSphere(x:number,y:number,z:number):THREE.Mesh{
  const geometry = new THREE.SphereGeometry(0.5);
const material = new THREE.MeshPhongMaterial( { color: new THREE.Color("rgb(0, 0, 0)") } );
const sphere = new THREE.Mesh( geometry, material );

sphere.position.set(x,y,z);

  return sphere
}


refreshRender(){
  this.renderer.render( this.scene, this.camera );
}

}
