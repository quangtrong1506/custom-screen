'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { WeatherInterface } from './type';
import { formatSunTime } from '../../../helpers';

/**
 * Component hiển thị widget thời tiết có hiệu ứng mây 3D bằng Three.js
 */
export function Weather() {
    const [weather, setWeather] = useState<WeatherInterface | null>(null);

    useEffect(() => {
        const dateTimeEl = document.getElementById('dateTime');
        const updateDateTime = () => {
            const now = new Date();
            const optionsDate: Intl.DateTimeFormatOptions = { weekday: 'long' };
            const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
            if (dateTimeEl)
                dateTimeEl.textContent = `${now.toLocaleDateString(undefined, optionsDate)}, ${now.toLocaleTimeString(
                    [],
                    optionsTime
                )}`;
        };
        updateDateTime();
        const timer = setInterval(updateDateTime, 60000);

        const container = document.getElementById('cloud-container');
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, rect.width / rect.height, 0.1, 1000);
        camera.position.set(0, 0.5, 4.5);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(rect.width, rect.height);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.07;
        controls.rotateSpeed = 0.8;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minPolarAngle = Math.PI / 3;
        controls.maxPolarAngle = Math.PI / 1.8;

        scene.add(new THREE.AmbientLight(0xffffff, 1.2));
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
        directionalLight.position.set(2, 3, 2);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xaabbee, 0.8, 15);
        pointLight.position.set(-1, 1, 3);
        scene.add(pointLight);

        const cloudGroup = new THREE.Group();
        scene.add(cloudGroup);

        const cloudMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xf0f8ff,
            transparent: true,
            opacity: 0.85,
            roughness: 0.6,
            metalness: 0.0,
            transmission: 0.1,
            ior: 1.3,
            specularIntensity: 0.2,
            sheen: 0.2,
            sheenColor: 0xffffff,
            sheenRoughness: 0.5,
            clearcoat: 0.05,
            clearcoatRoughness: 0.3,
        });

        function createCloudPart(radius: number, position: THREE.Vector3) {
            const geometry = new THREE.SphereGeometry(radius, 20, 20);
            const mesh = new THREE.Mesh(geometry, cloudMaterial);
            mesh.position.copy(position);
            return mesh;
        }

        function createDetailedCloud(x: number, y: number, z: number, scale: number) {
            const cloud = new THREE.Group();
            cloud.position.set(x, y, z);
            cloud.scale.set(scale, scale, scale);
            const parts = [
                [0.8, [0, 0, 0]],
                [0.6, [0.7, 0.2, 0.1]],
                [0.55, [-0.6, 0.1, -0.2]],
                [0.7, [0.1, 0.4, -0.3]],
                [0.5, [0.3, -0.3, 0.2]],
                [0.6, [-0.4, -0.2, 0.3]],
                [0.45, [0.8, -0.1, -0.2]],
                [0.5, [-0.7, 0.3, 0.3]],
            ];
            parts.forEach(([r, pos]) => {
                cloud.add(createCloudPart(r as number, new THREE.Vector3(...(pos as [number, number, number]))));
            });
            cloud.userData = {
                isRaining: false,
                originalPosition: cloud.position.clone(),
                bobOffset: Math.random() * Math.PI * 2,
                bobSpeed: 0.0005 + Math.random() * 0.0003,
                bobAmount: 0.15 + Math.random() * 0.1,
            };
            return cloud;
        }

        function createRaindropsForCloud(cloud: THREE.Group) {
            const rainGroup = new THREE.Group();
            cloud.add(rainGroup);
            cloud.userData.rainGroup = rainGroup;

            const raindropMaterial = new THREE.MeshBasicMaterial({
                color: 0x87cefa,
                transparent: true,
                opacity: 0.7,
            });

            const drops: THREE.Mesh[] = [];
            for (let i = 0; i < 30; i++) {
                const geo = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 6);
                const drop = new THREE.Mesh(geo, raindropMaterial);
                drop.position.set((Math.random() - 0.5) * 1.8, -0.8 - Math.random() * 1.5, (Math.random() - 0.5) * 1.8);
                drop.userData = {
                    originalY: drop.position.y,
                    speed: 0.08 + Math.random() * 0.05,
                };
                rainGroup.add(drop);
                drops.push(drop);
            }
            rainGroup.visible = false;
            return drops;
        }

        const cloud1 = createDetailedCloud(-0.7, 0.2, 0, 1.0);
        const cloud2 = createDetailedCloud(0.7, -0.1, 0.3, 0.9);
        cloudGroup.add(cloud1, cloud2);

        const raindrops1 = createRaindropsForCloud(cloud1);
        const raindrops2 = createRaindropsForCloud(cloud2);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        renderer.domElement.addEventListener('click', (e) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(cloudGroup.children, true);
            if (intersects.length > 0) {
                let obj = intersects[0].object;
                while (obj.parent && obj.parent !== cloudGroup) obj = obj.parent;
                if (obj.parent === cloudGroup) {
                    const raining = !cloud1.userData.isRaining;
                    [cloud1, cloud2].forEach((c) => {
                        c.userData.isRaining = raining;
                        c.userData.rainGroup.visible = raining;
                        c.scale.multiplyScalar(1.15);
                        setTimeout(() => c.scale.setScalar(1), 150);
                    });
                }
            }
        });

        function animate() {
            requestAnimationFrame(animate);
            const time = Date.now();
            cloudGroup.rotation.y += 0.002;
            [cloud1, cloud2].forEach((cloud) => {
                cloud.position.y =
                    cloud.userData.originalPosition.y +
                    Math.sin(time * cloud.userData.bobSpeed + cloud.userData.bobOffset) * cloud.userData.bobAmount;

                if (cloud.userData.isRaining && cloud.userData.rainGroup) {
                    const drops = cloud === cloud1 ? raindrops1 : raindrops2;
                    drops.forEach((drop) => {
                        drop.position.y -= drop.userData.speed;
                        if (drop.position.y < -5) {
                            drop.position.y = -0.8;
                            drop.position.x = (Math.random() - 0.5) * 1.8 * cloud.scale.x;
                            drop.position.z = (Math.random() - 0.5) * 1.8 * cloud.scale.z;
                        }
                    });
                }
            });
            controls.update();
            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            const newRect = container.getBoundingClientRect();
            camera.aspect = newRect.width / newRect.height;
            camera.updateProjectionMatrix();
            renderer.setSize(newRect.width, newRect.height);
        });

        return () => {
            clearInterval(timer);
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        fetch(
            'https://api.openweathermap.org/data/2.5/weather?lat=21.0086893&lon=105.8201237&appid=c627d7c7218be88fe716bb704adb79a8&units=metric',
            {
                method: 'GET',
                redirect: 'follow',
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                setWeather(result as WeatherInterface);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <div className="fixed top-8 right-8 w-[420px] h-[500px] flex justify-center items-center p-4">
            <div className="relative w-full max-w-sm">
                <div className="relative text-white bg-gradient-to-br from-purple-700/70 via-indigo-800/60 to-blue-900/70 backdrop-blur-lg shadow-2xl rounded-3xl p-6 overflow-hidden border border-white/10">
                    <div
                        id="cloud-container"
                        className="absolute top-0 right-0 w-36 h-36 sm:w-40 sm:h-40 z-30 cursor-pointer rounded-tr-3xl overflow-hidden"
                    >
                        <div
                            id="cloud-tooltip"
                            className="absolute top-20 right-2 sm:top-24 sm:right-4 bg-black/70 text-white px-3 py-1.5 rounded-md text-xs opacity-0 transition-opacity duration-300 pointer-events-none z-40 shadow-lg"
                        >
                            Click clouds for a surprise!
                            <div className="absolute -top-1 right-3 w-3 h-3 bg-black/70 rotate-45" />
                        </div>
                    </div>
                    <div className="relative z-20">
                        <div
                            id="dateTime"
                            className="text-sm font-light opacity-80 mb-1 tracking-wide animate-fadeInUp"
                        />
                        <div className="current-weather flex items-center mb-2">
                            <div className="text-5xl mr-3">&#9925;</div>
                            <div
                                className="text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 animate-fadeInScaleUp delay-100"
                                id="temperature"
                            >
                                {weather?.main.temp || '-'}&deg;C
                            </div>
                        </div>
                        <div className="text-lg opacity-90 mb-4 tracking-wide animate-fadeInUp delay-200" id="location">
                            New York, USA
                        </div>
                        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center mb-4 border border-white/10 shadow-md animate-fadeInUp delay-300">
                            <div className="text-center">
                                <div className="text-xl mb-1">&#9728;&#65039;</div>
                                <div className="text-xs opacity-80" id="sunriseTime">
                                    {formatSunTime(weather?.sys.sunrise)} am
                                </div>
                            </div>
                            <div className="text-center text-sm opacity-90" id="dayLength">
                                11 h 42 m
                            </div>
                            <div className="text-center">
                                <div className="text-xl mb-1">&#127769;</div>
                                <div className="text-xs opacity-80" id="sunsetTime">
                                    {formatSunTime(weather?.sys.sunset)} pm
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center mb-4 border border-white/5 shadow-sm animate-fadeInUp delay-400">
                            <div className="text-2xl mr-2 text-blue-300 drop-shadow-lg animate-gentleBob">
                                &#127783;&#65039;
                            </div>
                            <div className="text-sm opacity-90" id="precipitationChance">
                                Rain 85%
                            </div>
                        </div>
                        <div className="flex justify-between text-sm opacity-90 mb-5 animate-fadeInUp delay-500">
                            <div id="humidity">Humidity: {weather?.main.humidity ?? '-'}%</div>
                            <div id="windSpeed">Wind: {weather?.wind.speed ?? '-'} km/h</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
