import * as THREE from 'three/build/three.module';
import GLTFLoader from 'three-gltf-loader';
import duomo from './_duomo.glb';

class Duomo {
    constructor(mountPoint = '#duomo',larghezza = 500,altezza = 400){
        this.mountPoint = mountPoint;
        this.larghezza = larghezza;
        this.altezza = altezza;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.light = null;
        this.cube = null;
        this.model = null;

        this.initScene();
        this.initCamera();
        //this.initCube();
        this.initLight();
        this.initRender();
        this.initModel();
        this.renderLoop();
    }

    initScene(){
        this.scene = new THREE.Scene();
    }

    initCamera(){
        this.camera = new THREE.PerspectiveCamera(70,this.larghezza / this.altezza,0.01,10);
        this.camera.position.z = 7;
        this.camera.position.y = 1;
        this.camera.rotation.x = - Math.PI / 30;
        this.camera.fov = 30;
        this.camera.updateProjectionMatrix();
    }

    initRender(){
       this.renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
       this.renderer.setSize(this.larghezza,this.altezza);
       this.renderer.render(this.scene,this.camera);
       let destinazione = document.querySelector(this.mountPoint);
       destinazione.append(this.renderer.domElement);
    }

    initModel(){
        let loader = new GLTFLoader();
        loader.load(duomo,
            (gltf)=> {
                this.model = gltf.scene;
                this.scene.add(this.model);
                },
            (xhr) => console.log(`${xhr.loaded / xhr.total * 100} %`),
            (err) => console.log(err)
            );
    }

    initCube(){
        var geometry = new THREE.BoxGeometry();
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.cube );
    }

    initLight(){
        this.light = new THREE.AmbientLight(0xffffff);
        this.scene.add(this.light);
    }

    renderLoop(){
        let render = ()=> {
            this.animate();
            this.renderer.setSize(this.larghezza,this.altezza);            
            this.renderer.render(this.scene,this.camera);
            requestAnimationFrame(render);
        }
        render();
    }
     
    animate(){
        // if (!this.model) return 0;
        // this.model.rotation.x += .01; 
        // this.model.rotation.y += .001; 
    }

    ruotaModello(angolo){
        if (!!this.model)
            this.model.rotation.y = angolo;
    }
}

export default Duomo;