import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';
import { Box } from './Box.js';
// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js"

window.restart = function () {
    cancelAnimationFrame(animationID)
    animate(0)
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(4.61, 2.74, 18);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
})
renderer.shadowMap.enabled = true //shadowSetting
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.y = 3;
light.position.z = 1;
light.castShadow = true //shadowSetting
scene.add(light)

scene.add(new THREE.AmbientLight(0xffffff, 0.5));


// const controls = new OrbitControls(camera, renderer.domElement)

// define cube |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

const cube = new Box({
    width: 1,
    height: 1,
    depth: 1,
    velocity: {
        x: 0,
        y: -0.01,
        z: 0
    },
    position: {
        x: 0,
        y: 0,
        z: 0
    },
    control: true
})
cube.castShadow = true //shadowSetting
scene.add(cube)

// define ground |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
const ground = new Box({
    width: 10,
    height: 0.5,
    depth: 50,
    color: '#0369a1',
    position: {
        x: 0,
        y: -2,
        z: 0
    }
})

ground.receiveShadow = true //shadowSetting
scene.add(ground)

// define enemies |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
const enemies = [];
const enemy = new Box({
    width: 1,
    height: 1,
    depth: 1,
    position: {
        x: (Math.random()) * (ground.right - ground.left) - ground.right,
        y: 0,
        z: ground.back + 45
    },
    velocity: {
        x: 0,
        y: 0,
        z: 0.00
    },
    color: 'red',
    zAcceleration: false
});
enemy.castShadow = true;
scene.add(enemy);
enemies.push(enemy);


function boxCollision({ box1, box2 }) {
    const xCollision = box1.right >= box2.left && box1.left <= box2.right;
    const yCollision = box1.bottom + box1.velocity.y <= box2.top && box1.top >= box2.bottom;
    const zCollision = box1.front >= box2.back && box1.back <= box2.front;

    return xCollision && yCollision && zCollision
}


let animationID;
let spawnRate = 200;
let frames = 0;
function animate() {
    animationID = requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // camera.lookAt(cube.position)

    // movement code
    cube.velocity.x = 0;
    cube.velocity.z = 0;
    if (keys.a.pressed) cube.velocity.x = -0.1;
    else if (keys.d.pressed) cube.velocity.x = 0.1;
    if (keys.w.pressed) cube.velocity.z = -0.1;
    else if (keys.s.pressed) cube.velocity.z = 0.1;

    cube.update(ground);
    enemies.forEach((enemy) => {
        enemy.update(ground)
        if (boxCollision({
            box1: cube,
            box2: enemy
        })
        ) {
            window.cancelAnimationFrame(animationID);
        }
    })

    if (frames % spawnRate === 5) {

        if (spawnRate > 20) spawnRate -= 2

        const enemy = new Box({
            width: 1,
            height: 1,
            depth: 1,
            position: {
                x: (Math.random()) * (ground.right - ground.left) - ground.right,
                y: 0,
                z: ground.back
            },
            velocity: {
                x: 0,
                y: 0,
                z: 0.005
            },
            color: 'red',
            zAcceleration: true
        });
        enemy.castShadow = true;
        scene.add(enemy);
        enemies.push(enemy);
    }
    frames++;
}
animate(0)