const modal = document.getElementById("modal");
const openBtn = document.getElementById("open");
const closeBtn = document.getElementById("close");
const canvas = document.getElementById("gl");

/* THREE */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 560 / 380, 0.1, 10);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
});
renderer.setSize(560, 380);
renderer.setPixelRatio(devicePixelRatio);

/* SHADER */
const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        strength: { value: 0 },
    },
    vertexShader: `
        varying vec2 vUv;
        uniform float time;
        uniform float strength;

        void main() {
            vUv = uv;
            vec3 p = position;
            float wave =
                sin(p.y * 5.0 + time * 2.0) *
                sin(p.x * 4.0 + time * 1.5);
            p.z += wave * 0.08 * strength;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;

        void main() {
            vec3 base = vec3(0.07,0.08,0.09);
            float vignette =
                smoothstep(0.9,0.3,distance(vUv,vec2(0.5)));
            gl_FragColor = vec4(base + vignette*0.18,1.0);
        }
    `,
});

const geo = new THREE.PlaneGeometry(1.6, 1.1, 80, 80);
const mesh = new THREE.Mesh(geo, material);
scene.add(mesh);

/* RENDER LOOP */
function animate(t) {
    material.uniforms.time.value = t * 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate(0);

/* OPEN / CLOSE */
openBtn.onclick = () => {
    modal.classList.add("active");
    openBtn.style.opacity = "0";
    openBtn.style.pointerEvents = "none";
    material.uniforms.strength.value = 1;
};

closeBtn.onclick = () => {
    modal.classList.remove("active");
    openBtn.style.opacity = "1";
    openBtn.style.pointerEvents = "auto";
    material.uniforms.strength.value = 0;
};

/* PARALLAX */
document.addEventListener("mousemove", (e) => {
    if (!modal.classList.contains("active")) return;

    const x = (e.clientX / innerWidth - 0.5) * 0.4;
    const y = (e.clientY / innerHeight - 0.5) * 0.4;

    mesh.rotation.y = x;
    mesh.rotation.x = -y;
});
