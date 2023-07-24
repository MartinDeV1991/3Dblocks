import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js'

export class Box extends THREE.Mesh {
    constructor({ width, height, depth, color = '#00ff00', velocity = { x: 0, y: 0, z: 0 }, position = { x: 0, y: 0, z: 0 }, control = false, zAcceleration }) {
        super(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial({ color })
        )
        this.height = height;
        this.width = width;
        this.depth = depth;

        this.position.set(position.x, position.y, position.z)

        this.right = this.position.x + this.width / 2;
        this.left = this.position.x - this.width / 2;

        this.bottom = this.position.y - this.height / 2;
        this.top = this.position.y + this.height / 2;

        this.front = this.position.z + this.depth / 2;
        this.back = this.position.z - this.depth / 2;

        this.velocity = velocity;
        this.gravity = -0.02;

        this.zAcceleration = zAcceleration;
        this.control = control;

        this.controls = {
            forward: 0,
            left: 0,
            right: 0,
            backward: 0
        }
    }

    updateSides() {
        this.right = this.position.x + this.width / 2;
        this.left = this.position.x - this.width / 2;

        this.bottom = this.position.y - this.height / 2;
        this.top = this.position.y + this.height / 2;

        this.front = this.position.z + this.depth / 2;
        this.back = this.position.z - this.depth / 2;

    }

    update(ground) {
        this.updateSides();

        if (this.zAcceleration) this.velocity.z += 0.003;
        this.position.x += this.velocity.x;
        this.position.z += this.velocity.z;
        // if (this.position.x >= ground.right) this.position.x = ground.right
        // if (this.position.x <= ground.left) this.position.x = ground.left
        // if (this.position.z >= ground.front) this.position.z = ground.front
        // if (this.position.z <= ground.back) this.position.z = ground.back
        this.applyGravity(ground);
    }

    applyGravity(ground) {
        this.velocity.y += this.gravity;

        // this is where we hit the ground
        if (boxCollision({ box1: this, box2: ground })) {
            const friction = 0.8;
            this.velocity.y *= friction;
            this.velocity.y = -this.velocity.y;
            if (keys.space.pressed && this.control == true) {
                this.velocity.y += 0.2;
            }
        } else {
            this.position.y += this.velocity.y;
        }
    }
}

function boxCollision({ box1, box2 }) {
    const xCollision = box1.right >= box2.left && box1.left <= box2.right;
    const yCollision = box1.bottom + box1.velocity.y <= box2.top && box1.top >= box2.bottom;
    const zCollision = box1.front >= box2.back && box1.back <= box2.front;

    return xCollision && yCollision && zCollision
}