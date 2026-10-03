import {ThreeCanvas} from '@remotion/three';
import {Composition, useCurrentFrame} from 'remotion';
import * as THREE from 'three';

const FPS = 30;
const SECONDS = 18;
const L = 2.8;
const M = 0.35;
const G = 9.81;
const O0 = 2.12;
const O1 = 3.05;

type State = {omega: number; theta: number; radius: number; tension: number; force: number; phase: number; height: number};
const physics = (frame: number): State => {
  const t = frame / FPS;
  const p = Math.min(t / SECONDS, 1);
  const omega = O0 + (O1 - O0) * (3 * p * p - 2 * p * p * p);
  // Exact integral of the displayed smooth angular-speed ramp.
  const phase = O0 * t + (O1 - O0) * SECONDS * (p ** 3 - 0.5 * p ** 4);
  const height = G / (omega * omega);
  const theta = Math.acos(height / L);
  const radius = L * Math.sin(theta);
  return {omega, theta, radius, tension: M * L * omega * omega, force: M * omega * omega * radius, phase, height};
};

const Rod = ({from, to, color, radius = 0.014, opacity = 1}: {from: THREE.Vector3; to: THREE.Vector3; color: string; radius?: number; opacity?: number}) => {
  const delta = to.clone().sub(from);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.clone().normalize());
  return <mesh position={from.clone().add(to).multiplyScalar(0.5).toArray()} quaternion={q}>
    <cylinderGeometry args={[radius, radius, delta.length(), 10]} />
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} transparent opacity={opacity} />
  </mesh>;
};

