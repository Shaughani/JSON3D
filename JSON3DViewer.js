import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

// Mock data (same as your HTML prototype)
const mockData = {
  "project": "3D_Viewer",
  "version": 1.0,
  "isActive": true,
  "settings": {
    "theme": "dark",
    "logging": {
      "level": "verbose",
      "remote": false
    }
  },
  "users": [
    { "id": 1, "name": "Alice", "roles": ["admin", "editor"] },
    { "id": 2, "name": "Bob", "active": false },
    { "id": 3, "name": "Charlie", "meta": { "login_count": 42 } }
  ],
  "matrix": [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ],
  "tags": ["visualization", "threejs", "json", "webgl"]
};

const CONFIG = {
  radiusStep: 20,
  nodeSize: 3,
  stackHeight: 6,
  fontSize: 48,
  colors: {
    root: 0xffffff,
    string: 0x2ecc71,
    number: 0x3498db,
    boolean: 0xe67e22,
    object: 0x9b59b6,
    array: 0xe74c3c,
    null: 0x7f8c8d
  }
};

export default function JSON3DViewer({ jsonData = mockData }) {
  const glRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef({ rotationX: 0, rotationY: 0, distance: 100 });
  
  const rotationX = useSharedValue(0);
  const rotationY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Text rendering - simplified for React Native
  // Note: Full text rendering requires additional setup (expo-font + TextGeometry)
  // For now, we'll use colored spheres to represent different types
  function createLabelSprite(text, yOffset, sizeScale = 1) {
    // Placeholder - text rendering will be added with proper font loading
    // For now, return null and we'll add text later
    return null;
  }

  function getType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  function getColor(type) {
    return CONFIG.colors[type] || 0xffffff;
  }

  function getLabelValue(value, type) {
    if (type === 'array') return `[${value.length}]`;
    if (type === 'object') return `{${Object.keys(value).length}}`;
    return String(value);
  }

  function processNode(key, value, parentPos, angleStart, angleEnd, depth, yLevel = 0, scene, connections = []) {
    const type = getType(value);
    
    let pos = new THREE.Vector3(0, yLevel, 0);
    
    if (depth > 0) {
      const angleMiddle = angleStart + (angleEnd - angleStart) / 2;
      const radius = depth * CONFIG.radiusStep;
      
      pos.x = radius * Math.cos(angleMiddle);
      pos.z = radius * Math.sin(angleMiddle);
      pos.y = yLevel;
    }

    const color = getColor(depth === 0 ? 'root' : type);
    const nodeGroup = new THREE.Group();
    nodeGroup.position.copy(pos);

    const geo = new THREE.SphereGeometry(CONFIG.nodeSize, 32, 32);
    const mat = new THREE.MeshPhongMaterial({ color: color, shininess: 100 });
    const mesh = new THREE.Mesh(geo, mat);
    nodeGroup.add(mesh);

    // Text labels will be added later with proper font loading
    // For now, nodes are represented by colored spheres only

    scene.add(nodeGroup);
    
    if (parentPos) {
      connections.push(parentPos.clone(), pos.clone());
    }

    if (type === 'object') {
      const keys = Object.keys(value);
      const count = keys.length;
      if (count > 0) {
        const sectorSize = (angleEnd - angleStart) / count;
        keys.forEach((k, i) => {
          const childStart = angleStart + (i * sectorSize);
          const childEnd = childStart + sectorSize;
          processNode(k, value[k], pos, childStart, childEnd, depth + 1, yLevel, scene, connections);
        });
      }
    } else if (type === 'array') {
      const count = value.length;
      if (count > 0) {
        value.forEach((item, i) => {
          const itemY = yLevel + ((i + 1) * CONFIG.stackHeight);
          const itemPos = pos.clone();
          itemPos.y = itemY;
          processNode(i.toString(), item, pos, angleStart, angleEnd, depth, itemY, scene, connections);
        });
      }
    }

    return connections;
  }

  const onGLContextCreate = async (gl) => {
    glRef.current = gl;

    // Set up Three.js to work with expo-gl
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    scene.fog = new THREE.FogExp2(0x111111, 0.002);
    sceneRef.current = scene;

    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(40, 60, 80);
    cameraRef.current = camera;

    // Create renderer that works with expo-gl
    const renderer = new THREE.WebGLRenderer({
      canvas: {
        width,
        height,
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {},
        clientHeight: height,
        clientWidth: width,
      },
      context: gl,
      antialias: true,
    });
    
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Build the scene
    const connections = [];
    processNode("root", jsonData, null, 0, Math.PI * 2, 0, 0, scene, connections);

    // Create connection lines
    if (connections.length > 0) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints(connections);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.5 });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(lines);
    }
    
    // Grid helper
    const gridHelper = new THREE.PolarGridHelper(200, 16, 8, 64, 0x444444, 0x222222);
    gridHelper.position.y = -5;
    scene.add(gridHelper);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update camera based on gesture controls
      const baseDistance = controlsRef.current.distance;
      const currentDistance = baseDistance * scale.value;
      const rotX = controlsRef.current.rotationX + rotationX.value;
      const rotY = controlsRef.current.rotationY + rotationY.value;
      
      // Spherical coordinates for orbit camera
      camera.position.x = currentDistance * Math.sin(rotY) * Math.cos(rotX);
      camera.position.y = currentDistance * Math.sin(rotX);
      camera.position.z = currentDistance * Math.cos(rotY) * Math.cos(rotX);
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    
    animate();
  };

  // Gesture handlers for mobile touch controls
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      rotationY.value = e.translationX * 0.01;
      rotationX.value = -e.translationY * 0.01; // Negative for natural rotation
    })
    .onEnd(() => {
      controlsRef.current.rotationX += rotationX.value;
      controlsRef.current.rotationY += rotationY.value;
      rotationX.value = 0;
      rotationY.value = 0;
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = 1 / e.scale; // Invert for zoom
    })
    .onEnd(() => {
      controlsRef.current.distance *= scale.value;
      if (controlsRef.current.distance < 20) controlsRef.current.distance = 20;
      if (controlsRef.current.distance > 200) controlsRef.current.distance = 200;
      scale.value = 1;
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <View style={styles.container}>
          <GLView
            style={styles.glView}
            onContextCreate={onGLContextCreate}
          />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  glView: {
    flex: 1,
  },
});
