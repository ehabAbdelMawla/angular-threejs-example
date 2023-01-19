import { Component, ViewChild, ElementRef } from '@angular/core';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
@Component( {
  selector: 'app-threejs',
  templateUrl: './threejs.component.html',
  styleUrls: [ './threejs.component.scss' ]
} )
export class ThreejsComponent {
  @ViewChild( "myCanvas" ) myCanvas: any;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene
  constructor () {

  }

  ngOnInit(): void {
  }



  ngAfterViewInit() {
    this.setupView()
    this.setupLightControls()
    this.addAxios( 25 )
    this.refreshRender()
    this.myCanvas.nativeElement.appendChild( this.renderer.domElement )
  }


  setupView() {
    const width = this.myCanvas.nativeElement.clientWidth | 500
    const height = this.myCanvas.nativeElement.clientHeight | 500;

    this.scene = new THREE.Scene()
    /* Camera */
    this.camera = new THREE.PerspectiveCamera( 50, width / height, 1, 10000 );
    this.camera.position.set( 20, 20, 20 );
    this.camera.lookAt( this.scene.position );

    /* Renderer */
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( width, height, false );
    this.renderer.setClearColor( new THREE.Color( "rgb(50, 50, 50)" ), 1 );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    /* Plane */
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry( 20, 20 ),
      new THREE.MeshStandardMaterial( { color: new THREE.Color( "rgb(180, 180, 180)" ), side: THREE.DoubleSide } ) );
    plane.rotateX( -Math.PI * 0.5 );
    plane.receiveShadow = true

    /* Add TO Scene */
    this.scene.add(
      this.getSphere( 2, 2, 2, 2 ),
      this.getCube( -2, 2, 2, 2 ),
      this.getSphere( 2, 2, -2 ),
      this.getCube( -2, 2, -2 ),
      plane,
    )

  }

  addAxios( size: number ) {
    this.scene.add( new THREE.AxesHelper( size ) );
  }


  getCube( x: number, y: number, z: number, size: number = 1 ): THREE.Mesh {
    const geometry = new THREE.BoxGeometry( size, size, size );
    const material = new THREE.MeshStandardMaterial( { color: new THREE.Color( "rgb(0, 0, 0)" ) } );
    const cube = new THREE.Mesh( geometry, material )
    cube.position.set( x, y, z );
    cube.castShadow = true
    return cube
  }

  getSphere( x: number, y: number, z: number, size: number = 1 ): THREE.Mesh {
    const geometry = new THREE.SphereGeometry( size );
    const material = new THREE.MeshPhongMaterial( { color: new THREE.Color( "rgb(0, 0, 0)" ) } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.set( x, y, z );
    sphere.castShadow = true
    return sphere
  }


  refreshRender() {
    this.renderer.render( this.scene, this.camera );
  }
  setupLightControls() {
    /* Lights */
    var ambLight = new THREE.AmbientLight( 0xFFFFFF );
    const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( 5, 5, -5 )
    light.castShadow = true

    const controls = new OrbitControls( this.camera, this.renderer.domElement );
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.addEventListener( 'change', () => { this.refreshRender() } )
    controls.update();

    const transformControls = new TransformControls( this.camera, this.renderer.domElement );
    transformControls.attach( light );

    transformControls.addEventListener( 'change', () => {
      this.refreshRender()
    } )
    transformControls.addEventListener( 'mouseDown', () => {
      controls.enabled = false;

    } );
    transformControls.addEventListener( 'mouseUp', () => {
      controls.enabled = true;
    } );
    transformControls.setSize( 0.5 )
    this.scene.add(
      light,
      ambLight,
      transformControls,
    )
  }
}