const Arrow = ({from, direction, length, color}: {from: THREE.Vector3; direction: THREE.Vector3; length: number; color: string}) => {
  const dir = direction.clone().normalize();
  const end = from.clone().addScaledVector(dir, length);
  const neck = end.clone().addScaledVector(dir, -0.17);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  return <group>
    <Rod from={from} to={neck} color={color} radius={0.026} />
    <mesh position={end.clone().addScaledVector(dir, -0.085).toArray()} quaternion={q}>
      <coneGeometry args={[0.076, 0.19, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  </group>;
};

const Scene = ({s}: {s: State}) => {
  const pivot = new THREE.Vector3(0, 2.12, 0);
  const ball = new THREE.Vector3(s.radius * Math.cos(s.phase), pivot.y - s.height, s.radius * Math.sin(s.phase));
  const center = new THREE.Vector3(0, ball.y, 0);
  const inward = center.clone().sub(ball).normalize();
  const towardPivot = pivot.clone().sub(ball).normalize();
  return <ThreeCanvas width={1120} height={760} camera={{position: [6.3, 4.5, 8.1], fov: 37, near: 0.1, far: 100}}>
    <color attach="background" args={['#071320']} />
    <ambientLight intensity={0.85} />
    <directionalLight position={[4, 7, 5]} intensity={2.1} />
    <pointLight position={[-3, 3, -2]} intensity={28} color="#38bdf8" />
    <gridHelper args={[8, 16, '#20506b', '#19344b']} position={[0, -1.5, 0]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.53, 0]}>
      <planeGeometry args={[9, 9]} />
      <meshStandardMaterial color="#0a1d2e" roughness={0.9} />
    </mesh>
    <mesh position={pivot.toArray()}>
      <sphereGeometry args={[0.1, 24, 24]} />
      <meshStandardMaterial color="#e2f5ff" emissive="#a5d8ff" emissiveIntensity={0.6} />
    </mesh>
    <Rod from={pivot} to={ball} color="#dbeafe" radius={0.018} />
    <Rod from={pivot} to={center} color="#7893a7" radius={0.008} opacity={0.58} />
    <Rod from={center} to={ball} color="#6ed6ff" radius={0.012} opacity={0.75} />
    <mesh rotation={[Math.PI / 2, 0, 0]} position={center.toArray()}>
      <torusGeometry args={[s.radius, 0.012, 8, 120]} />
      <meshBasicMaterial color="#23769b" transparent opacity={0.68} />
    </mesh>
    {Array.from({length: 18}, (_, i) => {
      const a = s.phase - (18 - i) * 0.085;
      return <mesh key={i} position={[s.radius * Math.cos(a), ball.y, s.radius * Math.sin(a)]}>
        <sphereGeometry args={[0.018 + i * 0.002, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.08 + i * 0.035} />
      </mesh>;
    })}
    <mesh position={ball.toArray()}>
      <sphereGeometry args={[0.22, 40, 40]} />
      <meshStandardMaterial color="#42c9f5" emissive="#007fa8" emissiveIntensity={0.48} metalness={0.28} roughness={0.23} />
    </mesh>
    <Arrow from={ball.clone().addScaledVector(towardPivot, 0.26)} direction={towardPivot} length={0.8} color="#fb923c" />
    <Arrow from={ball.clone().add(new THREE.Vector3(0, -0.25, 0))} direction={new THREE.Vector3(0, -1, 0)} length={0.75} color="#f472b6" />
    <Arrow from={ball.clone().addScaledVector(inward, 0.26)} direction={inward} length={0.67} color="#a3e635" />
  </ThreeCanvas>;
};

const Metric = ({name, value, unit, color}: {name: string; value: string; unit: string; color: string}) =>
  <div style={{background: '#102539', border: '1px solid #28475f', borderRadius: 15, padding: '16px 19px'}}>
    <div style={{fontSize: 19, color: '#91a9bc'}}>{name}</div>
    <div style={{marginTop: 7, display: 'flex', alignItems: 'baseline', gap: 7}}>
      <span style={{fontSize: 39, fontWeight: 750, color, fontVariantNumeric: 'tabular-nums'}}>{value}</span>
      <span style={{fontSize: 18, color: '#c0d1df'}}>{unit}</span>
    </div>
  </div>;

const ForceDiagram = ({s}: {s: State}) => {
  const bx = 122 + 112 * Math.sin(s.theta);
  const by = 33 + 112 * Math.cos(s.theta);
  return <div style={{background: '#102539', border: '1px solid #28475f', borderRadius: 17, padding: '17px 22px', flex: 1}}>
    <div style={{fontSize: 23, fontWeight: 700}}>受力分析</div>
    <svg viewBox="0 0 400 205" style={{width: '100%', height: 205}}>
      <defs>
        <marker id="t-head" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#fb923c" /></marker>
        <marker id="g-head" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#f472b6" /></marker>
        <marker id="c-head" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#a3e635" /></marker>
      </defs>
      <line x1="122" y1="33" x2="122" y2="165" stroke="#58758c" strokeDasharray="5 5" />
      <line x1="122" y1="33" x2={bx} y2={by} stroke="#e2e8f0" strokeWidth="2" />
      <circle cx="122" cy="33" r="4" fill="#dbeafe" /><circle cx={bx} cy={by} r="10" fill="#38bdf8" />
      <line x1={bx} y1={by} x2={bx - 51 * Math.sin(s.theta)} y2={by - 51 * Math.cos(s.theta)} stroke="#fb923c" strokeWidth="3" markerEnd="url(#t-head)" />
      <line x1={bx} y1={by} x2={bx} y2={by + 62} stroke="#f472b6" strokeWidth="3" markerEnd="url(#g-head)" />
      <line x1={bx} y1={by} x2={bx - 69} y2={by} stroke="#a3e635" strokeDasharray="5 4" strokeWidth="3" markerEnd="url(#c-head)" />
      <text x={bx - 27} y={by - 49} fill="#fb923c" fontSize="18" fontWeight="bold">T</text>
      <text x={bx + 15} y={by + 66} fill="#f472b6" fontSize="18" fontWeight="bold">mg</text>
      <text x={bx - 94} y={by - 12} fill="#a3e635" fontSize="17" fontWeight="bold">Fₙ</text>
      <text x="130" y="72" fill="#b7cad8" fontSize="17">θ</text>
    </svg>
    <div style={{display: 'flex', gap: 29, fontSize: 19, color: '#dbeafe'}}>
      <span><b style={{color: '#fb923c'}}>T cos θ</b> = mg</span>
      <span><b style={{color: '#fb923c'}}>T sin θ</b> = mω²r</span>
    </div>
    <div style={{fontSize: 17, color: '#8eabc0', marginTop: 15}}>绿色虚线为水平合力，指向圆心</div>
  </div>;
};

export const ConicalPendulum = () => {
  const frame = useCurrentFrame();
  const s = physics(frame);
  return <div style={{position: 'relative', width: 1920, height: 1080, background: '#071320', color: '#f4faff', fontFamily: '"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div style={{position: 'absolute', top: 53, left: 75}}>
      <div style={{fontSize: 20, letterSpacing: 4, fontWeight: 700, color: '#6ed6ff'}}>PHYSICS IN MOTION · 01</div>
      <div style={{fontSize: 58, fontWeight: 800, marginTop: 8}}>圆锥摆的动力学</div>
      <div style={{fontSize: 24, color: '#a1b9cb', marginTop: 7}}>角速度缓慢增大，圆周半径与摆角同步变化</div>
    </div>
    <div style={{position: 'absolute', top: 76, right: 75, border: '1px solid #2d5672', borderRadius: 40, padding: '13px 24px', fontSize: 20, color: '#81d7f7'}}>3D 运动 · 实时受力</div>
    <div style={{position: 'absolute', left: 60, top: 210, width: 1120, height: 760, border: '1px solid #23435a', borderRadius: 23, overflow: 'hidden'}}>
      <Scene s={s} />
      <div style={{position: 'absolute', left: 35, top: 29, color: '#8cafc6', fontSize: 19, letterSpacing: 2}}>三维运动轨迹</div>
      <div style={{position: 'absolute', left: 35, bottom: 28, display: 'flex', gap: 22, fontSize: 18}}>
        <span><b style={{color: '#fb923c'}}>●</b> 绳的拉力</span><span><b style={{color: '#f472b6'}}>●</b> 重力</span><span><b style={{color: '#a3e635'}}>●</b> 向心合力</span>
      </div>
    </div>
    <div style={{position: 'absolute', left: 1210, top: 210, width: 650, height: 760, display: 'flex', flexDirection: 'column', gap: 14}}>
      <div style={{background: '#102b41', border: '1px solid #2d5672', borderRadius: 18, padding: '19px 23px'}}>
        <div style={{fontSize: 19, color: '#93adbf'}}>角速度 ω · 缓慢加速</div>
        <div><span style={{fontSize: 62, color: '#6ed6ff', fontWeight: 800, fontVariantNumeric: 'tabular-nums'}}>{s.omega.toFixed(2)}</span><span style={{fontSize: 24, marginLeft: 12, color: '#d1e0eb'}}>rad/s</span></div>
        <div style={{height: 8, background: '#204c67', borderRadius: 7, marginTop: 11}}><div style={{height: '100%', width: `${100 * frame / (FPS * SECONDS)}%`, background: 'linear-gradient(90deg,#0284c7,#67e8f9)', borderRadius: 7}} /></div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 7, color: '#8aa8bc', fontSize: 16}}><span>{O0.toFixed(2)} rad/s</span><span>{O1.toFixed(2)} rad/s</span></div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13}}>
        <Metric name="轨道半径 r" value={s.radius.toFixed(2)} unit="m" color="#6ed6ff" />
        <Metric name="摆角 θ" value={(s.theta * 180 / Math.PI).toFixed(1)} unit="°" color="#facc15" />
        <Metric name="绳的拉力 T" value={s.tension.toFixed(2)} unit="N" color="#fb923c" />
        <Metric name="向心力 Fₙ" value={s.force.toFixed(2)} unit="N" color="#a3e635" />
      </div>
      <ForceDiagram s={s} />
    </div>
    <div style={{position: 'absolute', bottom: 42, left: 75, right: 75, display: 'flex', justifyContent: 'space-between', fontSize: 18, color: '#86a3b6'}}>
      <span>m = {M.toFixed(2)} kg · g = {G.toFixed(2)} m/s² · L = {L.toFixed(2)} m</span>
      <span>ω² = g / (L cos θ) · r = L sin θ</span>
    </div>
  </div>;
};

export const MyComposition = () => <Composition id="ConicalPendulum3D" component={ConicalPendulum} durationInFrames={FPS * SECONDS} fps={FPS} width={1920} height={1080} />;
